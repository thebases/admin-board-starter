import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  createFileRoute,
  Outlet,
  Link,
  useRouter,
} from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/qrpay')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const { orderId, amount, datetime, requestId, transId } = search as {
    orderId: string
    amount: string
    datetime: string
    requestId: string
    transId: string
  }
  const isActive = (path: string) => location.pathname.startsWith(path)
  // const resultMessage = useTopicListener(`/base-et389/38250701740001/update`)
  const [bottomNavOpen, setBottomNavOpen] = useState(true)

  // useEffect(() => {
  //   if (location.href.startsWith('/qrpay')) {
  //     console.log('useEffect in _auth/qrpay ...')
  //     if (resultMessage) {
  //       handleSuccess(resultMessage)
  //       // Handle the received message here
  //       // For example, you can update the state or trigger a notification
  //     } else {
  //       handleError(resultMessage)
  //     }
  //   }
  // }, [resultMessage])

  function handleCheck() {
    console.log('Checking QR Payment status...')
    // Logic to check QR payment status
    router.invalidate().finally(() => {
      setBottomNavOpen(false)
      navigate({
        to: '/qrpay/result',
        search: {
          orderId: orderId || '12345',
          amount: amount || '1000000',
          datetime: datetime,
          requestId: requestId,
          transId: transId,
          result: 'success',
        },
      })
    })
  }
  // function handleError(data: any) {
  //   console.error('Error in QR Payment process', data)
  //   // Logic to handle errors in QR payment
  // }
  // function handleSuccess(data: any) {
  //   console.log('QR Payment successful')
  //   console.log('Payment Data:', data)
  //   // Logic to handle successful QR payment
  // }
  return (
    <div className="max-w-[480px] min-w-[360px] min-h-[calc(100vh)] flex flex-col items-center justify-between bg-white overflow-hidden">
      <div className="w-full flex flex-col justify-between  h-full overflow-y-auto flex-1">
        {' '}
        <Outlet />
      </div>

      {/* Action Buttons */}
      <div
        className={cn(
          'w-full   border-t flex flex-row items-center justify-around p-4 gap-4 text-sm text-gray-600',
          isActive('/qrpay') && !isActive('/qrpay/result') && bottomNavOpen
            ? 'h-[64px]'
            : 'hidden',
        )}
      >
        <Link to="/home" className="flex-1 text-black border-black text-center">
          Hủy giao dịch
        </Link>
        <Button
          className="flex-1 bg-black text-white hover:bg-gray-900"
          onClick={handleCheck}
        >
          Kiểm tra
        </Button>
      </div>
    </div>
  )
}
