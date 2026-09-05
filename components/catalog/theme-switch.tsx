"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useRef } from "react"

const STORAGE_KEY = "vibeui-shell-theme"

/**
 * Переключатель светлой/тёмной оболочки каталога. Атрибут ставится на
 * <html> (см. THEME_INIT_SCRIPT в app/layout.tsx), а не на .catalog-shell:
 * инлайн-скрипт в <head> должен успеть выставить его до гидратации.
 *
 * Состояние живёт в DOM (refs), не в React state: значение приходит из
 * внешнего источника (localStorage через блокирующий скрипт), а не из
 * пропсов/рендера, так что синхронизировать его через setState в эффекте
 * нечем — правка тут же вызвала бы лишний ре-рендер.
 */
export function ThemeSwitch() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sunRef = useRef<SVGSVGElement>(null)
  const moonRef = useRef<SVGSVGElement>(null)
  const lightRef = useRef(false)

  const applyLight = (light: boolean) => {
    lightRef.current = light
    if (sunRef.current) sunRef.current.style.display = light ? "" : "none"
    if (moonRef.current) moonRef.current.style.display = light ? "none" : ""
    buttonRef.current?.setAttribute("aria-pressed", String(light))
  }

  useEffect(() => {
    applyLight(document.documentElement.dataset.shellTheme === "light")
  }, [])

  const toggle = () => {
    const next = !lightRef.current
    applyLight(next)
    document.documentElement.setAttribute(
      "data-shell-theme",
      next ? "light" : "dark",
    )
    try {
      localStorage.setItem(STORAGE_KEY, next ? "light" : "dark")
    } catch {
      // localStorage недоступен (приватный режим) — тема просто не переживёт перезагрузку
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label="Переключить тему"
      aria-pressed="false"
      className="border-shell-border text-shell-muted hover:text-shell-fg hover:bg-shell-panel focus-visible:ring-shell-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Sun
        ref={sunRef}
        style={{ display: "none" }}
        className="size-3.5"
        aria-hidden="true"
      />
      <Moon ref={moonRef} className="size-3.5" aria-hidden="true" />
    </button>
  )
}
