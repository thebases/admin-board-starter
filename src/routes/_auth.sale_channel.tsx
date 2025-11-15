import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sale_channel')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello sale_channel!</div>
}
