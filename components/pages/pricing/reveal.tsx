"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Появление при прокрутке: блок ждёт, пока войдёт в кадр, и всплывает снизу.
 * Задержка даёт ступеньку соседям в ряду. Reduced motion — без движения.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    )

    observer.observe(element)
    // Страховка: если наблюдатель не сработал (свёрнутая вкладка, печать,
    // экзотический браузер), содержимое всё равно не должно остаться пустым.
    const fallback = window.setTimeout(() => setShown(true), 4000)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
      className={cn(
        "translate-y-5 opacity-0 transition-[opacity,transform] duration-(--motion-slow) data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  )
}
