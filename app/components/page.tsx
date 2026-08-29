import { BlockCard } from "@/components/block-card"
import { SiteHeader } from "@/components/site-header"
import { getBlocks } from "@/registry/index"

export const metadata = {
  title: "Components",
  description:
    "Каталог AI-native UI-компонентов VibeUI: live preview, готовый код и инструкция для AI-агента.",
}

export default function ComponentsPage() {
  const blocks = getBlocks()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Components
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Блоки, готовые к установке AI-агентом. Каждый ставится одной
            командой и не зависит от темы вашего проекта.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            {blocks.length} {blocks.length === 1 ? "компонент" : "компонента"}
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <li key={block.name}>
              <BlockCard block={block} />
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
