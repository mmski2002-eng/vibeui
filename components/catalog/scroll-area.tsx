"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

const MIN_THUMB = 24
const HIDE_DELAY = 900

/**
 * Прокручиваемая область с собственной полосой.
 *
 * Нативная полоса спрятана: браузер даёт стилизовать её лишь в узких
 * пределах и всегда занимает место в раскладке, сдвигая содержимое. Полоса
 * здесь — обычный элемент поверх области: она ничего не сдвигает, живёт у
 * правого края и прячется, когда прокрутку не трогают (см. образец —
 * shadcn ScrollArea устроен так же).
 */
export function ScrollArea({
  children,
  className,
  storageKey,
}: {
  children: ReactNode
  className?: string
  /**
   * Ключ, под которым положение прокрутки переживает переход между
   * страницами. Список категорий одинаков на всех страницах витрины, и
   * прыжок к началу при каждом переходе читается как перезагрузка меню.
   */
  storageKey?: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [thumb, setThumb] = useState<{ height: number; top: number } | null>(
    null,
  )
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Положение возвращается в ref-колбэке, до первой отрисовки: из эффекта
  // список успел бы моргнуть началом.
  const attach = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node

      if (!node || !storageKey) {
        return
      }

      try {
        const saved = Number(window.sessionStorage.getItem(storageKey))

        if (saved > 0) {
          node.scrollTop = saved
        }
      } catch {
        // Приватный режим и заблокированное хранилище: прокрутка просто
        // начнётся сверху.
      }
    },
    [storageKey],
  )

  const remember = useCallback(
    (node: HTMLDivElement) => {
      if (!storageKey) {
        return
      }

      try {
        window.sessionStorage.setItem(storageKey, String(node.scrollTop))
      } catch {
        // См. выше: без хранилища работаем как раньше.
      }
    },
    [storageKey],
  )

  const measure = useCallback(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const { clientHeight, scrollHeight, scrollTop } = viewport

    if (scrollHeight <= clientHeight) {
      setThumb(null)
      return
    }

    const height = Math.max(
      MIN_THUMB,
      (clientHeight / scrollHeight) * clientHeight,
    )
    const top =
      (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - height)

    setThumb({ height, top })
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    measure()

    const observer = new ResizeObserver(measure)

    observer.observe(viewport)

    for (const child of viewport.children) {
      observer.observe(child)
    }

    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    return () => {
      if (hideRef.current) {
        clearTimeout(hideRef.current)
      }
    }
  }, [])

  const show = () => {
    setVisible(true)

    if (hideRef.current) {
      clearTimeout(hideRef.current)
    }

    hideRef.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }

  // Перетаскивание ползунка: pointer capture держит события на нём, даже
  // когда курсор ушёл за пределы полосы.
  const onThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current

    if (!viewport || !thumb) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    const startY = event.clientY
    const startTop = thumb.top
    const track = viewport.clientHeight - thumb.height
    const scrollable = viewport.scrollHeight - viewport.clientHeight

    const onMove = (move: PointerEvent) => {
      const next = Math.min(
        Math.max(startTop + move.clientY - startY, 0),
        track,
      )

      viewport.scrollTop = (next / track) * scrollable
    }

    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return (
    <div
      className={"relative " + (className ?? "")}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div
        ref={attach}
        onScroll={(event) => {
          measure()
          show()
          remember(event.currentTarget)
        }}
        // max-h-[inherit]: ограничение приходит от обёртки, а h-full на ней не
        // сработает — у обёртки задана максимальная высота, а не высота.
        className="max-h-[inherit] [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {thumb ? (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 flex w-2 touch-none border-l border-l-transparent p-px transition-opacity duration-150 select-none"
          style={{ opacity: visible || hovered ? 1 : 0 }}
        >
          <div
            onPointerDown={onThumbPointerDown}
            className="bg-shell-scroll hover:bg-shell-scroll-strong w-full flex-1 rounded-full transition-colors"
            style={{
              height: `${thumb.height}px`,
              transform: `translateY(${thumb.top}px)`,
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
