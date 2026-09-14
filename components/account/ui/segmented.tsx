import Link from "next/link"
import { ViewTransition } from "react"

import { cn } from "@/lib/utils"

/**
 * Переключатель: ссылки, а не кнопки — выбор уезжает в адрес и переживает
 * перезагрузку. «Таблетка» под активным пунктом переезжает к новому
 * положению через view transition: имя у неё одно на группу, поэтому
 * браузер видит один и тот же элемент в двух местах и двигает его.
 */
export function Segmented({
  name,
  items,
  current,
  className,
}: {
  /** Имя группы: должно быть уникальным на странице. */
  name: string
  items: { value: string; label: string; href: string }[]
  current: string
  className?: string
}) {
  return (
    <div
      role="group"
      className={cn(
        "border-shell-border bg-shell-panel inline-flex items-center gap-0.5 rounded-lg border p-0.5",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === current

        return (
          <Link
            key={item.value}
            href={item.href}
            aria-current={active ? "true" : undefined}
            className={cn(
              "acc-press relative isolate h-8 rounded-md px-3 text-sm leading-8 whitespace-nowrap",
              active
                ? "text-shell-fg font-medium"
                : "text-shell-muted hover:text-shell-fg",
            )}
          >
            {active ? (
              <ViewTransition name={`seg-${name}`} share="acc-pill" default="none">
                <span
                  aria-hidden="true"
                  className="bg-shell-elevated absolute inset-0 -z-10 rounded-md"
                />
              </ViewTransition>
            ) : null}
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
