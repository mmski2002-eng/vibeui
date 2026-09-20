import type { MetadataRoute } from "next"

import { DEFAULT_LOCALE, LOCALES, type Locale, localePath } from "@/lib/i18n"
import { getScenarios } from "@/lib/scenario"
import { SITE_URL } from "@/lib/seo"
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
 * Один URL на каждый язык плюс перекрёстные hreflang: Яндекс и Google берут
 * языковые пары именно отсюда, дублировать их в разметке страницы не нужно.
 */
function url(locale: Locale, path: string): string {
  // Корень canonical'ом отдаётся без слэша — sitemap должен совпасть с ним
  // байт в байт, иначе Яндекс покажет расхождение адресов.
  return `${SITE_URL}${localePath(locale, path)}`.replace(/\/$/, "")
}

function localized(path: string, rest: Omit<Entry, "url">): Entry[] {
  const languages = {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, url(locale, path)])),
    "x-default": url(DEFAULT_LOCALE, path),
  }

  return LOCALES.map((locale: Locale) => ({
    url: url(locale, path),
    ...rest,
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const kinds = KINDS.map((kind) => kind.slug).filter(
    (kind) => kind !== "template",
  )

  const catalogs = kinds.flatMap((kind) =>
    localized(catalogBasePath(kind), {
      lastModified: at(LASTMOD.roots[kind]),
      changeFrequency: "weekly",
      priority: 0.9,
    }),
  )

  const categories = kinds.flatMap((kind) =>
    getCategoryCards(kind).flatMap((category) =>
      localized(`${catalogBasePath(kind)}/${category.slug}`, {
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

      return localized(`${base}/${item.name}`, {
        lastModified: at(LASTMOD.items[item.name]),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }),
  )

  // Сценарии и статические страницы двигаются вместе с сайтом, а не по своим
  // файлам: их немного, и отдельная git-дата на каждую не стоит усложнения.
  const scenarios = [
    ...localized("/scenarios", {
      lastModified: siteDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...getScenarios().flatMap((scenario) => [
      ...localized(`/scenarios/${scenario.slug}`, {
        lastModified: siteDate,
        changeFrequency: "monthly",
        priority: 0.7,
      }),
      // Демо — готовый сайт: языковая пара есть только у переведённых,
      // остальные — одна русская страница.
      ...(scenario.sourceEn
        ? localized(scenario.demo, {
            lastModified: siteDate,
            changeFrequency: "monthly",
            priority: 0.6,
          })
        : [
            {
              url: `${SITE_URL}${scenario.demo}`,
              lastModified: siteDate,
              changeFrequency: "monthly" as const,
              priority: 0.6,
            },
          ]),
    ]),
  ]

  return [
    ...localized("/", {
      lastModified: siteDate,
      changeFrequency: "weekly",
      priority: 1,
    }),
    ...localized("/start", {
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
