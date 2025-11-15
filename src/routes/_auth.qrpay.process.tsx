import { useAuth } from '@/providers/auth/auth'
import VietQRCode from '@/components/base-ui/vietqr-code'
import { genVietQR } from '@/lib/vietqr'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_auth/qrpay/process')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    // You can add validation logic here if needed
    return search as {
      orderId?: string
      amount?: string
      account?: string
      bank?: string
      store?: string
      dateTime?: number
    }
  },
})

function RouteComponent() {
  const search = Route.useSearch() // ✅ search params are typed and available
  const auth = useAuth()
  const [qrStr, setQrStr] = useState('')
  useEffect(() => {
    if (search) {
      setQrStr(
        genVietQR(
          search.amount || '0',
          auth.bankBincode || '970432',
          auth.bankAccount || '0',
          search.orderId || 'Chuyen khoan',
          auth.storeName || '',
        ),
      )
    }
  }, [])
  // You can load invoice data with TanStack Query here using invoiceId
  // const [amount, setAmount] = useState<number>()
  // const [orderId, setOrderId] = useState<string>()
  // const [account, setAccount] = useState<string>('1234567890')
  // const [bank, setBank] = useState<string>('Base Bank')
  // const [store, setStore] = useState<string>('Base Store')
  // setAmount(Number(search.amount) || 10000)
  // setOrderId(
  //   search.orderId || 'ORD' + Math.random().toString(36).substring(2, 15),
  // )
  // setAccount('1234567890')
  // setBank('Base Bank')
  // setStore('Base Store')

  console.log('QR Payment Process initiated with search params:', search)

  return (
    <div className="flex flex-col p-4">
      {/* Top QR Section */}
      <div className="flex flex-col justify-center items-center text-center ">
        {/* Placeholder QR Code */}
        <div className="w-[80%] aspect-square flex items-center justify-center">
          <VietQRCode
            qrString={qrStr}
            payment_amount={Number(search.amount) || 10000}
            className="w-full"
            size={240}
          />
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-6 rounded-xl bg-white shadow-md p-6 space-y-4">
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-500">Số tiền thanh toán</p>
          <p className="text-2xl font-bold tracking-wide">
            {search.amount} <span className="text-base font-medium">đ</span>
          </p>
        </div>

        <hr className="border-dashed" />

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Tài khoản</span>
            <span className="font-medium">{auth.bankAccount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngân hàng</span>
            <span className="font-medium">{auth.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cửa hàng</span>
            <span className="font-medium">{auth.storeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Đơn hàng</span>
            <span className="font-medium">{search.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Thời gian GD</span>
            <span className="font-medium">{search.dateTime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
