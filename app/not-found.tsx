import { cookies } from "next/headers"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { localePath, type Locale } from "@/lib/i18n"
import { Errorpage001 } from "@/registry/blocks/errors/errorpage-001/errorpage-001"

/** Витрина красится фирменным оранжевым: блок из реестра берёт его пропом. */
const BRAND_ACCENT = "#ff5900"

const TEXTS = {
  ru: {
    title: "Такой страницы нет",
    description:
      "Ссылка устарела или в адресе опечатка. Найдите нужный блок поиском или начните с главных разделов.",
    searchPlaceholder: "Поиск по каталогу: «навбар», «тарифы»…",
    searchButton: "Найти",
    linksLabel: "Куда дальше",
    links: [
      { label: "Блоки", path: "/blocks" },
      { label: "Компоненты", path: "/components" },
      { label: "Анимации", path: "/animations" },
      { label: "Тарифы", path: "/pricing" },
    ],
  },
  en: {
    title: "This page does not exist",
    description:
      "The link is outdated or there is a typo in the address. Search for the block you need or start from the main sections.",
    searchPlaceholder: "Search the catalog: “navbar”, “pricing”…",
    searchButton: "Search",
    linksLabel: "Where next",
    links: [
      { label: "Blocks", path: "/blocks" },
      { label: "Components", path: "/components" },
      { label: "Animations", path: "/animations" },
      { label: "Pricing", path: "/pricing" },
    ],
  },
} as const

export const metadata = {
  title: "404",
  robots: { index: false, follow: false },
}

/**
 * Страница 404 — блок errorpage-001 из нашего же каталога: витрина обязана
 * показывать свой товар и на тупиках. Язык — из куки переключателя: у
 * ненайденного адреса маршрута нет, и вычислить локаль по нему нельзя.
 */
export default async function NotFound() {
  const store = await cookies()
  const locale: Locale = store.get("vibeui-locale")?.value === "en" ? "en" : "ru"
  const t = TEXTS[locale]

  return (
    <CatalogShell locale={locale}>
      <main className="flex flex-1 items-center">
        <Errorpage001
          className="w-full"
          title={t.title}
          description={t.description}
          searchAction={localePath(locale, "/search")}
          searchPlaceholder={t.searchPlaceholder}
          searchButton={t.searchButton}
          linksLabel={t.linksLabel}
          links={t.links.map((link) => ({
            label: link.label,
            href: localePath(locale, link.path),
          }))}
          accent={BRAND_ACCENT}
        />
      </main>
    </CatalogShell>
  )
}
