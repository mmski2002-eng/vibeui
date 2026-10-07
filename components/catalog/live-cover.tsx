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
  const videoElement = useRef<HTMLVideoElement>(null)
  const [scale, setScale] = useState(0)
  const [live, setLive] = useState(!poster)
  const [loaded, setLoaded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [readyVideo, setReadyVideo] = useState<string | undefined>(undefined)
  const [near, setNear] = useState(false)
  const [stillOnly, setStillOnly] = useState(false)
  const activeVideo = video && !videoFailed && !stillOnly ? video : undefined
  const videoPlaying = Boolean(activeVideo && readyVideo === activeVideo)
  const frameRequest = useRef<number | undefined>(undefined)
  const reveal = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(reveal.current), [])

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    setStillOnly(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Boolean(connection?.saveData),
    )
  }, [])

  // 27 роликов с preload="metadata" тянули ~100 МБ при открытии витрины:
  // видео монтируется, только когда карточка подъезжает к экрану.
  useEffect(() => {
    const element = host.current
    if (!element || !video || near) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: "200px 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [video, near])

  useEffect(() => {
    const element = videoElement.current
    if (!element || !activeVideo || !near) return

    let visible = false
    function syncPlayback() {
      if (!element) return
      if (visible && !document.hidden) {
        void element.play().catch(() => {})
      } else {
        element.pause()
      }
    }

    // Порог половины карточки: в кадре играют только реально видимые,
    // а не все, что задели край экрана.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        syncPlayback()
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    document.addEventListener("visibilitychange", syncPlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", syncPlayback)
      element.pause()
      if (frameRequest.current !== undefined) {
        element.cancelVideoFrameCallback(frameRequest.current)
        frameRequest.current = undefined
      }
    }
  }, [activeVideo, near])

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
          // Видео переключаем без crossfade: смешивание разных кадров
          // оставляет статичный объект из постера поверх движущегося клипа.
          className={cn(
            "pointer-events-none absolute inset-0 z-20 h-full w-full object-cover object-top",
            !activeVideo && "transition-opacity duration-700",
            (activeVideo ? videoPlaying : loaded) && "opacity-0",
          )}
        />
      ) : null}
      {activeVideo ? (
        near ? (
        <video
          ref={videoElement}
          src={activeVideo}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          onPlaying={(event) => {
            const element = event.currentTarget
            if (frameRequest.current !== undefined || readyVideo === activeVideo)
              return
            if (typeof element.requestVideoFrameCallback === "function") {
              frameRequest.current = element.requestVideoFrameCallback(() => {
                frameRequest.current = undefined
                setReadyVideo(activeVideo)
              })
            } else if (
              element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
            ) {
              setReadyVideo(activeVideo)
            }
          }}
          className="absolute inset-0 z-10 h-full w-full object-cover object-top"
        />
        ) : null
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
