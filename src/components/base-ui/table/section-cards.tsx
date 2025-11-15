import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrencyString } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

// Each item (row) you want to render
type Item = {
  id: string // required for key
  className?: string // extra classes for the Card
  value?: React.ReactNode // main number/value
  placeholder?: string // label/description (e.g. "Total Revenue")
  delta?: string // e.g. "+12.5%" | "-20%"
}

// The SectionCards container accepts normal <div> props + items[]
type SectionCardsProps = React.ComponentProps<'div'> & {
  items: Item[]
}

export function SectionCards({
  items,
  className,
  ...divProps
}: SectionCardsProps) {
  const { t } = useTranslation()
  return (
    <div
      className={[
        'grid grid-cols-1 md:grid-cols-2 @xl/main:grid-cols-4 gap-4 px-4 lg:px-6',
        '*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs',
        'dark:*:data-[slot=card]:bg-card',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...divProps}
    >
      {items.map((item) => {
        const isDown = item.delta?.trim().startsWith('-')
        const TrendIcon = isDown ? IconTrendingDown : IconTrendingUp

        return (
          <Card
            key={item.id}
            data-slot="card"
            className={item.className ?? '@container/card'}
          >
            <CardHeader>
              <CardDescription>{item.id ?? '—'}</CardDescription>

              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrencyString(item.value as string, 'vn')}
                </CardTitle>

                {item.delta && (
                  <Badge variant="outline" className="gap-1.5">
                    <TrendIcon className="h-4 w-4" />
                    {item.delta}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              {/* <div className="line-clamp-1 flex gap-2 font-medium">
                {isDown ? 'Down this period' : 'Trending up this month'}{' '}
                <TrendIcon className="size-4" />
              </div> */}
              <div className="text-muted-foreground">
                {t('global.lbl_no_txn')} {item.placeholder ?? '—'}{' '}
                {t('global.lbl_items')}.
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
