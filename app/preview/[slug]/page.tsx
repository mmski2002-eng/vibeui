import { notFound } from "next/navigation"

import { getItemKind } from "@/registry/index"
import { CATALOG_PREVIEWS } from "@/registry/previews"

export function generateStaticParams() {
  return Object.keys(CATALOG_PREVIEWS).map((slug) => ({ slug }))
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ theme?: string }>
}) {
  const { slug } = await params
  const { theme } = await searchParams
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
      <Block />
    </div>
  )
}
