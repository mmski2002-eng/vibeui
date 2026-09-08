import { DEFAULT_LOCALE, type Locale, localePath } from "@/lib/i18n"
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

/** Локаль в формате Open Graph. */
const OG_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  en: "en_US",
}

/**
 * Canonical и hreflang для страницы. `path` — путь без языкового префикса
 * (`/components/hero-001`), пара для второго языка выводится из него же:
 * русская версия живёт в корне, английская под `/en`.
 */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      ru: localePath("ru", path),
      en: localePath("en", path),
      "x-default": localePath(DEFAULT_LOCALE, path),
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
  const url = localePath(locale, path)

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
    },
    // Иначе карточка в X осталась бы с заголовком корневого layout'а:
    // Next наследует twitter от родителя, даже когда openGraph переопределён.
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  }
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

    return pageMetadata({
      locale,
      path: `${base}/${category.slug}`,
      title: label,
      description: categoryDescription(locale, label, category.count),
    })
  }

  const item = localizeItem(found, locale)

  return pageMetadata({
    locale,
    path: `${base}/${item.name}`,
    title: item.title ?? item.name,
    description: item.description,
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
        item: `${SITE_URL}${localePath(locale, entry.path)}`,
      }),
    ),
  }
}
