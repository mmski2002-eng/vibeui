import { notFound } from "next/navigation"

import { BLOCK_COMPONENTS } from "@/registry/components"

export function generateStaticParams() {
  return Object.keys(BLOCK_COMPONENTS).map((slug) => ({ slug }))
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
  const Block = BLOCK_COMPONENTS[slug]

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
