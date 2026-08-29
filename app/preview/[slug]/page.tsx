import { notFound } from "next/navigation"

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

  return (
    <div
      className={
        theme === "dark"
          ? "dark bg-background min-h-screen"
          : "bg-background min-h-screen"
      }
    >
      <Block />
    </div>
  )
}
