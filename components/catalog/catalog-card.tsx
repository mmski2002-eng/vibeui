import { CardInteractive } from "@/components/catalog/card-interactive"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { pickCardControls } from "@/lib/card-controls"
import { getControls } from "@/lib/controls"
import { localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getInstallCommand, getItemDocUrl } from "@/lib/site"
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

  return (
    // Кадр превью не ведёт на страницу item'а: внутри живой компонент, и
    // клик по нему должен нажимать кнопку или раскрывать раздел, а не
    // уводить с витрины. На страницу ведёт заголовок, код открывает Get Code.
    <article className="bg-shell border-shell-card-strong relative flex h-full flex-col overflow-hidden rounded-2xl border p-0.5 shadow-sm shadow-black/5">
      <CardInteractive
        name={localized.name}
        kind={kind}
        category={category}
        controls={getControls(localized)}
        cardControls={pickCardControls(
          getControls(localized),
          localized.meta?.cardControls,
        )}
        full={localized.meta?.preview?.width === "full"}
        previewProps={localized.meta?.preview?.props}
        locale={locale}
        docUrl={getItemDocUrl(localized.name)}
        itemUrl={localePath(locale, `${itemBasePath(kind)}/${localized.name}`)}
        title={localized.title ?? localized.name}
        englishTitle={
          englishTitle && englishTitle !== localized.title ? englishTitle : null
        }
        installCommand={getInstallCommand(localized.name)}
      >
        <CatalogThumbnail slug={localized.name} locale={locale} />
      </CardInteractive>
    </article>
  )
}
