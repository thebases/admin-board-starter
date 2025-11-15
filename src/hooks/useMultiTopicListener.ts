// src/hooks/useMultiTopicListener.ts
import { useEffect, useState } from 'react'
import { useMqtt } from '@/providers/mqtt/MqttProvider'

export function useMultiTopicListener(topics: string[]) {
  const { subscribeToTopic, lastMessage } = useMqtt()
  const [message, setMessage] = useState<{
    topic: string
    payload: string
  } | null>(null)

  useEffect(() => {
    topics.forEach(subscribeToTopic)
  }, [subscribeToTopic, topics])

  useEffect(() => {
    if (lastMessage && topics.includes(lastMessage.topic)) {
      setMessage(lastMessage)
    }
  }, [lastMessage, topics])

  return message
}
