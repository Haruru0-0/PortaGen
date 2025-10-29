"use client"

import { useEffect, useState, type RefObject } from "react"

export function useResizeObserver(ref: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width)
        setHeight(entry.contentRect.height)
      }
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return { width, height }
}
