import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/trans_va')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/trans_va"!</div>
}
