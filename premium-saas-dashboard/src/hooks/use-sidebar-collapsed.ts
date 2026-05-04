import { useCallback, useState } from 'react'

const STORAGE_KEY = 'aurora-sidebar-collapsed'

function readCollapsed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === '1'
  } catch {
    return false
  }
}

function persist(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    // ignore
  }
}

export function useSidebarCollapsed(): {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggle: () => void
} {
  const [collapsed, setCollapsedState] = useState(readCollapsed)

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
    persist(value)
  }, [])

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev
      persist(next)
      return next
    })
  }, [])

  return { collapsed, setCollapsed, toggle }
}
