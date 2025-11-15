import { useAuth } from '@/providers/auth/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  cn,
  deviceSetMerchant,
  generateRandom16DigitNumber,
  getCurrentDate,
  getCurrentTimeStamp,
  resetMerchant,
} from '@/lib/utils'
import {
  addOrUpdateTopic,
  getTopic,
  removeTopic,
} from '@/providers/mqtt/GlobalMqttDialog'
import { useMqtt } from '@/providers/mqtt/MqttProvider'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_auth/m/device')({
  component: DevicePage,
})

function DevicePage() {
  const mqtt = useMqtt()
  const auth = useAuth()

  const [serial, setSerial] = useState(auth.defaultDevice || '38250701740001') // Default serial number
  const [deviceTopic, setDeviceTopic] = useState(getTopic(`device/${serial}`))
  const [mqttMsg, setMqttMsg] = useState('')
  useEffect(() => {
    if (auth.defaultDevice) {
      connectDevice()
      setDeviceTopic(getTopic(`device/${serial}`))
    }
  }, [])
  const connectDevice = () => {
    addOrUpdateTopic(`device/${serial}`, {
      path: `/base-et389/${serial}/update`,
      title: 'Thông báo',
      description: `từ thiết bị ${serial}`,
    })

    setDeviceTopic(getTopic(`device/${serial}`))
    auth.setDevice(serial)
    console.log('topic', deviceTopic, deviceTopic.length)
    // mqtt.publish(`/base-et389/${serial}/update`, JSON.stringify(payload))
    const ret = deviceSetMerchant(
      mqtt,
      getTopic(`device/${serial}`),
      auth.storeName || '',
      auth.bankAccount || '',
      auth.bankBincode || '',
    )
    ret ? setMqttMsg(`${mqtt.connected}`) : setMqttMsg('Send message failed')
  }

  const pushMoney = (action: string) => {
    if (!mqtt.connected) {
      alert('MQTT client is not connected.')
      return
    }
    let payload = {}
    if (action == 'qr') {
      payload = {
        money: '10000',
        request_id: generateRandom16DigitNumber(),
        order_sn: 'ORD' + generateRandom16DigitNumber(),
        datetime: getCurrentDate(),
        ctime: getCurrentTimeStamp(),
      }
    }
    if (action == 'payment') {
      payload =
        // {"broadcast_type":1,"money":"100","request_id":"fsdf","datetime":"20220819144051","ctime":1660891251}
        {
          broadcast_type: 1,
          money: '10000',
          request_id: generateRandom16DigitNumber(),
          datetime: getCurrentDate(),
          ctime: getCurrentTimeStamp(),
        }
    }

    console.log('Publishing to topic:', deviceTopic, 'with payload:', payload)
    setMqttMsg(JSON.stringify(payload))
    mqtt.publish(`/base-et389/${serial}/update`, JSON.stringify(payload))
  }

  const resetMqtt = () => {
    console.log(mqtt.connected)
    console.log(deviceTopic)
    const ret = resetMerchant(mqtt, deviceTopic)
    if (ret === 0) {
      removeTopic(`device/${serial}`)
      setDeviceTopic('')
      auth.setDevice(null)
      setMqttMsg('MQTT client reset successfully.')
    } else {
      setMqttMsg('No MQTT client to reset.')
    }
  }
  return (
    <div className="w-full flex flex-col items-center align-top p-4 overflow-hidden min-h-[calc(100vh-64px)]">
      <Card className="w-full ">
        <CardHeader className="text-center">
          <h2 className="text-lg font-bold">Kết nối với thiết bị</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Device Serial Number"
            value={serial}
            onChange={(e) => {
              setSerial(e.target.value)
            }}
            className=" font-medium border-0 border-b border-gray-300 rounded-none shadow-none focus:ring-0 focus:border-black"
            disabled={deviceTopic != ''}
          />
          <div className="w-full flex flex-row gap-4 justify-center">
            <Button
              onClick={connectDevice}
              className={cn('w-full', deviceTopic != '' ? 'hidden' : '')}
            >
              Kết nối loa thanh toán
            </Button>
            <Button
              onClick={resetMqtt}
              className={cn('w-full', deviceTopic == '' ? 'hidden' : '')}
            >
              Hủy kết nối
            </Button>
          </div>
          <Label className={cn('w-full', deviceTopic == '' ? 'hidden' : '')}>
            Test thiết bị
          </Label>
          <div className="w-full flex flex-row gap-4 justify-center">
            <Button
              className={cn('w-36', deviceTopic == '' ? 'hidden' : '')}
              onClick={() => pushMoney('qr')}
            >
              Push QR
            </Button>
            <Button
              className={cn('w-36', deviceTopic == '' ? 'hidden' : '')}
              onClick={() => pushMoney('payment')}
            >
              Push Payment
            </Button>
          </div>

          <div className="w-100  max-w-full text-sm text-gray-600 overflow-x-hidden">
            <p className="whitespace-pre-wrap break-words max-w-full">
              MQTT Message: {mqttMsg}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
