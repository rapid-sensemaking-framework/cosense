import moment from 'moment'

export default function RenderMaxTime({ seconds }) {
  return moment.duration(seconds, 'seconds').humanize()
}
