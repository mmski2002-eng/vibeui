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
  video,
  width = 1440,
  height = 900,
  className,
}: {
  src: string
  title: string
  /** Статичный кадр демо; без него iframe грузится сразу. */
  poster?: string
  /** Скролл-запись сайта вместо постера: играет сразу, без наведения. При 404 сама откатывается на постер+iframe. */
  video?: string
  width?: number
  height?: number
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [live, setLive] = useState(!poster)
  const [loaded, setLoaded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const reveal = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(reveal.current), [])

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
          // Поверх iframe: тот до загрузки белый, а после load ещё
          // отыгрывает появление первого экрана — постер прикрывает и то,
          // и другое, и уходит только когда под ним уже готовая страница.
          className={cn(
            "absolute inset-0 z-10 h-full w-full object-cover object-top transition-opacity duration-700",
            loaded && "pointer-events-none opacity-0",
          )}
        />
      ) : null}
      {video && !videoFailed ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            onPlaying={() => setVideoPlaying(true)}
            className="absolute inset-0 z-10 h-full w-full object-cover object-top"
          />
          {/* Пока ролик не заиграл — перелив по постеру и бейдж «видео»:
              иначе карточка минуту-другую выглядит как обычный скриншот. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-500",
              videoPlaying && "opacity-0",
            )}
          >
            <div className="absolute inset-y-0 left-[-35%] w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent [animation:vibeui-cover-shimmer_1.8s_ease-in-out_infinite]" />
          </div>
          <span
            className={cn(
              "pointer-events-none absolute bottom-2 left-2 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur transition-opacity duration-500",
              videoPlaying && "opacity-0",
            )}
          >
            <i className="bg-shell-accent size-1.5 animate-pulse rounded-full" />
            видео
          </span>
        </>
      ) : scale > 0 && live ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => {
            reveal.current = window.setTimeout(() => setLoaded(true), 1200)
          }}
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
