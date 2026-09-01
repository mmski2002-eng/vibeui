import { notFound } from "next/navigation"

import { isLocale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getCatalogItem, getItemKind } from "@/registry/index"
import { CATALOG_PREVIEWS } from "@/registry/previews"

export function generateStaticParams() {
  return Object.keys(CATALOG_PREVIEWS).map((slug) => ({ slug }))
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ theme?: string; lang?: string }>
}) {
  const { slug } = await params
  const { theme, lang } = await searchParams
  const locale = isLocale(lang) ? lang : "ru"
  const item = getCatalogItem(slug)
  // Демо-содержимое на языке витрины: сам файл компонента остаётся русским,
  // меняются только пропсы, которыми его вызывает превью.
  const props = item
    ? localizeItem(item, locale).meta?.preview?.props
    : undefined
  const Block = CATALOG_PREVIEWS[slug]

  if (!Block) {
    notFound()
  }

  // Секция занимает фрейм целиком, мелкий компонент — нет: его нужно
  // центрировать, иначе кнопка окажется в углу пустой страницы 1440×760.
  const centered = getItemKind(slug) === "component"

  return (
    <div
      className={
        (theme === "dark" ? "dark " : "") +
        "bg-background min-h-screen" +
        (centered ? " flex items-center justify-center p-10" : "")
      }
    >
      <Block {...props} />
    </div>
  )
}
