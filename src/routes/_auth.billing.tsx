import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/billing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "billing"!</div>
}
