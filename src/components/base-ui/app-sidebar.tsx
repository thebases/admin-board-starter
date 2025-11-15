'use client'

import * as React from 'react'
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'

import { NavMain } from '@/components/base-ui/nav-main'
import { NavUser } from '@/components/base-ui/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from '@/providers/auth/auth'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const auth = useAuth()
  const data = {
    user: {
      name: 'The Base',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Trang chủ',
        url: '/home',
        icon: IconDashboard,
        isShow: auth.permission?.mp_view_dashboard?.r || false,
      },
      {
        title: 'Tài khoản',
        url: '/account',
        icon: IconListDetails,
        isShow: auth.permission?.mp_view_banks?.r || false,
      },
      {
        title: 'Giao dịch',
        url: '/transactions',
        icon: IconChartBar,
        isShow: auth.permission?.mp_view_transaction?.r || false,
      },
      {
        title: 'Giao dịch thu tiền',
        url: '/trans_va',
        icon: IconFolder,
        isShow: auth.permission?.mp_view_transaction?.r || false,
      },
      {
        title: 'Kênh bán hàng',
        url: '/sale_channel',
        icon: IconUsers,
        isShow: auth.permission?.mp_view_channel?.r || false,
      },
      {
        title: 'Thu tiền',
        url: '/invoices',
        icon: IconUsers,
        isShow: auth.permission?.mp_view_invoice?.r || false,
      },
      {
        title: 'Ngân sách',
        url: '/budget',
        icon: IconUsers,
        isShow: auth.permission?.mp_view_budget?.r || false,
      },
      {
        title: 'Chi tiền',
        url: '/receipt',
        icon: IconUsers,
        isShow: auth.permission?.mp_view_receipt?.r || false,
      },
    ],
    navSecondary: [
      {
        title: 'Tích hợp',
        url: '/integration',
        icon: IconUsers,
      },
      {
        title: 'Thông tin & Cấu hình',
        url: '/settings',
        icon: IconSettings,
      },
      {
        title: 'Hỗ trợ',
        url: '/support',
        icon: IconHelp,
      },
    ],
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a onClick={() => router.navigate({ to: '/' })}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{props.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
