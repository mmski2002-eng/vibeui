"use client"

import dynamic from "next/dynamic"
import { SlidersHorizontal, X } from "lucide-react"
import { useState, type ReactNode } from "react"

import type { CatalogItem } from "@/registry/meta"

// Конфигуратор и код самого компонента грузятся только по первому клику:
// пока витрину просто просматривают, клиентского JS компонентов на странице
// нет вовсе (см. docs/CONTROLS.md).
const ItemConfigurator = dynamic(() =>
  import("@/components/catalog/item-configurator").then(
    (module) => module.ItemConfigurator,
  ),
)

/**
 * Кнопка настройки на карточке. Закрытая карточка отдаёт серверную миниатюру,
 * открытая — живое превью с контролами.
 *
 * `z-10` в открытом состоянии обязателен: заголовок карточки растянут
 * псевдоэлементом на всю карточку, и без подъёма он перехватывал бы клики
 * по полям.
 */
export function ConfigureToggle({
  item,
  docUrl,
  children,
}: {
  item: CatalogItem
  docUrl: string | null
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={
        "flex min-h-44 min-w-0 flex-1 flex-col " + (open ? "relative z-10" : "")
      }
    >
      {open ? <ItemConfigurator item={item} docUrl={docUrl} /> : children}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="border-shell-border bg-shell/70 text-shell-muted hover:text-shell-fg hover:border-shell-border-strong focus-visible:ring-shell-ring absolute top-2 right-11 z-10 inline-flex size-7 items-center justify-center rounded-md border backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {open ? (
          <X className="size-3.5" aria-hidden="true" />
        ) : (
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        )}
        <span className="sr-only">
          {open ? "Закрыть настройку" : "Настроить компонент"}
        </span>
      </button>
    </div>
  )
}
