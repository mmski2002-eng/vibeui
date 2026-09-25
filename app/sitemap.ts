import type { MetadataRoute } from "next"
import { headers } from "next/headers"

import type { Locale } from "@/lib/i18n"
import { getScenarios } from "@/lib/scenario"
import { isClubHost, pageUrl } from "@/lib/seo"
import { KINDS } from "@/registry/categories"
import lastmod from "@/registry/generated/lastmod.json"
import {
  catalogBasePath,
  getCategoryCards,
  getItemKind,
  getItemsByKind,
  itemBasePath,
} from "@/registry/index"

type Entry = MetadataRoute.Sitemap[number]

// Дата последнего изменения из git (scripts/build-lastmod.mjs): Google
// перестаёт переобходить неизменные страницы. Отсутствующая запись (новый,
// ещё не закоммиченный item) откатывается на дату сборки — прежнее поведение.
const BUILD_DATE = new Date()
const LASTMOD = lastmod as {
  site: string | null
  roots: Record<string, string>
  categories: Record<string, string>
  items: Record<string, string>
}

function at(iso: string | null | undefined): Date {
  return iso ? new Date(iso) : BUILD_DATE
}

const siteDate = at(LASTMOD.site)

/**
 * Адрес на домене языка плюс пара hreflang. Sitemap отдаёт только страницы
 * того домена, который его запросил: .ru — русские, .club — английские.
 */
function languages(path: string, english = true) {
  const ru = pageUrl("ru", path)
  const en = pageUrl("en", path)

  return english ? { ru, en, "x-default": en } : { ru, "x-default": ru }
}

function localized(
  locale: Locale,
  path: string,
  rest: Omit<Entry, "url">,
  english = true,
): Entry[] {
  return [
    {
      url: pageUrl(locale, path),
      ...rest,
      alternates: { languages: languages(path, english) },
    },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale: Locale = isClubHost((await headers()).get("host")) ? "en" : "ru"
  const kinds = KINDS.map((kind) => kind.slug).filter(
    (kind) => kind !== "template",
  )

  const catalogs = kinds.flatMap((kind) =>
    localized(locale, catalogBasePath(kind), {
      lastModified: at(LASTMOD.roots[kind]),
      changeFrequency: "weekly",
      priority: 0.9,
    }),
  )

  const categories = kinds.flatMap((kind) =>
    getCategoryCards(kind).flatMap((category) =>
      localized(locale, `${catalogBasePath(kind)}/${category.slug}`, {
        lastModified: at(LASTMOD.categories[`${kind}/${category.slug}`]),
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    ),
  )

  const items = kinds.flatMap((kind) =>
    getItemsByKind(kind).flatMap((item) => {
      // Тип item'а решает раздел: kind из выборки и kind из индекса совпадают,
      // но путь строим по индексу — он источник истины для маршрута.
      const base = itemBasePath(getItemKind(item.name) ?? kind)

      return localized(locale, `${base}/${item.name}`, {
        lastModified: at(LASTMOD.items[item.name]),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }),
  )

  // Сценарии и статические страницы двигаются вместе с сайтом, а не по своим
  // файлам: их немного, и отдельная git-дата на каждую не стоит усложнения.
  const scenarios = [
    ...localized(locale, "/scenarios", {
      lastModified: siteDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...getScenarios().flatMap((scenario) => [
      ...localized(locale, `/scenarios/${scenario.slug}`, {
        lastModified: siteDate,
        changeFrequency: "monthly",
        priority: 0.7,
      }),
      // Демо — готовый сайт: языковая пара есть только у переведённых,
      // остальные — одна русская страница.
      ...(scenario.sourceEn
        ? localized(locale, scenario.demo, {
            lastModified: siteDate,
            changeFrequency: "monthly",
            priority: 0.6,
          })
        : locale === "ru"
          ? localized(locale, scenario.demo, {
              lastModified: siteDate,
              changeFrequency: "monthly",
              priority: 0.6,
            }, false)
          : []),
    ]),
  ]

  return [
    ...localized(locale, "/", {
      lastModified: siteDate,
      changeFrequency: "weekly",
      priority: 1,
    }),
    ...localized(locale, "/start", {
      lastModified: siteDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...catalogs,
    ...scenarios,
    ...categories,
    ...items,
  ]
}
