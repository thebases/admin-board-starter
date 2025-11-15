import { useAuth } from '@/providers/auth/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  cn,
  deviceCancelQR,
  deviceGenQR,
  generateRandom16DigitNumber,
  getCurrentTimeStamp,
} from '@/lib/utils'
import { getTopic } from '@/providers/mqtt/GlobalMqttDialog'
import { useMqtt } from '@/providers/mqtt/MqttProvider'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/m/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const auth = useAuth()
  const mqtt = useMqtt()
  const [amount, setAmount] = useState('10000')
  const [orderId, setOrderId] = useState('ORD' + generateRandom16DigitNumber())
  function payQr() {
    console.log('QR Payment initiated')
    // Here you would typically handle the QR payment logic

    navigate({
      to: '/qrpay/process',
      search: {
        amount: amount,
        orderId: orderId,
        account: auth.bankAccount || '',
        bank: auth.bankName || '',
        store: auth.storeName || '',
        dateTime: getCurrentTimeStamp(),
      },
    })
  }
  const cancelQr = () => {
    const topic = getTopic(`device/${auth.defaultDevice}`)
    deviceCancelQR(mqtt, topic)
  }

  const pushMoney = () => {
    const topic = getTopic(`device/${auth.defaultDevice}`)
    console.log(topic)
    if (!mqtt.connected) {
      alert('MQTT client is not connected.')
      return
    }
    if (topic == '') {
      alert('Device is not connected.')
      return
    }
    console.log('Push Maoney')

    deviceGenQR(mqtt, topic, amount, orderId)
  }

  return (
    <div className="w-full flex flex-col items-center align-top bg-white p-0 overflow-hidden min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="w-full bg-foreground p-4 flex items-center space-x-2">
        <img src="/logo_dark.svg" alt="Base Logo" className="h-6" />
        <span className="font-semibold  text-lg text-white">QR Tools</span>
      </div>

      {/* QR Form */}
      <div className="w-full p-4 space-y-2 overflow-y-auto">
        <Card className=" space-y-2">
          <CardContent className="space-y-2 text-4xl">
            <Label className="text-sm font-medium"> Số tiền thanh toán</Label>
            <Input
              placeholder="Số tiền thanh toán"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              className="text-4xl  font-medium border-0 border-b border-gray-300 rounded-none shadow-none focus:ring-0 focus:border-black"
            />
          </CardContent>
        </Card>

        <Card className=" p-y-2">
          <CardContent className="space-y-2">
            <Label className="text-sm font-medium "> Mã hóa đơn</Label>
            <Input
              placeholder="Mã hóa đơn"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="font-medium border-0 border-b border-gray-300 rounded-none shadow-none focus:ring-0 focus:border-black"
            />
          </CardContent>
        </Card>
        <div className="w-full flex flex-row gap-4">
          <Button variant={'default'} className="flex-1 " onClick={payQr}>
            Tạo mã QR
          </Button>
        </div>
        <div className="w-full flex flex-row gap-4">
          <Button
            variant={'default'}
            className={cn(
              'flex-1 ',
              !auth.defaultDevice || auth.defaultDevice == '' ? 'hidden' : '',
            )}
            onClick={() => cancelQr()}
          >
            Hủy mã QR
          </Button>
          <Button
            variant={'default'}
            className={cn(
              'flex-1 ',
              !auth.defaultDevice || auth.defaultDevice == '' ? 'hidden' : '',
            )}
            onClick={() => pushMoney()}
          >
            Tạo mã QR thiết bị
          </Button>
        </div>
        <Label className="w-full text-center text-gray-400">
          Thiết bị: {auth.defaultDevice}
        </Label>

        {/* Logos */}
        <div className="flex justify-around pt-4 text-sm text-center text-gray-600 hidden">
          <div>
            <div>Logo</div>
            <div className="font-medium">VietQR Pay</div>
          </div>
          <div>
            <div>Logo</div>
            <div className="font-medium">VietQR Global</div>
          </div>
        </div>
        <hr className="border-t border-dashed border-gray-300 border-2" />

        {/* Merchant Info */}
        <div className="pt-4 text-sm text-gray-700 space-y-1">
          <div className="flex justify-between">
            <span>Tài khoản</span>
            <span className="font-semibold">
              {/* {auth.userData?.bank_account[0]['acc_object']['account_number']} */}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ngân hàng</span>
            <span className="font-semibold">
              {/* {auth.userData?.bank_account[0]['acc_object']['bank_fullname']} */}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cửa hàng</span>
            <span className="font-semibold">{auth.userData?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
