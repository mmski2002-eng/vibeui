import type { Locale } from "@/lib/i18n"
import type { CatalogItem, ItemControl } from "@/registry/meta"

/**
 * Item на выбранном языке. Русский — базовый: непереведённое поле остаётся
 * как есть, потому что честный оригинал лучше машинного перевода.
 *
 * Применяется один раз на входе, поэтому всё, что ниже — генератор промпта,
 * сниппет, панель контролов — про язык ничего не знает и работает как
 * работало.
 */
export function localizeItem(item: CatalogItem, locale: Locale): CatalogItem {
  const translation = locale === "ru" ? undefined : item.meta?.i18n?.[locale]

  if (!translation || !item.meta) {
    return item
  }

  const controls = item.meta.controls?.map((control): ItemControl => {
    const override = translation.controls?.[control.prop]

    if (!override) {
      return control
    }

    return {
      ...control,
      ...(override.label ? { label: override.label } : null),
      // Значение по умолчанию подменяется только тем же типом: смена типа
      // контрола переводом невозможна.
      ...(override.default !== undefined &&
      typeof override.default === typeof control.default
        ? { default: override.default }
        : null),
    } as ItemControl
  })

  return {
    ...item,
    title: translation.title ?? item.title,
    description: translation.description ?? item.description,
    meta: {
      ...item.meta,
      ai: { ...item.meta.ai, ...translation.ai },
      ...(controls ? { controls } : null),
      ...(translation.preview?.props
        ? {
            preview: {
              ...item.meta.preview,
              props: {
                ...item.meta.preview?.props,
                ...translation.preview.props,
              },
            },
          }
        : null),
    },
  }
}
