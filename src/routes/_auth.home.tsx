import { createFileRoute } from '@tanstack/react-router'
import { SectionCards } from '@/components/base-ui/table/section-cards'
import { ChartAreaInteractive } from '@/components/base-ui/chart-area-interactive'
import { DataTable } from '@/components/base-ui/data-table'
import data from './data.json'
import Example from '@/components/base-ui/drawer/Example'
export const Route = createFileRoute('/_auth/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            items={[
              {
                id: 'rev',
                placeholder: 'Total Revenue',
                value: '$1,250.00',
                delta: '+12.5%',
              },
              {
                id: 'cust',
                placeholder: 'New Customers',
                value: '1,234',
                delta: '-20%',
              },
              {
                id: 'acct',
                placeholder: 'Active Accounts',
                value: '45,678',
                delta: '+12.5%',
              },
              {
                id: 'growth',
                placeholder: 'Growth Rate',
                value: '4.5%',
                delta: '+4.5%',
              },
            ]}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
          <Example />
        </div>
      </div>
    </div>
  )
}
