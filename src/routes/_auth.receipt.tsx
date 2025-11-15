import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/receipt')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/va_txn"!</div>
}
