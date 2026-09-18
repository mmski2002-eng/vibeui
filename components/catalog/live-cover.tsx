"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Живая обложка: страница демо в iframe, уменьшенная до ширины карточки.
 * Кадр фиксированной ширины масштабируется transform'ом, поэтому вёрстка
 * внутри — настоящая десктопная, а не мобильная в узкой рамке.
 *
 * С `poster` в покое показывается статичный кадр, а iframe поднимается по
 * наведению и дальше остаётся: девять живых демо на одной странице весили
 * 14 МБ и грузились минутами, постер — десятки килобайт.
 */
export function LiveCover({
  src,
  title,
  poster,
  width = 1440,
  height = 900,
  className,
}: {
  src: string
  title: string
  /** Статичный кадр демо; без него iframe грузится сразу. */
  poster?: string
  width?: number
  height?: number
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [live, setLive] = useState(!poster)
  const [loaded, setLoaded] = useState(false)

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
      onPointerEnter={() => setLive(true)}
    >
      {poster ? (
        // Постер уже ужат до 960px webp, оптимизатор next/image здесь лишний.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500",
            loaded && "opacity-0",
          )}
        />
      ) : null}
      {scale > 0 && live ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => setLoaded(true)}
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
