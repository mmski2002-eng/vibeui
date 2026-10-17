import type { Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import {
  catalogBasePath,
  getCatalogItems,
  getItemKind,
  isProItem,
} from "@/registry/index"
import { SCENARIOS } from "@/registry/scenarios"

/** Блоки на странице компонента: дальше список перестают читать. */
const BLOCKS_LIMIT = 6
/** Сценариев у одного item'а не больше семи — показываются все. */
const SCENARIOS_LIMIT = 7

export type ItemLink = { name: string; title: string; path: string }

/**
 * Блоки, которые импортируют компонент. Только прямые зависимости из
 * `registryDependencies`: блок, собранный из другого блока с этим
 * компонентом, сюда не попадает. Бесплатные идут первыми — по ним человек
 * может сразу пройти до установки.
 */
export function getBlocksUsing(name: string, locale: Locale): ItemLink[] {
  return getCatalogItems()
    .filter(
      (item) =>
        getItemKind(item.name) === "block" &&
        item.registryDependencies?.includes(name),
    )
    .sort(
      (a, b) =>
        Number(isProItem(a.name)) - Number(isProItem(b.name)) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, BLOCKS_LIMIT)
    .map((item) => ({
      name: item.name,
      title: localizeItem(item, locale).title ?? item.name,
      path: `${catalogBasePath("block")}/${item.name}`,
    }))
}

/** Сценарии, где item стоит секцией, с ролью, которую он там играет. */
export function getScenariosUsing(
  name: string,
  locale: Locale,
): (ItemLink & { role: string })[] {
  return SCENARIOS.flatMap((scenario) => {
    const section = scenario.sections.find((entry) => entry.item === name)

    return section
      ? [
          {
            name: scenario.slug,
            title: locale === "en" ? scenario.en : scenario.label,
            role: locale === "en" ? section.roleEn : section.role,
            path: `/scenarios/${scenario.slug}`,
          },
        ]
      : []
  }).slice(0, SCENARIOS_LIMIT)
}
