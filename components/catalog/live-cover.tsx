"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Живая обложка: страница демо в iframe, уменьшенная до ширины карточки.
 * Кадр фиксированной ширины масштабируется transform'ом, поэтому вёрстка
 * внутри — настоящая десктопная, а не мобильная в узкой рамке.
 */
export function LiveCover({
  src,
  title,
  width = 1440,
  height = 900,
  className,
}: {
  src: string
  title: string
  width?: number
  height?: number
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const element = host.current

    if (!element) return

    const observer = new ResizeObserver(() => {
      setScale(element.offsetWidth / width)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [width])

  return (
    <div
      ref={host}
      className={cn("bg-shell-elevated relative overflow-hidden", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {scale > 0 ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            // Шире контейнера на полосу прокрутки: она уезжает за обрез.
            width: width + 24,
            height,
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  )
}
