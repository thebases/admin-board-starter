import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/transactions')({
  component: InvoiceListPage,
})

// function RouteComponent() {
//   return <div>Hello "/_auth_transactions"!</div>
// }

// Fake transaction data
// const mockTransactions = [
//   {
//     id: 'tx001',
//     orderId: 'ORDER001',
//     date: '02/08/2023',
//     time: '09:41',
//     amount: '100.000',
//     status: 'success',
//   },
//   {
//     id: 'tx002',
//     orderId: 'ORDER002',
//     date: '02/08/2023',
//     time: '09:41',
//     amount: '100.000',
//     status: 'success',
//   },
//   {
//     id: 'tx003',
//     orderId: 'ORDER003',
//     date: '02/08/2023',
//     time: '09:41',
//     amount: '100.000',
//     status: 'cancelled',
//   },
// ]

export default function InvoiceListPage() {
  // const [statusFilter, setStatusFilter] = useState<string | null>(null)
  // const navigate = useNavigate()

  // const filtered = statusFilter
  //   ? mockTransactions.filter((t) => t.status === statusFilter)
  //   : mockTransactions

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* <BaseTable inputData={[]} /> */}
    </div>
  )
}
