"use client"

import { useRouter } from "next/navigation"
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react"

import { SHELL_THEME_EVENT } from "@/components/catalog/theme-switch"

/**
 * Кадр обложки категории. Раньше он был `inert`: вся карточка была одной
 * ссылкой, и любое нажатие внутри уводило в категорию. Но половина обложек —
 * анимации, которые начинаются от руки (шнур-выключатель, курсоры, карточки
 * веером), и в мёртвом кадре они выглядели сломанными.
 *
 * Теперь кадр живой, а роль ссылки берёт на себя он сам:
 * — нажатие по пустому месту ведёт в категорию;
 * — нажатие по кнопке, полю или самому анимируемому элементу остаётся блоку;
 * — ссылки внутри блока гасятся: у демо-разметки они ведут на «#», и переход
 *   по ним только сбрасывал бы прокрутку витрины.
 */
const INTERACTIVE = 'button,input,select,textarea,label,[role="button"],[draggable="true"],[data-part="grip"]'

/** Нажатие с протяжкой — это перетаскивание внутри блока, а не переход. */
const DRAG_SLOP = 6

export function CategoryCover({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const router = useRouter()
  const start = useRef<{ x: number; y: number } | null>(null)
  const frame = useRef<HTMLDivElement>(null)

  // Блок внутри обложки умеет просить свет: шнур-выключатель шлёт всплывающее
  // theme-change. Гасим свет в пределах кадра — как на странице компонента,
  // где то же событие слушает карточка. Тему сайта это не трогает.
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto")

  useEffect(() => {
    const node = frame.current

    const onBlockTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ isDark?: boolean }>).detail

      if (typeof detail?.isDark === "boolean") {
        setTheme(detail.isDark ? "dark" : "light")
      }
    }

    // Человек переключил тему всего сайта — локальный выбор внутри кадра
    // больше не актуален.
    const onShellTheme = () => setTheme("auto")

    node?.addEventListener("theme-change", onBlockTheme)
    document.addEventListener(SHELL_THEME_EVENT, onShellTheme)

    return () => {
      node?.removeEventListener("theme-change", onBlockTheme)
      document.removeEventListener(SHELL_THEME_EVENT, onShellTheme)
    }
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    start.current = { x: event.clientX, y: event.clientY }
  }

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement

    const link = target.closest("a[href]")
    if (link) {
      event.preventDefault()
      return
    }

    if (target.closest(INTERACTIVE)) return

    const from = start.current
    start.current = null

    if (from) {
      const moved =
        Math.abs(event.clientX - from.x) > DRAG_SLOP ||
        Math.abs(event.clientY - from.y) > DRAG_SLOP

      if (moved) return
    }

    router.push(href)
  }

  return (
    <div
      ref={frame}
      onPointerDown={onPointerDown}
      onClick={onClick}
      className="border-shell-card bg-shell relative flex aspect-[16/10] min-w-0 cursor-pointer flex-col justify-center overflow-hidden rounded-xl border"
      data-preview-theme={theme}
    >
      {children}
    </div>
  )
}
