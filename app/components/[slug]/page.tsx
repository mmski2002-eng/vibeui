import { notFound } from "next/navigation"
import Link from "next/link"

import { BlockPreview } from "@/components/block-preview"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { SiteHeader } from "@/components/site-header"
import { buildCopyForAiPrompt } from "@/lib/copy-for-ai"
import { getInstallCommand } from "@/lib/site"
import { getBlock, getBlocks, getCategoryLabel } from "@/registry/index"
import { getBlockSource } from "@/registry/source.server"

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const block = getBlock(slug)

  if (!block) {
    return {}
  }

  return {
    title: block.title ?? block.name,
    description: block.description,
  }
}

export function generateStaticParams() {
  return getBlocks().map((block) => ({ slug: block.name }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const block = getBlock(slug)

  if (!block) {
    notFound()
  }

  const source = await getBlockSource(slug)
  const installCommand = getInstallCommand(block.name)
  const aiPrompt = buildCopyForAiPrompt(block, installCommand)
  const category = block.categories?.[0]
  const tags = block.meta?.tags ?? []

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link href="/components" className="hover:text-foreground">
                Components
              </Link>
            </li>
            {category ? (
              <>
                <li aria-hidden="true">/</li>
                <li>{getCategoryLabel(category)}</li>
              </>
            ) : null}
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">
              {block.title ?? block.name}
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          {category ? (
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              {getCategoryLabel(category)}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {block.title ?? block.name}
          </h1>
          {block.description ? (
            <p className="text-muted-foreground mt-3 max-w-2xl text-base">
              {block.description}
            </p>
          ) : null}
          {tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="text-muted-foreground rounded-full border px-2.5 py-1 text-xs"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <section aria-labelledby="preview-heading" className="mb-12">
          <h2 id="preview-heading" className="mb-4 text-lg font-medium">
            Preview
          </h2>
          <BlockPreview slug={block.name} />
        </section>

        <section aria-labelledby="install-heading" className="mb-12">
          <h2 id="install-heading" className="mb-4 text-lg font-medium">
            Installation
          </h2>
          {installCommand ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="bg-muted/40 min-w-0 flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm">
                {installCommand}
              </code>
              <CopyButton value={installCommand} label="Copy command" />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Команда установки недоступна: переменная окружения
              <code className="mx-1 font-mono">REGISTRY_BASE_URL</code>
              не задана.
            </p>
          )}
          {block.docs ? (
            <p className="text-muted-foreground mt-3 max-w-2xl text-sm">
              {block.docs}
            </p>
          ) : null}
        </section>

        <section aria-labelledby="code-heading" className="mb-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="code-heading" className="text-lg font-medium">
              Code
            </h2>
            <CopyButton value={source} label="Copy code" />
          </div>
          {source ? (
            <CodeBlock code={source} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Исходник компонента не найден.
            </p>
          )}
        </section>

        <section aria-labelledby="ai-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="ai-heading" className="text-lg font-medium">
              Copy for AI
            </h2>
            <CopyButton
              value={aiPrompt}
              label="Copy for AI"
              variant="primary"
            />
          </div>
          <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
            Инструкция для AI-агента: что установить, что сохранить и что можно
            менять. Генерируется из metadata компонента.
          </p>
          <pre className="bg-muted/40 max-h-96 overflow-auto rounded-lg border p-4 text-xs leading-relaxed whitespace-pre-wrap">
            {aiPrompt}
          </pre>
        </section>
      </main>
    </>
  )
}
