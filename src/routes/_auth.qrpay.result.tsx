import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/_auth/qrpay/result')({
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch() // ✅ search params are typed and available
  const { orderId, amount, datetime, requestId, transId, result } = search as {
    orderId: string
    amount: string
    datetime: string
    requestId: string
    transId: string
    result: string
  }
  const navigate = Route.useNavigate()

  function onComplete() {
    console.log('QR Payment result completed', result)
    // Logic to handle completion of QR payment result
    navigate({
      to: '/',
    })
  }
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full flex flex-col  flex-1 items-center text-center">
        {/* Checkmark Icon */}
        <div className="rounded-full bg-green-50 shadow-green-50 p-2 mb-4">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        {/* Amount */}
        <div className="text-2xl font-bold mb-2">
          {amount}
          <span className="text-base font-normal"> đ</span>
        </div>

        {/* Success Alert */}
        <Alert className="w-full flex flex-row items-center justify-center max-w-md mt-3 bg-green-50 border-green-500  text-green-600 ">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-black">
            Giao dịch thành công.
          </AlertDescription>
        </Alert>

        {/* Info Card */}
        <Card className="w-full max-w-md mt-4 shadow-md rounded-2xl">
          <CardContent className="p-4 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Mã hoá đơn</span>
              <span className="font-medium text-black">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian giao dịch</span>
              <span className="font-medium text-black">{datetime}</span>
            </div>
            <div className="flex justify-between">
              <span>Mã yêu cầu</span>
              <span className="font-medium text-black">{requestId}</span>
            </div>
            <div className="flex justify-between">
              <span>Mã giao dịch</span>
              <span className="font-medium text-black">{transId}</span>
            </div>

            <hr className="border-t border-dashed border-gray-300 border-2" />

            {/* <div className="text-center text-muted-foreground text-xs">
              Thông tin thêm
            </div>
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>?</span>
              <span>?</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>?</span>
              <span>?</span>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <Button
        onClick={onComplete}
        variant={'default'}
        className="mt-6  w-full text-base font-semibold py-6"
        size="lg"
      >
        Hoàn tất
      </Button>
    </div>
  )
}
