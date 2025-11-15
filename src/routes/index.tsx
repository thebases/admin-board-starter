import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: () => <Navigate to="/login" />,
})

// function HomeComponent() {
//   redirect({
//     to: '/login',
//   })
//   return <></>
// }
