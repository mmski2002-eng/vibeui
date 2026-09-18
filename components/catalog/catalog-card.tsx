import { CardInteractive } from "@/components/catalog/card-interactive"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { pickCardControls } from "@/lib/card-controls"
import { getControls } from "@/lib/controls"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getItemKind, itemBasePath } from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"

/**
 * Карточка витрины: кадр превью в рамке и узкая строка действий под ним.
 *
 * Оболочка серверная, миниатюра тоже: клиентским становится только то, что
 * держит состояние — подложка, настройка и ссылка, которая это состояние
 * переносит на страницу item'а (см. docs/CONTROLS.md).
 */
export function CatalogCard({
  item,
  locale,
}: {
  item: CatalogItem
  locale: Locale
}) {
  const localized = localizeItem(item, locale)
  const kind = getItemKind(localized.name) ?? "component"
  const category = localized.categories?.[0] ?? ""
  // Английское имя показывается рядом с русским: по нему компонент ищут в
  // чужих библиотеках и по нему же его называет агент.
  const englishTitle = locale === "ru" ? item.meta?.i18n?.en?.title : undefined
  // Три тега: больше не помещается в строку под мелким кадром, а меньше не
  // даёт отличить вариант от соседнего.
  const tags = (localized.meta?.tags ?? []).slice(0, 3)
  const slots = localized.meta?.slots
  const t = getDictionary(locale)

  return (
    // Кадр превью не ведёт на страницу item'а: внутри живой компонент, и
    // клик по нему должен нажимать кнопку или раскрывать раздел, а не
    // уводить с витрины. На страницу ведёт заголовок, код открывает Get Code.
    <article className="catalog-card bg-shell-panel border-shell-card-strong hover:border-shell-accent-line relative flex h-full w-full flex-col rounded-2xl border p-0.5 shadow-sm shadow-black/5 acc-lift">
      <CardInteractive
        name={localized.name}
        kind={kind}
        category={category}
        controls={getControls(localized)}
        cardControls={pickCardControls(
          getControls(localized),
          localized.meta?.cardControls,
        )}
        full={
          localized.meta?.preview?.width === "full" ||
          localized.meta?.preview?.width === "natural"
        }
        natural={localized.meta?.preview?.width === "natural"}
        fit={localized.meta?.preview?.width === "fit"}
        previewProps={localized.meta?.preview?.props}
        locale={locale}
        itemUrl={localePath(locale, `${itemBasePath(kind)}/${localized.name}`)}
        title={localized.title ?? localized.name}
        englishTitle={
          englishTitle && englishTitle !== localized.title ? englishTitle : null
        }
        pro={localized.meta?.pro === true}
      >
        <CatalogThumbnail slug={localized.name} locale={locale} />
      </CardInteractive>

      {/* Форма контента: что за блок и влезет ли сюда идея человека —
          до того, как он вчитается в чужой текст превью. */}
      {slots ? (
        <p className="text-shell-muted px-2 pt-2 text-[0.6875rem] text-pretty">
          {slots.shape}
        </p>
      ) : null}

      {/* Признаки варианта. В крупном режиме скрыты: там всё видно на самом
          превью. В обзоре это единственное, чем один из семидесяти вариантов
          отличается от соседа на глаз. */}
      {tags.length > 0 || slots ? (
        <ul data-part="facts" className="flex-wrap gap-1 px-2 pb-2">
          {slots ? (
            <li className="border-shell-accent-line text-shell-accent rounded border px-1.5 py-0.5 text-[0.6875rem]">
              {t.item.density[slots.density]}
            </li>
          ) : null}
          {(slots?.needs ?? []).map((need) => (
            <li
              key={need}
              className="border-shell-accent-line text-shell-accent rounded border px-1.5 py-0.5 text-[0.6875rem]"
            >
              {t.item.needs[need]}
            </li>
          ))}
          {tags.map((tag) => (
            <li
              key={tag}
              className="border-shell-border text-shell-muted rounded border px-1.5 py-0.5 text-[0.6875rem]"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
