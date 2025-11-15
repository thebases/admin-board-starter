import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createFileRoute } from '@tanstack/react-router'
import { QrCode } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/m/transactions')({
  component: InvoiceListPage,
})

// function RouteComponent() {
//   return <div>Hello "/_auth_transactions"!</div>
// }

// Fake transaction data
const mockTransactions = [
  {
    id: 'tx001',
    orderId: 'ORDER001',
    date: '02/08/2023',
    time: '09:41',
    amount: '100.000',
    status: 'success',
  },
  {
    id: 'tx002',
    orderId: 'ORDER002',
    date: '02/08/2023',
    time: '09:41',
    amount: '100.000',
    status: 'success',
  },
  {
    id: 'tx003',
    orderId: 'ORDER003',
    date: '02/08/2023',
    time: '09:41',
    amount: '100.000',
    status: 'cancelled',
  },
]

export default function InvoiceListPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  // const navigate = useNavigate()

  const filtered = statusFilter
    ? mockTransactions.filter((t) => t.status === statusFilter)
    : mockTransactions

  return (
    <div className=" w-full flex flex-col md:flex-row justify-between min-h-[calc(100vh-64px)]">
      <div className="p-4">
        <h1 className="text-lg font-bold text-center">Lịch sử giao dịch</h1>

        <div className="my-4">
          <Select onValueChange={(val: any) => setStatusFilter(val)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Thành công</SelectItem>
              <SelectItem value="cancelled">Đã huỷ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.map((txn) => (
            <Card
              key={txn.id}
              className="flex flex-row items-center justify-between p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <QrCode className="h-8 w-8 text-gray-900" />

                <div className="text-sm">
                  <div className="text-gray-500">
                    {txn.time} – {txn.date}
                  </div>
                  <div className="font-semibold">{txn.orderId}</div>
                  <div className="text-xs text-gray-500">{txn.id}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-medium ${txn.status === `success` ? `text-green-600` : `text-red-500`}`}
                >
                  {txn.status === 'success' ? 'Thành công' : 'Đã huỷ'}
                </div>
                <div className="font-bold text-base">{txn.amount} đ</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="hidden md:flex md:flex-col md:flex-1">
        {/* <Outlet /> */}
      </div>
      {/* Bottom Nav can be added here again if needed */}
    </div>
  )
}
