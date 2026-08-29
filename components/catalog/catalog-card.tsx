import Link from "next/link"

import { BlockThumbnail } from "@/components/block-thumbnail"
import { CopyButton } from "@/components/copy-button"
import { buildCopyForAiPrompt } from "@/lib/copy-for-ai"
import { getInstallCommand, getRegistryItemUrl } from "@/lib/site"
import { getCategoryLabel, getItemKind } from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"

/**
 * Карточка витрины. Действие ровно одно — Copy for AI: главный артефакт
 * продукта это промпт для агента, а не код и не registry URL. Оба остались
 * на странице item'а как вторичные developer-действия; на карточке они
 * конкурировали бы с главным сценарием (см. docs/DELIVERY.md).
 */
export function CatalogCard({ item }: { item: CatalogItem }) {
  const category = item.categories?.[0]
  // Карточка серверная: промпт собирается из metadata здесь, клиент получает
  // готовую строку и не тянет registry в бандл.
  const prompt = buildCopyForAiPrompt(item, {
    installCommand: getInstallCommand(item.name),
    registryUrl: getRegistryItemUrl(item.name),
    kind: getItemKind(item.name) ?? "block",
  })

  return (
    // Ссылка не оборачивает миниатюру: внутри блока есть свои <a>, а вложенные
    // ссылки — невалидный HTML. Кликабельность карточки даёт растянутый
    // псевдоэлемент заголовка; строка действий поднята над ним через z-10.
    <article className="border-shell-border bg-shell-panel hover:border-shell-border-strong focus-within:ring-shell-ring relative flex h-full flex-col overflow-hidden rounded-xl border transition-colors focus-within:ring-2">
      <BlockThumbnail slug={item.name} />

      <div className="border-shell-border flex flex-1 flex-col gap-1 border-t p-4">
        <p className="text-shell-muted flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
          {category ? <span>{getCategoryLabel(category)}</span> : null}
          {category ? <span aria-hidden="true">·</span> : null}
          <span className="font-mono normal-case">{item.name}</span>
        </p>

        <h3 className="text-shell-fg text-base font-medium">
          <Link
            href={`/components/${item.name}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {item.title ?? item.name}
          </Link>
        </h3>

        {item.description ? (
          <p className="text-shell-muted line-clamp-2 text-sm text-pretty">
            {item.description}
          </p>
        ) : null}

        {/* Над растянутой ссылкой поднимается только кнопка: ей нужен свой
            клик. «Подробнее» остаётся визуальным аффордансом — клик по нему
            ловит та же растянутая ссылка заголовка, поэтому второй ссылки
            на тот же адрес в разметке нет. */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-4">
          <CopyButton
            value={prompt}
            label="Copy for AI"
            copiedLabel="Скопировано — вставьте агенту"
            variant="primary"
            className="relative z-10 h-8 px-3 text-xs"
          />
          <span className="text-shell-muted ml-auto text-xs">Подробнее</span>
        </div>
      </div>
    </article>
  )
}
