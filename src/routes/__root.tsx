import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// import Header from '../components/Header'
import type { AuthContext } from '../providers/auth/auth'

interface BaseRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<BaseRouterContext>()({
  component: () => (
    <>
      {/* <Header /> */}

      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
