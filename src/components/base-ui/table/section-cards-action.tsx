import { IconLayoutNavbarInactive } from '@tabler/icons-react'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'

export function SectionCardsAction() {
  const items = [
    {
      title: 'Tạo lệnh chi',
      url: '#',
      icon: IconLayoutNavbarInactive,
    },
    {
      title: 'Duyệt lệnh chi',
      url: '#',
      icon: IconLayoutNavbarInactive,
    },
    {
      title: 'Tạo lệnh thu',
      url: '#',
      icon: IconLayoutNavbarInactive,
    },
    {
      title: 'Nộp tiền',
      url: '#',
      icon: IconLayoutNavbarInactive,
    },
  ]
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card flex flex-row gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card flex-1">
        <CardHeader>
          <CardDescription>Quick Action</CardDescription>
        </CardHeader>
        <CardDescription className="px-4 flex flex-row flex-wrap gap-4 align-middle justify-center">
          {items.map((item) => (
            <div key={item.title}>
              <div>
                <a
                  href={item.url}
                  className="flex flex-col justify-center items-center"
                >
                  {item.icon && (
                    <item.icon className="h-10 w-10" aria-hidden="true" />
                  )}
                  <span className="w-15 text-center">{item.title}</span>
                </a>
              </div>
            </div>
          ))}
        </CardDescription>
        <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
      </Card>
      <Card className="@container/card flex-1">
        <CardHeader>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardDescription className="px-4 flex flex-row flex-wrap gap-4 align-middle justify-center">
          Dành cho quảng cáo
        </CardDescription>
        <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
      </Card>
    </div>
  )
}
