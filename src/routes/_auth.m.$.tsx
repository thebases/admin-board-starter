import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/m/$')({
  beforeLoad: () => {
    throw redirect({ to: '/m/account', replace: true })
  },
})
