// src/components/GlobalMqttDialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { useMultiTopicListener } from '@/hooks/useMultiTopicListener'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Topic = { path: string; title: string; description?: string }
const topicConfig: Record<string, Topic> = {
  // 'alerts/error': {
  //   title: '🚨 Error Alert',
  //   description: 'An error has occurred.',
  // },
  // 'alerts/warning': {
  //   title: '⚠️ Warning Alert',
  //   description: 'Please check the system.',
  // },
  // 'alerts/info': { title: 'ℹ️ Information', description: 'New info received.' },
}

// Function to add or update a topic
export function getTopic(key: string): string {
  return topicConfig[key] ? topicConfig[key].path : ''
}

// Function to add or update a topic
export function addOrUpdateTopic(key: string, topic: Topic): void {
  topicConfig[key] = topic
  console.log(`Topic "${key}" added/updated.`)
  window.dispatchEvent(new CustomEvent('topicConfigUpdated')) // Notify
}

// Function to remove a topic
export function removeTopic(key: string): void {
  if (key in topicConfig) {
    delete topicConfig[key]
    console.log(`Topic "${key}" removed.`)
    window.dispatchEvent(new CustomEvent('topicConfigUpdated')) // Notify
  } else {
    console.log(`Topic "${key}" not found.`)
  }
}

export default function GlobalMqttDialog() {
  const [watchedTopics, setWatchedTopics] = useState(Object.keys(topicConfig))
  const message = useMultiTopicListener(watchedTopics)
  const [queue, setQueue] = useState<{ topic: string; payload: string }[]>([])
  const [current, setCurrent] = useState<{
    topic: string
    payload: string
  } | null>(null)
  const [open, setOpen] = useState(false)

  // 🔄 Sync with changes in topicConfig
  useEffect(() => {
    const handler = () => {
      setWatchedTopics(Object.keys(topicConfig))
    }
    window.addEventListener('topicConfigUpdated', handler)
    return () => {
      window.removeEventListener('topicConfigUpdated', handler)
    }
  }, [])

  // Push message to queue
  useEffect(() => {
    if (message) setQueue((q) => [...q, message])
  }, [message])

  // Dequeue and show next message
  useEffect(() => {
    if (!current && queue.length > 0) {
      const next = queue[0]
      setCurrent(next)
      setQueue((q) => q.slice(1))
      setOpen(true)
    }
  }, [queue, current])

  const handleClose = () => {
    setOpen(false)
    setCurrent(null)
  }

  if (!current) return null

  const { topic, payload } = current
  const config = topicConfig[topic] ?? {
    title: 'MQTT Message',
    description: topic,
  }

  return (
    <div className="flex flex-col w-full max-w-[380px]">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config.title}</AlertDialogTitle>
            <AlertDialogDescription className="max-w-[380px]">
              {config.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-w-[300px] md:max-w-[600px] whitespace-pre-wrap text-wrap wrap-break-word mt-2 ">
            {payload}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Dismiss</AlertDialogCancel>
            {/* <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
