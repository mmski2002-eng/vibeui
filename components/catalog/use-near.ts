"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * «Карточка подъехала к экрану». Витрина держит под двести карточек, и
 * обвязка каждой (шесть кнопок настройки с иконкой, попап жалобы) весила
 * десять килобайт разметки — два с половиной мегабайта на страницу при
 * пустых ещё кадрах превью. Поэтому всё, кроме кадра и подписи, монтируется
 * тем же порогом, что и сам компонент в кадре.
 *
 * Возврата в false нет: один раз показанная шапка не должна исчезать под
 * курсором, когда карточка уезжает вверх.
 */
export function useNear(ref: RefObject<HTMLElement | null>, margin = "800px") {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element || near) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: `${margin} 0px` },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [margin, near, ref])

  return near
}
