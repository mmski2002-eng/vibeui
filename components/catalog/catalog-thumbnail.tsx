import type { ComponentType, CSSProperties } from "react"

import { getCatalogItem, getItemKind } from "@/registry/index"
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
 *   в нечитаемую точку. Подложка светлая нейтральная: большинство
 *   UI-компонентов рассчитаны на светлую поверхность, на тёмной текстовые
 *   и «тихие» кнопки не читаются.
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
    // Компоненту, которому нужна настоящая ширина строки, её надо дать:
    // во flex-кадре он иначе схлопывается по содержимому и врёт про дизайн.
    const preview = getCatalogItem(slug)?.meta?.preview
    const full = preview?.width === "full"
    const Demo = Preview as ComponentType<Record<string, unknown>>

    return (
      <div className="bg-preview-surface flex min-h-44 w-full flex-1 items-center justify-center overflow-hidden p-6 lg:px-8 lg:py-10">
        <div
          inert
          className={
            "pointer-events-none" + (full ? " w-full max-w-[30rem]" : "")
          }
        >
          <Demo {...(preview?.props ?? {})} />
        </div>
      </div>
    )
  }

  return (
    // Кадр 16/9 равен пропорции секции в 1280×720, поэтому блок заполняет его
    // без полос и обрезки. Подложка следует переключателю темы на карточке.
    <div
      className="bg-preview-surface @container relative aspect-[16/9] w-full overflow-hidden"
      style={{ "--thumbnail-width": `${SECTION_WIDTH}px` } as CSSProperties}
    >
      <div inert className="block-thumbnail-frame pointer-events-none">
        <div className="block-thumbnail-scale">
          <Preview />
        </div>
      </div>
    </div>
  )
}
