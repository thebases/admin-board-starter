import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { Outlet, redirect } from '@tanstack/react-router'
import { BarChart, Home, TabletSmartphone, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { addOrUpdateTopic } from '@/providers/mqtt/GlobalMqttDialog'
import { useAuth } from '@/providers/auth/auth'
import { useIsMobile } from '@/hooks/useIsMobile'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/base-ui/app-sidebar'
import { SiteHeader } from '@/components/base-ui/site-header'
import { disableLogs, welcomeToBase } from '@/lib/logger'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthLayout,
})
// ========== VARIABLES ========
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'production'
let isInitialState = true

function AuthLayout() {
  const location = useLocation()
  const auth = useAuth()
  const isMobile = useIsMobile()
  const router = useRouter()
  useEffect(() => {
    addOrUpdateTopic(`/base/${auth.user}/update`, {
      path: `/base/${auth.user}/update`,
      title: 'Thông báo',
      description: 'Thông báo từ hệ thống',
    })
    if (isInitialState) {
      if (ENVIRONMENT === 'production') {
        disableLogs()
      } else {
        welcomeToBase()
      }
    }
    isInitialState = false
  }, [])

  useEffect(() => {
    let target = ''

    if (!isMobile) {
      // Desktop: if user somehow lands on /m/*, strip it
      if (!location.pathname.startsWith('/m')) return
      target = location.pathname.replace(/^\/m(\/?)/, '/')

      // normalize empty → /home
      if (target === '' || target === '/') target = '/home'
    } else {
      // Mobile: if not already under /m/*, push it there
      if (location.pathname.startsWith('/m')) return
      if (location.pathname === '/' || location.pathname === '/home') {
        target = '/m/home'
      } else if (
        location.pathname === '/login' ||
        location.pathname === '/m/login'
      ) {
        target = '/login'
      } else {
        target = `/m${location.pathname}`
      }
    }

    // preserve query params
    if (location.searchStr) {
      target += `?${location.searchStr}`
    }

    // nothing to do
    if (!target) return // navigate with fallback if target route doesn't exist
    ;(async () => {
      try {
        await router.navigate({ to: target, replace: true })
      } catch {
        await router.navigate({
          to: isMobile ? '/m/account' : '/home',
          replace: true,
        })
      }
    })()
  }, [isMobile, location.pathname, location.searchStr, router])
  const isActive = (path: string) => location.pathname.startsWith(path)
  if (isMobile) {
    return (
      <div
        className="w-full min-w-[380px] flex flex-col items-center justify-between bg-white"
        style={{ height: '100vh' }}
      >
        <div className="w-full flex flex-col justify-between items-center overflow-y-auto flex-1">
          <Outlet />
        </div>

        {/* Bottom Nav */}
        <div
          className={cn(
            'w-full  border-t flex justify-around py-2 text-sm text-gray-600',
            isActive('/qrpay') ? 'hidden' : 'h-[64px]',
          )}
        >
          <a
            onClick={() => router.navigate({ to: '/m/account' })}
            className={`flex flex-col flex-1 items-center ${isActive('/m/account') ? 'font-bold' : 'text-gray-300'}`}
          >
            <BarChart className="h-5 w-5" />
            <span>Giao dịch</span>
          </a>
          <a
            onClick={() => router.navigate({ to: '/m/home' })}
            className={`flex flex-col flex-1 items-center ${isActive('/m/home') ? 'font-bold' : 'text-gray-300'}`}
          >
            <Home className="h-5 w-5" />
            <span>Thao tác</span>
          </a>
          <a
            onClick={() => router.navigate({ to: '/m/device' })}
            className={`flex flex-col flex-1 items-center ${isActive('/m/device') ? 'font-bold' : 'text-gray-300'}`}
          >
            <TabletSmartphone className="h-5 w-5" />
            <span>Thiết bị</span>
          </a>
          <a
            onClick={() => router.navigate({ to: '/m/settings' })}
            className={cn(
              `flex flex-col flex-1 items-center ${isActive('/settings') ? 'font-bold' : 'text-gray-300'}`,
            )}
          >
            <User className="h-5 w-5" />
            <span>Tài khoản</span>
          </a>
          {/* <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild className="p-0 m-0 ">
            <Button
              variant="ghost"
              className={`flex flex-col  w-[96px] p-0 items-center }`}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>Tác vụ</span>
            </Button>
          </DrawerTrigger>

          <DrawerContent className="p-4 pb-8">
            <h2 className="text-lg font-semibold mb-4">Tác vụ</h2>
            <div className="flex flex-col justify-center space-y-2">
              <Link
                to="/account"
                className="w-full text-center py-2 border-b"
                onClick={() => setOpen(false)}
              >
                Cập nhật thông tin
              </Link>
              <Button
                variant={'ghost'}
                onClick={handleLogout}
                className="w-full text-left py-2 border-b text-red-600"
              >
                Đăng xuất
              </Button>
            </div>
          </DrawerContent>
        </Drawer> */}
        </div>
      </div>
    )
  } else {
    return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" title="CASAFLOW" collapsible="icon" />
        <SidebarInset className="overflow-hidden">
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
}
