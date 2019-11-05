
import * as fbpGraph from 'fbp-graph'
import {
  GraphConnection,
  Graph,
} from '../types'
import {
  createFbpClient
} from './fbp'


const start = async (jsonGraph, runtimeAddress: string, runtimeSecret: string, dataWatcher = (signal) => { }): Promise<void> => {
  const client = await createFbpClient(runtimeAddress, runtimeSecret)
  /// TODO: disconnect?
  return new Promise((resolve, reject) => {
    fbpGraph.graph.loadJSON(jsonGraph, async (err, graph) => {
      if (err) {
        reject(err)
        return
      }
      await client.protocol.graph.send(graph, true)

      const observer = client.observe(['network:*'])

      try {
        await client.protocol.network.start({
          graph: graph.name,
        })
      } catch (e) {
        if (e.toString() !== 'Error: network:start timed out') reject(e)
        // ignore network:start timed out error, it still starts
      }
      // forward each network data signal for this specific graph
      client.on('network', signal => {
        if (signal.command === 'data' && signal.payload.graph === graph.name) {
          // just forward the payload itself, as other meta is assumed
          dataWatcher(signal.payload)
        }
      })
      // we receive two useful things here:
      // DATA signals, and STOPPED signal, oh and ERROR signals
      // console.log(signals)
      const signals = await observer.until(['network:stopped'], ['network:error', 'network:processerror'])
      const stopped = signals.find(signal => signal.command === 'stopped' && signal.payload.graph === graph.name)
      const error = signals.find(signal => signal.command === 'error' && signal.payload.graph === graph.name)
      const processError = signals.find(signal => signal.command === 'processerror' && signal.payload.graph === graph.name)
      if (stopped) resolve()
      else reject(error || processError)
    })
  })
}

const overrideJsonGraph = (graphConnections: GraphConnection[], graph: Graph) => {
  // most relevant connections are inputs
  const connections = graph.connections.map(connection => {
    const foundOverride = graphConnections.find(input => {
      return input.tgt.process === connection.tgt.process && input.tgt.port === connection.tgt.port
    })
    return foundOverride || connection
  })

  const modifiedGraph = {
    ...graph,
    // override the name, give a unique name to this graph
    properties: {
      ...graph.properties,
      name: `${Math.random() * 100}randomid`
    },
    // override the connections, or inputs
    connections
  }

  return modifiedGraph
}

export {
  overrideJsonGraph,
  start
}