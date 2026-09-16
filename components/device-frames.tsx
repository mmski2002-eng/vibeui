import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type DeviceKind = "desktop" | "tablet" | "mobile"

// Горизонтальные отступы корпуса: нужны снаружи, чтобы вписать экран
// в контейнер масштабом.
export const TABLET_BEZEL = 14
export const PHONE_BEZEL = 10

const PADDING: Record<DeviceKind, number> = {
  desktop: 0,
  tablet: TABLET_BEZEL,
  mobile: PHONE_BEZEL,
}

const SHELL: Record<DeviceKind, string> = {
  desktop: "overflow-hidden rounded-2xl",
  tablet: "rounded-[28px]",
  mobile: "rounded-[40px]",
}

const SCREEN: Record<DeviceKind, string> = {
  desktop: "",
  tablet: "border-shell-border overflow-hidden rounded-xl border",
  mobile: "border-shell-border relative overflow-hidden rounded-[30px] border",
}

/**
 * Корпус «устройства» для превью. Стиль — «экран» с главной: панель с
 * тремя точками, первая в цвете акцента. Планшет и телефон повторяют
 * его тонами и скруглениями, без имитации конкретных моделей.
 *
 * Один компонент на три вида, а не три разных: структура DOM у всех
 * одинаковая (корпус → слот сверху → экран → слот снизу), меняются только
 * классы. Поэтому при смене устройства экран и iframe внутри остаются тем же
 * узлом — размер кадра едет плавно, а страница превью не перезагружается.
 */
export function DeviceFrame({
  kind,
  children,
  className,
}: {
  kind: DeviceKind
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-shell-border bg-shell-panel device-shell border",
        SHELL[kind],
        className,
      )}
      style={{ padding: PADDING[kind] }}
    >
      {kind === "desktop" ? (
        <div className="border-shell-border flex items-center gap-1.5 border-b px-4 py-3">
          <span className="bg-shell-accent size-2.5 rounded-full" />
          <span className="bg-shell-border size-2.5 rounded-full" />
          <span className="bg-shell-border size-2.5 rounded-full" />
        </div>
      ) : kind === "tablet" ? (
        <div className="flex justify-center pb-2">
          <span className="bg-shell-accent size-1.5 rounded-full" />
        </div>
      ) : null}
      <div className={cn("device-screen", SCREEN[kind])}>
        {kind === "mobile" ? (
          <div className="bg-shell-panel absolute top-2 left-1/2 z-10 flex h-5 w-20 -translate-x-1/2 items-center justify-end rounded-full pr-2">
            <span className="bg-shell-accent size-1.5 rounded-full" />
          </div>
        ) : null}
        {children}
        {kind === "mobile" ? (
          <div className="bg-shell-fg/30 pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full" />
        ) : null}
      </div>
      {kind === "tablet" ? (
        <div className="flex justify-center pt-2">
          <span className="bg-shell-border h-1.5 w-10 rounded-full" />
        </div>
      ) : null}
    </div>
  )
}
