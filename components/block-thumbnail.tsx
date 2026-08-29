import type { CSSProperties } from "react"

import { CATALOG_PREVIEWS } from "@/registry/previews"

const THUMBNAIL_WIDTH = 1280

/**
 * Миниатюра каталога рендерит тот самый компонент, который получает
 * пользователь. Отдельной demo-копии нет и быть не должно.
 *
 * Один и тот же pipeline для всех kind: и секция, и мелкий компонент
 * рендерятся масштабированием реального компонента, без iframe.
 */
export function BlockThumbnail({ slug }: { slug: string }) {
  const Block = CATALOG_PREVIEWS[slug]

  if (!Block) {
    return <div className="bg-shell-elevated aspect-[16/9] w-full" />
  }

  return (
    // Подложка — цвет панели карточки, а не серый: блок ниже 16/9 не должен
    // читаться как обрезанная полоса. Сам блок не перекрашивается.
    <div
      className="bg-shell-panel @container relative aspect-[16/9] w-full overflow-hidden"
      style={{ "--thumbnail-width": `${THUMBNAIL_WIDTH}px` } as CSSProperties}
    >
      {/* inert убирает ссылки блока из Tab-порядка каталога */}
      <div inert className="block-thumbnail-scale pointer-events-none">
        <Block />
      </div>
    </div>
  )
}
