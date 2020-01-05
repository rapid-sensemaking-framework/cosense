export default function RenderLimit({ limit }) {
  // TODO pull in constant from somewhere
  return limit === '*' ? 'Unlimited' : limit
}
