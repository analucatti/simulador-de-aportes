import type { StatusType } from '../types'

interface Props {
  type: StatusType
  message: string
}

export default function StatusMessage({ type, message }: Props) {
  if (!type) return null
  return <div className={`status status-${type}`}>{message}</div>
}
