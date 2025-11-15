// src/hooks/useTopicListener.ts
import { useEffect, useState } from 'react'
import { useMqtt } from '@/providers/mqtt/MqttProvider'

export function useTopicListener(topic: string) {
  const { subscribeToTopic, lastMessage } = useMqtt()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    subscribeToTopic(topic)
  }, [subscribeToTopic, topic])

  useEffect(() => {
    if (lastMessage?.topic === topic) {
      setMessage(lastMessage.payload)
    }
  }, [lastMessage, topic])

  return message
}
