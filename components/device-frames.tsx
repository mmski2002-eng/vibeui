import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Рамки «устройств» для превью. Стиль — «экран» с главной: панель с
 * тремя точками, первая в цвете акцента. Планшет и телефон повторяют
 * его тонами и скруглениями, без имитации конкретных моделей.
 */

export function DesktopFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-shell-border bg-shell-panel overflow-hidden rounded-2xl border",
        className,
      )}
    >
      <div className="border-shell-border flex items-center gap-1.5 border-b px-4 py-3">
        <span className="bg-shell-accent size-2.5 rounded-full" />
        <span className="bg-shell-border size-2.5 rounded-full" />
        <span className="bg-shell-border size-2.5 rounded-full" />
      </div>
      {children}
    </div>
  )
}

// Горизонтальные отступы корпуса: нужны снаружи, чтобы вписать экран
// в контейнер масштабом.
export const TABLET_BEZEL = 14
export const PHONE_BEZEL = 10

export function TabletFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-shell-border bg-shell-panel rounded-[28px] border",
        className,
      )}
      style={{ padding: TABLET_BEZEL }}
    >
      <div className="flex justify-center pb-2">
        <span className="bg-shell-accent size-1.5 rounded-full" />
      </div>
      <div className="border-shell-border overflow-hidden rounded-xl border">
        {children}
      </div>
      <div className="flex justify-center pt-2">
        <span className="bg-shell-border h-1.5 w-10 rounded-full" />
      </div>
    </div>
  )
}

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-shell-border bg-shell-panel rounded-[40px] border",
        className,
      )}
      style={{ padding: PHONE_BEZEL }}
    >
      <div className="border-shell-border relative overflow-hidden rounded-[30px] border">
        <div className="bg-shell-panel absolute top-2 left-1/2 z-10 flex h-5 w-20 -translate-x-1/2 items-center justify-end rounded-full pr-2">
          <span className="bg-shell-accent size-1.5 rounded-full" />
        </div>
        {children}
        <div className="bg-shell-fg/30 pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full" />
      </div>
    </div>
  )
}
