import type { Locale } from "@/lib/i18n"
import { CLUB_ORIGIN } from "@/lib/club-routes"
import { categoryCopy } from "@/lib/landing-copy"
import { localizeItem } from "@/lib/localize"
import type { ItemKind } from "@/registry/categories"
import {
  catalogBasePath,
  getCatalogItem,
  getCategoryCards,
  getCategoryLabel,
} from "@/registry/index"

/**
 * Канонический origin сайта. В отличие от `getSiteBaseUrl()` он не зависит от
 * `REGISTRY_BASE_URL`: canonical и sitemap обязаны указывать на боевой домен
 * даже когда сборка идёт без окружения.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vibeui.ru"
).replace(/\/+$/, "")

export const SITE_NAME = "VibeUI"

export const RU_ORIGIN = "https://vibeui.ru"
export { CLUB_ORIGIN }

export function isClubHost(host: string | null | undefined) {
  const name = (host ?? "").split(":")[0].toLowerCase()

  return name === "vibeui.club" || name === "www.vibeui.club"
}

export function originFor(locale: Locale) {
  return locale === "en" ? CLUB_ORIGIN : RU_ORIGIN
}

/** Публичный origin только из разрешённого host; заголовкам прокси не доверяем. */
export function originFromHost(host: string | null | undefined) {
  return isClubHost(host) ? CLUB_ORIGIN : RU_ORIGIN
}

/** Абсолютный публичный адрес страницы на домене её языка. */
export function pageUrl(locale: Locale, path: string) {
  const bare = path.startsWith("/") ? path : `/${path}`

  return bare === "/" ? originFor(locale) : `${originFor(locale)}${bare}`
}

/** Локаль в формате Open Graph. */
const OG_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  en: "en_US",
}

/**
 * Canonical и hreflang. Русский адрес на vibeui.ru, английский на vibeui.club,
 * путь один и тот же. x-default — английский: язык без пары садится на .club.
 */
export function alternates(locale: Locale, path: string) {
  const ru = pageUrl("ru", path)
  const en = pageUrl("en", path)

  return {
    canonical: locale === "en" ? en : ru,
    languages: {
      ru,
      en,
      "x-default": en,
    },
  }
}

/**
 * Метаданные страницы: title/description плюс canonical, hreflang и Open Graph
 * с тем же URL. Собираются в одном месте, чтобы страницы не расходились.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: Locale
  path: string
  title: string
  description?: string
  /** Заголовок уже содержит имя сайта — шаблон `%s — VibeUI` не применять. */
  absoluteTitle?: boolean
}) {
  const url = pageUrl(locale, path)
  // Явная картинка сайта: стоит странице объявить свой openGraph, и Next
  // перестаёт наследовать файловую opengraph-image корня.
  const image = {
    url:
      locale === "en"
        ? `${CLUB_ORIGIN}/en/opengraph-image`
        : `${RU_ORIGIN}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website" as const,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      images: [image],
    },
    // Иначе карточка в X осталась бы с заголовком корневого layout'а:
    // Next наследует twitter от родителя, даже когда openGraph переопределён.
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image.url],
    },
  }
}

const ITEM_TYPE: Record<Locale, Record<ItemKind, string>> = {
  ru: {
    block: "React-блок",
    component: "React-компонент",
    animation: "React-анимация",
    template: "React-шаблон",
  },
  en: {
    block: "React block",
    component: "React component",
    animation: "React animation",
    template: "React template",
  },
}

/** Слово вида уже в названии — тогда к нему дописывается только стек. */
const KIND_WORD: Record<Locale, Record<ItemKind, RegExp>> = {
  ru: {
    block: /блок/i,
    component: /компонент/i,
    animation: /аним/i,
    template: /шаблон/i,
  },
  en: {
    block: /block/i,
    component: /component/i,
    animation: /animat/i,
    template: /template/i,
  },
}

/** Дальше Google режет заголовок, и хвост с типом всё равно не виден. */
const ITEM_TITLE_LIMIT = 55

/**
 * Заголовок item'а в выдаче: название плюс что это и на чём — так ищут
 * («avatar stack react»). H1 остаётся названием без приписок.
 */
function itemTitle(title: string, kind: ItemKind, locale: Locale) {
  if (title.length > ITEM_TITLE_LIMIT || /react/i.test(title)) {
    return `${title} | ${SITE_NAME}`
  }

  const type = KIND_WORD[locale][kind].test(title)
    ? "React"
    : ITEM_TYPE[locale][kind]

  return `${title} — ${type} | ${SITE_NAME}`
}

/**
 * Метаданные сегмента `[slug]` каталога: за одним маршрутом стоят страница
 * item'а и страница категории, различаются числовым суффиксом в имени.
 * Общая на шесть файлов — блоки, компоненты и анимации на двух языках.
 */
export function catalogSlugMetadata({
  kind,
  locale,
  slug,
}: {
  kind: ItemKind
  locale: Locale
  slug: string
}) {
  const base = catalogBasePath(kind)
  const found = getCatalogItem(slug)

  if (!found) {
    const category = getCategoryCards(kind, locale).find(
      (entry) => entry.slug === slug,
    )

    if (!category) {
      return {}
    }

    const label = getCategoryLabel(category.slug, locale)
    const copy = categoryCopy(kind, category.slug, locale)

    return pageMetadata({
      locale,
      path: `${base}/${category.slug}`,
      title: copy?.title ?? label,
      description:
        copy?.description ?? categoryDescription(locale, label, category.count),
    })
  }

  const item = localizeItem(found, locale)

  return pageMetadata({
    locale,
    path: `${base}/${item.name}`,
    title: itemTitle(item.title ?? item.name, kind, locale),
    description: item.description,
    absoluteTitle: true,
  })
}

function categoryDescription(
  locale: Locale,
  label: string,
  count: number,
): string {
  return locale === "ru"
    ? `${label} — ${count} готовых вариантов на React и Tailwind CSS. Живое превью, установка одной командой и готовая инструкция для ИИ-агента.`
    : `${label} — ${count} ready-made variants built with React and Tailwind CSS. Live preview, one-command install and a ready prompt for your AI agent.`
}

/**
 * Хлебные крошки для страницы каталога. Поисковик показывает их вместо
 * длинного URL, а заодно понимает вложенность раздела.
 */
export function breadcrumbs(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, path: "/" }, ...trail].map(
      (entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
        item: pageUrl(locale, entry.path),
      }),
    ),
  }
}
