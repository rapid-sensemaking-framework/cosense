// https://github.com/flowbased/fbp-graph/blob/master/src/Graph.coffee
// https://flowbased.github.io/fbp-protocol/
import * as fbpClient from 'fbp-client'
import { Graph, ExpectedInput } from '../types'

const createFbpClient = async (address: string, secret: string) => {
  const client = await fbpClient(
    {
      address,
      protocol: 'websocket',
      secret
    },
    {
      commandTimeout: 5000
    }
  )
  await client.connect()
  return client
}

const componentMeta = async (
  expectedInputs: ExpectedInput[],
  graph: Graph,
  runtimeAddress: string,
  runtimeSecret: string
): Promise<ExpectedInput[]> => {
  const client = await createFbpClient(runtimeAddress, runtimeSecret)
  const components = await client.protocol.component.list()
  /// TODO: disconnect?
  return expectedInputs.map(
    (e: ExpectedInput): ExpectedInput => {
      const componentName = graph.processes[e.process].component
      const component = components.find(c => c.name === componentName)
      const port = component.inPorts.find(i => i.id === e.port)
      return {
        ...e,
        label: e.label || port.description,
        type: port.type,
        component: componentName
      }
    }
  )
}

export { createFbpClient, componentMeta }

/*
client.protocol = {
    component: {
        list,
        getsource,
        source
    },
    graph: {
        clear,
        addnode,
        removenode,
        renamenode,
        changenode,
        addedge,
        removeedge,
        changeedge,
addinitial,
removeinitial,
addinport,
removeinport,
renameinport,
addoutport,
removeoutport,
renameoutport,
addgroup,
removegroup,
renamegroup,
changegroup,
send
},
network: {
start,
getstatus,
stop,
persist,
debug,
edges
},
runtime: {
getruntime,
packet
},
trace: {
start,
stop,
dump,
clear
}
}
*/

/*
const graph = new fbpGraph('one-plus-one');
      graph.addNode('repeat', 'core/Repeat');
      graph.addNode('plus', 'foo/PlusOne');
      graph.addNode('output', 'core/Output');
      graph.addEdge('repeat', 'out', 'plus', 'val');
      graph.addEdge('plus', 'out', 'output', 'in');
      graph.addInitial(1, 'repeat', 'in');
      return client.protocol.graph.send(graph, true)

client.protocol.graph.addnode({
        id: 'foo',
        component: 'bar',
        graph: 'not-existing',
      })

client.protocol.network.start({
        graph: 'one-plus-one',
      })

client.protocol.network.getstatus({
        graph: 'one-plus-one',
      })

client.protocol.runtime.packet({
        graph: 'exported-plus-one',
        event: 'data',
        port: 'in',
        payload: 1,
      })

client.protocol.network.stop({
        graph: 'exported-plus-one',
      })

client.disconnect()
*/
