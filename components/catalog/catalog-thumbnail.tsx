import type { CSSProperties } from "react"

import { getItemKind } from "@/registry/index"
import { CATALOG_PREVIEWS } from "@/registry/previews"

const SECTION_WIDTH = 1280

/**
 * Миниатюра каталога рендерит тот самый компонент, который получает
 * пользователь. Отдельной demo-копии нет и быть не должно.
 *
 * Режим зависит от kind:
 *
 * - `block` — секция полноширинная, поэтому рендерится в свои настоящие
 *   1280px и вписывается в карточку масштабированием;
 * - `component` — мелкий компонент показывается в натуральную величину и
 *   центрируется. Тот же section-масштаб (~0.26) превратил бы кнопку
 *   в нечитаемую точку.
 *
 * Оба режима держат одинаковую пропорцию кадра, чтобы сетка каталога
 * не прыгала, и оба используют один и тот же файл из registry.
 */
export function CatalogThumbnail({ slug }: { slug: string }) {
  const Preview = CATALOG_PREVIEWS[slug]

  if (!Preview) {
    return <div className="bg-shell-elevated aspect-[16/9] w-full" />
  }

  // inert убирает интерактивные узлы превью из Tab-порядка каталога:
  // кликабельна карточка целиком, а не то, что внутри миниатюры.
  if (getItemKind(slug) === "component") {
    return (
      <div className="bg-shell-elevated flex aspect-[16/9] w-full items-center justify-center overflow-hidden p-6">
        <div inert className="pointer-events-none">
          <Preview />
        </div>
      </div>
    )
  }

  return (
    // Подложка — цвет панели карточки, а не серый: секция ниже 16/9 не должна
    // читаться как обрезанная полоса. Сам блок не перекрашивается.
    <div
      className="bg-shell-panel @container relative aspect-[16/9] w-full overflow-hidden"
      style={{ "--thumbnail-width": `${SECTION_WIDTH}px` } as CSSProperties}
    >
      <div inert className="block-thumbnail-scale pointer-events-none">
        <Preview />
      </div>
    </div>
  )
}
