import Link from "next/link"

import { BlockThumbnail } from "@/components/block-thumbnail"
import { getCategoryLabel } from "@/registry/index"
import type { BlockItem } from "@/registry/meta"

export function BlockCard({ block }: { block: BlockItem }) {
  const category = block.categories?.[0]
  const tags = block.meta?.tags?.slice(0, 3) ?? []

  return (
    // Ссылка не оборачивает миниатюру: внутри блока есть свои <a>, а вложенные
    // ссылки — невалидный HTML. Кликабельность всей карточки даёт растянутый
    // псевдоэлемент заголовка.
    <article className="hover:border-foreground/20 focus-within:ring-ring relative overflow-hidden rounded-xl border transition-colors focus-within:ring-2">
      <BlockThumbnail slug={block.name} />
      <div className="border-t p-4">
        {category ? (
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
            {getCategoryLabel(category)}
          </p>
        ) : null}
        <h3 className="text-base font-medium">
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
                className="text-muted-foreground rounded-full border px-2 py-0.5 text-xs"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
