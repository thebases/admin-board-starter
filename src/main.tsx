import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
// Add AuthProvider to the context
import { AuthProvider, useAuth } from './providers/auth/auth.tsx'

import './styles.css'
import './i18n'
import reportWebVitals from './reportWebVitals.ts'
import { MqttProvider } from './providers/mqtt/MqttProvider.tsx'
import GlobalMqttDialog from './providers/mqtt/GlobalMqttDialog.tsx'
import { InstallPwaDialog } from './components/base-ui/installPwaDialog.tsx'
import { ThemeProvider } from './providers/theme-provider.tsx'
import { disableLogs, welcomeToBase } from '@/lib/logger'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="base-ui-theme">
        <MqttProvider>
          <AuthProvider>
            <InnerApp />
          </AuthProvider>
          <GlobalMqttDialog />
          <InstallPwaDialog />
        </MqttProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
