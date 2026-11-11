"use client"

import { useEffect, useState, type RefObject } from "react"

type Target<T extends HTMLElement> = RefObject<T> | RefObject<T | null> | T | null

function isRef<T extends HTMLElement>(target: Target<T>): target is RefObject<T> | RefObject<T | null> {
  return target !== null && "current" in target
}

/**
 * Observes an element's size. Pass a ref object, or the element itself (kept in state)
 * so the observer re-attaches when the element is swapped, e.g. a window going maximized.
 */
export function useResizeObserver<T extends HTMLElement>(target: Target<T>) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const element = isRef(target) ? target.current : target

  useEffect(() => {
    const el = isRef(target) ? target.current : target
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width)
        setHeight(entry.contentRect.height)
      }
    })

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, isRef(target) ? target : null])

  return { width, height }
}
