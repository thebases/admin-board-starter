import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "Support"!</div>
}
