// noflo input types
// all, string, number, int, object, array, boolean, color, date, bang, function, buffer, stream
// map these to form inputs
// allow for overrides
const nofloTypeMap = {
  string: 'Text',
  number: 'Text',
  int: 'Text',
  boolean: 'Checkbox', // TODO
  array: 'Text',
  object: 'Text',
  all: 'Text'
  // TODO: the rest
}
const specialPorts = {
  contactable_configs: 'RegisterConfig',
  statements: 'Textarea'
}
// TODO: create a default?
const mapInputToFormFieldType = (expectedInput) => {
  const { type, port, inputTypeOverride } = expectedInput
  // specialPorts > inputTypeOverride > basic type
  const name = specialPorts[port] || inputTypeOverride || nofloTypeMap[type]
  return `Form${name}`
}

export {
  mapInputToFormFieldType
}