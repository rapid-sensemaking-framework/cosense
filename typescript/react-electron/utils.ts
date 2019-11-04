/*
 This file is used in the frontend, and backend files, so beware what you import/require here!
*/

import { ExpectedInput, Stage, Graph } from "./types"
import { createFbpClient } from "./fbp"

const guidGenerator = (): string => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
}

const remainingTime = (maxTime: number, startTime: number) => {
  const calc = (maxTime - (Date.now() - startTime) / 1000).toFixed() // round it
  // don't bother with negative values
  return Math.max(parseInt(calc), 0)
}

const componentMetaForStages = async (stages: Stage[], graph: Graph, runtimeAddress: string, runtimeSecret: string): Promise<Stage[]> => {
  const client = await createFbpClient(runtimeAddress, runtimeSecret)
  const components = await client.protocol.component.list()
  /// TODO: disconnect?
  return stages.map((stage: Stage): Stage => {
    return {
      ...stage,
      expectedInputs: stage.expectedInputs.map((e: ExpectedInput): ExpectedInput => {
        const componentName = graph.processes[e.process].component
        const component = components.find((c) => c.name === componentName)
        const port = component.inPorts.find((i) => i.id === e.port)
        return {
          ...e,
          label: e.label || port.description,
          type: port.type,
          component: componentName
        }
      })
    }
  })
}

export {
  guidGenerator,
  remainingTime,
  componentMetaForStages
}