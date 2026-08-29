import { notFound } from "next/navigation"
import Link from "next/link"

import { BlockPreview } from "@/components/block-preview"
import { CatalogBlockNav } from "@/components/catalog/catalog-block-nav"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
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
    <CatalogShell>
      <CatalogSidebar>
        <CatalogBlockNav activeSlug={block.name} />
      </CatalogSidebar>

      <main className="min-w-0 flex-1 py-6 lg:py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="text-shell-muted flex flex-wrap items-center gap-2 text-sm">
            <li>
              <Link href="/components" className="hover:text-shell-fg">
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
            <li className="text-shell-fg font-medium">
              {block.title ?? block.name}
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          {category ? (
            <p className="text-shell-muted mb-2 text-xs font-medium tracking-wide uppercase">
              {getCategoryLabel(category)}
            </p>
          ) : null}
          <h1 className="text-shell-fg text-3xl font-semibold tracking-tight sm:text-4xl">
            {block.title ?? block.name}
          </h1>
          {block.description ? (
            <p className="text-shell-muted mt-3 max-w-2xl text-base">
              {block.description}
            </p>
          ) : null}
          {tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="border-shell-border text-shell-muted rounded-full border px-2.5 py-1 text-xs"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <section aria-labelledby="preview-heading" className="mb-12">
          <h2
            id="preview-heading"
            className="text-shell-fg mb-4 text-lg font-medium"
          >
            Preview
          </h2>
          <BlockPreview slug={block.name} />
        </section>

        {/* Главное действие страницы стоит сразу под превью: пользователь
            пришёл за инструкцией для агента, а не за исходником. */}
        <section
          aria-labelledby="use-heading"
          className="bg-shell-panel border-shell-border mb-12 rounded-xl border p-5 sm:p-6"
        >
          <h2 id="use-heading" className="text-shell-fg text-lg font-medium">
            Использовать с AI
          </h2>
          <p className="text-shell-muted mt-2 max-w-2xl text-sm text-pretty">
            Скопируйте инструкцию и вставьте её в Claude Code, Cursor или
            другого агента. В ней уже есть команда установки, список
            зависимостей и правила: что в блоке сохранить, а что можно менять.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CopyButton
              value={aiPrompt}
              label="Copy for AI"
              variant="primary"
              className="h-11 px-5 sm:w-auto"
            />
            <a
              href="#ai-prompt"
              className="text-shell-muted hover:text-shell-fg text-sm"
            >
              Посмотреть текст инструкции
            </a>
          </div>

          <div className="border-shell-border mt-6 border-t pt-5">
            <p className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
              Или поставьте вручную
            </p>
            {installCommand ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <code className="bg-shell-elevated border-shell-border text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm">
                  {installCommand}
                </code>
                <CopyButton value={installCommand} label="Copy command" />
              </div>
            ) : (
              <p className="text-shell-muted text-sm">
                Команда установки недоступна: переменная окружения
                <code className="mx-1 font-mono">REGISTRY_BASE_URL</code>
                не задана.
              </p>
            )}
            {block.docs ? (
              <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty">
                {block.docs}
              </p>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="code-heading" className="mb-12">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 id="code-heading" className="text-shell-fg text-lg font-medium">
              Исходник
            </h2>
            <CopyButton value={source} label="Copy code" />
          </div>
          <p className="text-shell-muted mb-4 max-w-2xl text-sm text-pretty">
            Тот же файл, который поставит агент. Нужен, если вы предпочитаете
            скопировать код руками.
          </p>
          {source ? (
            <CodeBlock code={source} />
          ) : (
            <p className="text-shell-muted text-sm">
              Исходник компонента не найден.
            </p>
          )}
        </section>

        <section
          aria-labelledby="ai-heading"
          id="ai-prompt"
          className="scroll-mt-20"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 id="ai-heading" className="text-shell-fg text-lg font-medium">
              Текст инструкции
            </h2>
            <CopyButton
              value={aiPrompt}
              label="Copy for AI"
              variant="primary"
            />
          </div>
          <p className="text-shell-muted mb-4 max-w-2xl text-sm text-pretty">
            То, что попадёт агенту. Генерируется из metadata компонента, вручную
            для каждого блока не пишется.
          </p>
          <pre className="bg-shell-elevated border-shell-border text-shell-fg max-h-96 overflow-auto rounded-lg border p-4 text-xs leading-relaxed whitespace-pre-wrap">
            {aiPrompt}
          </pre>
        </section>
      </main>
    </CatalogShell>
  )
}
