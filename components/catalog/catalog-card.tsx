import Link from "next/link"

import { BlockThumbnail } from "@/components/block-thumbnail"
import { CopyButton } from "@/components/copy-button"
import { buildCopyForAiPrompt } from "@/lib/copy-for-ai"
import { getInstallCommand } from "@/lib/site"
import { getCategoryLabel } from "@/registry/index"
import type { BlockItem } from "@/registry/meta"

export function CatalogCard({ block }: { block: BlockItem }) {
  const category = block.categories?.[0]
  const tags = block.meta?.tags?.slice(0, 3) ?? []
  // Карточка серверная: промпт собирается из metadata здесь, клиент получает
  // только готовую строку и не тянет registry в бандл.
  const prompt = buildCopyForAiPrompt(block, getInstallCommand(block.name))

  return (
    // Ссылка не оборачивает миниатюру: внутри блока есть свои <a>, а вложенные
    // ссылки — невалидный HTML. Кликабельность карточки даёт растянутый
    // псевдоэлемент заголовка; кнопка Copy поднята над ним через z-10.
    <article className="border-shell-border bg-shell-panel hover:border-shell-border-strong focus-within:ring-shell-ring relative flex h-full flex-col overflow-hidden rounded-xl border transition-colors focus-within:ring-2">
      <BlockThumbnail slug={block.name} />

      <div className="border-shell-border flex flex-1 flex-col border-t p-4">
        {category ? (
          <p className="text-shell-muted mb-1 text-xs font-medium tracking-wide uppercase">
            {getCategoryLabel(category)}
          </p>
        ) : null}

        <h3 className="text-shell-fg text-base font-medium">
          <Link
            href={`/components/${block.name}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {block.title ?? block.name}
          </Link>
        </h3>

        {tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="border-shell-border text-shell-muted rounded-full border px-2 py-0.5 text-xs"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="relative z-10 mt-auto flex items-center gap-3 pt-4">
          <CopyButton
            value={prompt}
            label="Copy for AI"
            variant="primary"
            className="h-8 px-3 text-xs"
          />
          <code className="text-shell-muted min-w-0 truncate font-mono text-xs">
            {block.name}
          </code>
        </div>
      </div>
    </article>
  )
}
