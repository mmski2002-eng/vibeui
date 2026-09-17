"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Lock } from "lucide-react"

import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/** Почему копирование закрыто: не вошёл, нет Pro или исчерпан лимит. */
export type GateReason = "signin" | "pro" | "limit"

export const GATE_BASE =
  "focus-visible:ring-shell-ring inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"

export const GATE_VARIANTS = {
  primary:
    "bg-shell-accent text-shell-accent-fg border-shell-accent hover:bg-shell-accent-deep hover:border-shell-accent-deep active:scale-[0.98]",
  secondary:
    "border-shell-border text-shell-fg hover:bg-shell-elevated hover:border-shell-border-strong active:scale-[0.98]",
}

function copy(reason: GateReason, en: boolean) {
  if (reason === "signin") {
    return {
      text: en
        ? "Copying is free once you sign in — no card needed."
        : "Скопировать может любой вошедший — бесплатно, без карты.",
      cta: en ? "Sign in" : "Войти",
      href: "/signin",
    }
  }

  if (reason === "limit") {
    return {
      text: en
        ? "You’ve used this month’s copies. PRO removes the limit."
        : "Лимит копий на этот месяц исчерпан. В PRO — без ограничений.",
      cta: en ? "Get PRO" : "Оформить PRO",
      href: "/pricing",
    }
  }

  return {
    text: en
      ? "Copying this component is available on PRO."
      : "Копирование этого компонента доступно в тарифе PRO.",
    cta: en ? "Get PRO" : "Оформить PRO",
    href: "/pricing",
  }
}

/**
 * Поповер-объяснение у закрытой кнопки. Рендерится в портал и позиционируется
 * по прямоугольнику кнопки: карточки каталога режут содержимое `overflow`, и
 * обычный absolute обрезался бы. Закрывается кликом мимо, Escape, прокруткой.
 */
export function GatePopover({
  anchor,
  reason,
  locale,
  onClose,
}: {
  anchor: DOMRect
  reason: GateReason
  locale: Locale
  onClose: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const en = locale === "en"
  const c = copy(reason, en)

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!panel.current?.contains(event.target as Node)) onClose()
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onClose, true)
    window.addEventListener("resize", onClose)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onClose, true)
      window.removeEventListener("resize", onClose)
    }
  }, [onClose])

  const width = 264
  const left = Math.max(
    8,
    Math.min(anchor.left, window.innerWidth - width - 8),
  )

  // Портал в оболочку, а не в body: токены `--shell-*` (цвета поповера) живут
  // на `.catalog-shell`, снаружи они не определены. Оболочка не обрезает
  // содержимое и не создаёт transform-контекст, поэтому fixed не клипается.
  const host =
    document.querySelector<HTMLElement>(".catalog-shell") ?? document.body

  return createPortal(
    <div
      ref={panel}
      role="dialog"
      style={{ position: "fixed", top: anchor.bottom + 8, left, width }}
      className="border-shell-border bg-shell-panel acc-reveal z-50 rounded-xl border p-3.5 shadow-lg shadow-black/40"
    >
      <p className="text-shell-fg text-sm text-pretty">{c.text}</p>
      <Link
        href={localePath(locale, c.href)}
        className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep focus-visible:ring-shell-ring mt-3 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {c.cta}
      </Link>
    </div>,
    host,
  )
}

/**
 * Кнопка «Копировать для ИИ» в закрытом виде: тот же вид, что у рабочей, но с
 * замком. По клику — не копирует, а показывает поповер, что доступно в Pro.
 * Кликабельна намеренно (не disabled): на телефоне у disabled нет отклика.
 */
export function LockedCopyButton({
  label,
  reason,
  locale,
  variant = "primary",
  className,
}: {
  label: string
  reason: GateReason
  locale: Locale
  variant?: "primary" | "secondary"
  className?: string
}) {
  const button = useRef<HTMLButtonElement>(null)
  const [anchor, setAnchor] = useState<DOMRect | null>(null)

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={anchor ? true : undefined}
        onClick={() =>
          setAnchor((was) =>
            was ? null : (button.current?.getBoundingClientRect() ?? null),
          )
        }
        className={cn(GATE_BASE, GATE_VARIANTS[variant], className)}
      >
        <Lock className="size-4" aria-hidden="true" />
        {label}
      </button>
      {anchor ? (
        <GatePopover
          anchor={anchor}
          reason={reason}
          locale={locale}
          onClose={() => setAnchor(null)}
        />
      ) : null}
    </>
  )
}
