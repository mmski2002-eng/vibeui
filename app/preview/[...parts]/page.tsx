import { notFound, redirect } from "next/navigation"

import { isLocale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import type { ItemKind } from "@/registry/categories"
import { getCatalogItem, getItemKind } from "@/registry/index"
import { loadPreviewMap } from "@/registry/preview-loaders"

function isItemKind(value: string): value is ItemKind {
  return (
    value === "block" ||
    value === "component" ||
    value === "animation" ||
    value === "template"
  )
}

function queryString(params: { theme?: string; lang?: string }) {
  const query = new URLSearchParams()

  if (params.theme) {
    query.set("theme", params.theme)
  }

  if (params.lang) {
    query.set("lang", params.lang)
  }

  return query.toString()
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ parts: string[] }>
  searchParams: Promise<{ theme?: string; lang?: string }>
}) {
  const { parts } = await params
  const query = await searchParams

  if (parts.length === 1) {
    const [slug] = parts
    const item = getCatalogItem(slug)
    const kind = getItemKind(slug)
    const category = item?.categories?.[0]

    if (!item || !kind || !category) {
      notFound()
    }

    const suffix = queryString(query)

    redirect(
      `/preview/${kind}/${category}/${slug}${suffix ? `?${suffix}` : ""}`,
    )
  }

  if (parts.length !== 3) {
    notFound()
  }

  const [rawKind, category, slug] = parts
  const locale = isLocale(query.lang) ? query.lang : "ru"
  const item = getCatalogItem(slug)
  const itemKind = getItemKind(slug)

  if (
    !item ||
    !itemKind ||
    !isItemKind(rawKind) ||
    rawKind !== itemKind ||
    item.categories?.[0] !== category
  ) {
    notFound()
  }

  const props = localizeItem(item, locale).meta?.preview?.props
  // Категория отдаёт карту загрузчиков, а не готовых компонентов: превью
  // рендерит один item, и статический импорт всей категории тянул бы за ним
  // десятки соседних компонентов.
  const loaders = await loadPreviewMap(itemKind, category)
  const load = loaders?.[slug]

  if (!load) {
    notFound()
  }

  const Block = await load()

  const centered = itemKind !== "block"

  return (
    <div
      className={
        (query.theme === "dark" ? "dark " : "") +
        "bg-background min-h-screen overflow-x-hidden" +
        (centered ? " flex justify-center p-4 sm:p-10" : "")
      }
    >
      <Block {...props} />
    </div>
  )
}
