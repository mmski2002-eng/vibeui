import { LazyThumbnail } from "@/components/catalog/lazy-thumbnail"
import type { Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getCatalogItem, getItemKind } from "@/registry/index"

/**
 * Миниатюра каталога показывает тот самый компонент, который получает
 * пользователь. Отдельной demo-копии нет и быть не должно.
 *
 * Здесь решается только режим кадра, сам компонент рендерит `LazyThumbnail`
 * на клиенте по мере скролла:
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
 * не прыгала.
 *
 * Превью интерактивно: витрина показывает, как компонент себя ведёт, а не
 * только как он выглядит. Поэтому inert не ставится — кнопки нажимаются,
 * разделы раскрываются, и содержимое попадает в Tab-порядок.
 */
export function CatalogThumbnail({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}) {
  const item = getCatalogItem(slug)
  const preview = item ? localizeItem(item, locale).meta?.preview : undefined
  const kind = getItemKind(slug)
  const category = item?.categories?.[0]

  if (!item || !kind || !category) {
    return null
  }

  // Блок в натуральную величину: не масштабируется в 1280px, а рендерится в
  // ширину карточки, где container query сворачивает его в узкую раскладку.
  const natural = preview?.width === "natural"

  return (
    <LazyThumbnail
      slug={slug}
      kind={kind}
      category={category}
      // Фон — не «компонент в кадре», а подложка целого экрана: ему нужен
      // тот же режим, что у секций, иначе он рисуется мелким прямоугольником
      // посреди пустой карточки. Натуральный блок идёт тем же не-масштабным
      // путём, что и мелкие компоненты.
      compact={natural || (kind !== "block" && preview?.width !== "section")}
      // Компоненту, которому нужна настоящая ширина строки, её надо дать:
      // во flex-кадре он иначе схлопывается по содержимому и врёт про дизайн.
      full={preview?.width === "full"}
      half={preview?.width === "section"}
      natural={natural}
      props={preview?.props}
      states={preview?.states}
      aspect={preview?.aspect}
    />
  )
}
