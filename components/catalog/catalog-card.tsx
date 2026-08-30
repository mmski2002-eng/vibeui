import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { ConfigureToggle } from "@/components/catalog/configure-toggle"
import { PreviewTheme } from "@/components/catalog/preview-theme"
import { CopyButton } from "@/components/copy-button"
import { getControls } from "@/lib/controls"
import { getItemDocUrl } from "@/lib/site"
import type { CatalogItem } from "@/registry/meta"

import Link from "next/link"

/**
 * Карточка витрины: кадр превью в рамке и узкая строка действий под ним.
 * Действие ровно одно — скопировать ссылку на инструкцию: пользователь
 * вставляет её в собственную фразу агенту (см. docs/DELIVERY.md).
 */
export function CatalogCard({ item }: { item: CatalogItem }) {
  const docUrl = getItemDocUrl(item.name)

  return (
    // Ссылка не оборачивает карточку целиком: внутри блока есть свои <a>, а
    // вложенные ссылки — невалидный HTML. Кликабельность даёт растянутый
    // псевдоэлемент заголовка; строка действий поднята над ним через z-10.
    <article className="bg-shell border-shell-border relative flex h-full flex-col overflow-hidden rounded-2xl border p-0.5 shadow-sm shadow-black/5">
      <div className="border-shell-border relative flex min-h-44 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
        <PreviewTheme>
          {getControls(item).length > 0 ? (
            <ConfigureToggle item={item} docUrl={docUrl}>
              <CatalogThumbnail slug={item.name} />
            </ConfigureToggle>
          ) : (
            <CatalogThumbnail slug={item.name} />
          )}
        </PreviewTheme>
      </div>

      <div className="flex flex-row items-center gap-3 px-2 py-1.5">
        <h3 className="text-shell-muted flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs">
          <Link
            href={`/components/${item.name}`}
            className="truncate after:absolute after:inset-0 focus-visible:outline-none"
            title={item.title ?? item.name}
          >
            {item.title ?? item.name}
          </Link>
        </h3>

        <div className="relative z-10 flex items-center gap-1.5">
          <CopyButton
            value={docUrl}
            label="Copy for AI"
            copiedLabel="Ссылка скопирована"
            className="h-7 px-3 text-xs"
          />
        </div>
      </div>
    </article>
  )
}
