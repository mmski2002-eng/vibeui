"use client"

import { useEffect, useRef, useState } from "react"

import { formatNumber, type NumberKind } from "@/lib/format"
import type { Locale } from "@/lib/i18n"

/**
 * Число, которое «набегает» при первом появлении на экране.
 *
 * На сервере и без JS показывается сразу конечное значение: анимация —
 * украшение, а не способ доставить цифру. С prefers-reduced-motion
 * счётчик не запускается.
 */
export function CountUp({
  value,
  kind = "int",
  locale = "ru",
  duration = 700,
}: {
  value: number
  kind?: NumberKind
  locale?: Locale
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current

    if (!node || started.current || value === 0) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || started.current) return

      started.current = true
      observer.disconnect()

      const start = performance.now()

      function tick(now: number) {
        const progress = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)

        setShown(Math.round(value * eased))

        if (progress < 1) requestAnimationFrame(tick)
      }

      setShown(0)
      requestAnimationFrame(tick)
    })

    observer.observe(node)

    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(shown, kind, locale)}
    </span>
  )
}
