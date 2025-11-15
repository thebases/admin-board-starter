import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/transactions/$txn')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/transactions/$txn"!</div>
}
