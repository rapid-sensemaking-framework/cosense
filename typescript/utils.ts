/*
 This file is used in the frontend, and backend files, so beware what you import/require here!
*/

const guidGenerator = (): string => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
}

const remainingTime = (maxTime: number, startTime: number) => {
  const calc = (maxTime - (Date.now() - startTime) / 1000).toFixed() // round it
  // don't bother with negative values
  return Math.max(parseInt(calc), 0)
}

const getRegister = (env) => {
  const {
    REGISTER_HOST,
    REGISTER_PORT
  } = env
  return REGISTER_HOST + (REGISTER_PORT ? `:${REGISTER_PORT}` : '')
}
const getRegisterAddress = (env, protocolKey) => {
  return `${env[protocolKey]}://${getRegister(env)}`
}

export {
  guidGenerator,
  remainingTime,
  getRegisterAddress
}