import { useSyncExternalStore } from 'react'

export function useIsMobile(query = '(max-width: 768px)'): boolean {
  // Lazily create the MediaQueryList only on the client
  const getMql = () =>
    typeof window !== 'undefined' ? window.matchMedia(query) : null

  // Subscribe using useSyncExternalStore for correctness & minimal updates
  const subscribe = (onStoreChange: () => void) => {
    const mql = getMql()
    if (!mql) return () => {}

    const handler = (e: MediaQueryListEvent) => {
      console.log(e)
      onStoreChange()
    }

    // Safari < 14 fallback
    if ('addEventListener' in mql) {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      // @ts-expect-error legacy API
      mql.addListener(handler)
      // @ts-expect-error legacy API
      return () => mql.removeListener(handler)
    }
  }

  const getSnapshot = () => {
    const mql = getMql()
    return mql ? mql.matches : false
  }

  // getServerSnapshot: consistent value during SSR/hydration
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
