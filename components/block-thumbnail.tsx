import type { CSSProperties } from "react"

import { BLOCK_COMPONENTS } from "@/registry/components"

const THUMBNAIL_WIDTH = 1280

/**
 * Миниатюра каталога рендерит тот самый компонент, который получает
 * пользователь. Отдельной demo-копии нет и быть не должно.
 */
export function BlockThumbnail({ slug }: { slug: string }) {
  const Block = BLOCK_COMPONENTS[slug]

  if (!Block) {
    return <div className="bg-muted aspect-[16/9] w-full" />
  }

  return (
    <div
      className="bg-muted @container aspect-[16/9] w-full overflow-hidden"
      style={{ "--thumbnail-width": `${THUMBNAIL_WIDTH}px` } as CSSProperties}
    >
      {/* inert убирает ссылки блока из Tab-порядка каталога */}
      <div inert className="block-thumbnail-scale pointer-events-none">
        <Block />
      </div>
    </div>
  )
}
