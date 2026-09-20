"use client"

import { useEffect, useRef, useState } from "react"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"

const BURST = [0, 60, 120, 180, 240, 300]

/**
 * Сердце с числом на стекле. Ставится поверх превью, поэтому подложка —
 * полупрозрачное стекло, читаемое и на светлом, и на тёмном кадре.
 *
 * Нажатие отыгрывается сразу: сердце «выпрыгивает», вокруг разлетаются
 * искры, а цифра выезжает снизу, как барабан счётчика. Что было — уходит
 * вверх. Всё на CSS, запись в базу идёт параллельно и на анимацию не влияет.
 */
export function LikeButton({
  active,
  count,
  label,
  onClick,
  className,
  pinned,
}: {
  active: boolean
  count: number
  label: string
  onClick: () => void
  className?: string
  /** Признак для CSS витрины: отмеченные на момент загрузки карточки
   *  поднимаются в начало сетки. */
  pinned?: boolean
}) {
  // Анимации только после клика: уже отмеченные сердца при загрузке
  // страницы прыгать не должны.
  const [pressed, setPressed] = useState(false)
  const previous = useRef(count)
  const [direction, setDirection] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    if (count !== previous.current) {
      setDirection(count > previous.current ? "up" : "down")
      previous.current = count
    }
  }, [count])

  return (
    <button
      type="button"
      onClick={() => {
        setPressed(true)
        onClick()
      }}
      onAnimationEnd={(event) => {
        // Искры живут дольше прыжка и есть только у лайка: без них сброс
        // делает сам прыжок.
        const done = active ? "like-burst" : "like-pop"
        if (event.animationName === done) setPressed(false)
      }}
      aria-pressed={active}
      title={label}
      data-active={active ? "true" : undefined}
      data-favourite={pinned ? "true" : undefined}
      data-pressed={pressed ? "true" : undefined}
      className={cn("like-glass", className)}
    >
      <span className="like-heart" aria-hidden="true">
        <Heart className="size-4" fill={active ? "currentColor" : "none"} />
        {pressed && active
          ? BURST.map((angle) => (
              <i
                key={angle}
                className="like-spark"
                style={{ ["--like-angle" as string]: `${angle}deg` }}
              />
            ))
          : null}
      </span>
      {count > 0 ? (
        <span className="like-count" aria-hidden="true">
          <span key={count} className={direction ? `like-roll-${direction}` : undefined}>
            {count}
          </span>
        </span>
      ) : null}
      <span className="sr-only">
        {label}
        {count > 0 ? ` · ${count}` : ""}
      </span>
    </button>
  )
}
