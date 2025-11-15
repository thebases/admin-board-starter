// src/providers/MqttProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import mqtt from 'mqtt'

type Message = {
  topic: string
  payload: string
}

export type MqttContextType = {
  client: mqtt.MqttClient | null
  connected: boolean
  lastMessage: Message | null
  subscribeToTopic: (topic: string) => void
  publish: (topic: string, message: string) => void
}

const MqttContext = createContext<MqttContextType>({
  client: null,
  connected: false,
  lastMessage: null,
  subscribeToTopic: () => {},
  publish: () => {},
})

export const useMqtt = () => useContext(MqttContext)

export function MqttProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null)
  const [connected, setConnected] = useState(false)
  // Should use useEffect in other components to get the last message
  // Using this way, the useEffect will only run once for the first message
  // if the next message is received and same as lastMessage, it won't update and run code
  const [lastMessage, setLastMessage] = useState<Message | null>(null)
  const options = {
    keepalive: 60,
    username: 'thebase',
    password: 'theBase15112023@',
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      retain: false,
    },
  }

  const publish = useCallback(
    (topic: string, message: string) => {
      if (!client || !connected) return
      client.publish(topic, message, { qos: 1 }, (err) => {
        if (err) console.error('Failed to publish', err)
        else console.log(`Published to ${topic}: ${message}`)
      })
    },
    [client, connected],
  )

  const subscribeToTopic = useCallback(
    (topic: string) => {
      if (!client || !connected) return
      client.subscribe(topic, (err) => {
        if (err) console.error('Failed to subscribe', err)
        else console.log('Subscribed to topic:', topic)
      })
    },
    [client, connected],
  )

  useEffect(() => {
    const mqttClient = mqtt.connect('wss://mqtt.thebase.vn/mqtt', options)
    if (!mqttClient) {
      console.error('Failed to create MQTT client')
      return
    }
    const handleMessage = (topic: string, payload: Buffer) => {
      const message = payload.toString()
      console.log('Received message:', message)
      setLastMessage({ topic, payload: message })
    }

    mqttClient.on('connect', () => {
      console.log('MQTT connected')
      setConnected(true)
    })

    mqttClient.on('message', handleMessage)

    mqttClient.on('error', (err) => {
      console.error('MQTT Error', err)
    })

    mqttClient.on('close', () => {
      console.log('MQTT connection closed')
      // setConnected(false)
    })

    setClient(mqttClient)

    return () => {
      mqttClient.end()
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      client,
      connected,
      lastMessage,
      subscribeToTopic,
      publish,
    }),
    [client, connected, lastMessage, subscribeToTopic, publish],
  )

  return (
    <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
  )
}
