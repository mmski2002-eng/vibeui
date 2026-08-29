import { notFound } from "next/navigation"
import Link from "next/link"

import { BlockPreview } from "@/components/block-preview"
import { CatalogItemNav } from "@/components/catalog/catalog-item-nav"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { buildCopyForAiPrompt } from "@/lib/copy-for-ai"
import { getInstallCommand, getRegistryItemUrl } from "@/lib/site"
import {
  getCatalogItem,
  getCatalogItems,
  getCategoryLabel,
  getItemKind,
} from "@/registry/index"
import { getBlockSource } from "@/registry/source.server"

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const block = getCatalogItem(slug)

  if (!block) {
    return {}
  }

  return {
    title: block.title ?? block.name,
    description: block.description,
  }
}

export function generateStaticParams() {
  return getCatalogItems().map((item) => ({ slug: item.name }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const block = getCatalogItem(slug)

  if (!block) {
    notFound()
  }

  const source = await getBlockSource(slug)
  const installCommand = getInstallCommand(block.name)
  const registryUrl = getRegistryItemUrl(block.name)
  const kind = getItemKind(block.name) ?? "block"
  const aiPrompt = buildCopyForAiPrompt(block, {
    installCommand,
    registryUrl,
    kind,
  })
  const category = block.categories?.[0]
  const tags = block.meta?.tags ?? []

  return (
    <CatalogShell>
      <CatalogSidebar>
        <CatalogItemNav activeSlug={block.name} />
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
          <BlockPreview slug={block.name} compact={kind === "component"} />
        </section>

        {/* Главный блок страницы: пользователь пришёл за инструкцией для
            агента. Промпт — продукт, registry URL внутри него — транспорт,
            исходник — доверие и правка руками. Поэтому текст инструкции
            и код свёрнуты, а это действие открыто. См. docs/DELIVERY.md. */}
        <section
          aria-labelledby="use-heading"
          className="bg-shell-panel border-shell-border-strong mb-10 rounded-xl border p-5 sm:p-6"
        >
          <h2 id="use-heading" className="text-shell-fg text-xl font-medium">
            Использовать с AI
          </h2>

          <ol className="text-shell-muted mt-4 max-w-2xl space-y-1.5 text-sm">
            <li>1. Скопируйте инструкцию.</li>
            <li>2. Вставьте её агенту — Claude Code, Cursor или другому.</li>
            <li>
              3. Допишите своими словами, куда поставить: «размести на главной
              над тарифами».
            </li>
          </ol>

          <div className="mt-5">
            <CopyButton
              value={aiPrompt}
              label="Copy for AI"
              copiedLabel="Скопировано — вставьте агенту"
              variant="primary"
              className="h-11 px-5"
            />
          </div>

          <details
            id="ai-prompt"
            className="border-shell-border mt-6 scroll-mt-20 border-t pt-5"
          >
            <summary className="text-shell-muted hover:text-shell-fg cursor-pointer text-sm select-none marker:content-none [&::-webkit-details-marker]:hidden">
              Показать текст инструкции
            </summary>
            <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty">
              То, что попадёт агенту. Генерируется из metadata компонента,
              вручную для каждого блока не пишется.
            </p>
            <pre className="bg-shell-elevated border-shell-border text-shell-fg mt-3 max-h-96 overflow-auto rounded-lg border p-4 text-xs leading-relaxed whitespace-pre-wrap">
              {aiPrompt}
            </pre>
          </details>
        </section>

        {/* Вторичное: developer / inspection. Не путь установки. */}
        <section aria-labelledby="dev-heading" className="mb-12">
          <h2
            id="dev-heading"
            className="text-shell-muted mb-4 text-xs font-medium tracking-wide uppercase"
          >
            Для разработчика
          </h2>

          <div className="space-y-3">
            {installCommand && registryUrl ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <code className="bg-shell-elevated border-shell-border text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm">
                    {installCommand}
                  </code>
                  <CopyButton value={installCommand} label="Copy command" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <code className="bg-shell-elevated border-shell-border text-shell-muted min-w-0 flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm">
                    {registryUrl}
                  </code>
                  <CopyButton value={registryUrl} label="Registry URL" />
                </div>
              </>
            ) : (
              <p className="text-shell-muted text-sm">
                Команда установки недоступна: переменная окружения
                <code className="mx-1 font-mono">REGISTRY_BASE_URL</code>
                не задана.
              </p>
            )}
          </div>

          {block.docs ? (
            <p className="text-shell-muted mt-4 max-w-2xl text-sm text-pretty">
              {block.docs}
            </p>
          ) : null}

          <details
            id="code"
            className="border-shell-border mt-4 scroll-mt-20 rounded-xl border"
          >
            <summary className="text-shell-fg hover:text-shell-fg cursor-pointer px-4 py-3 text-sm font-medium select-none marker:content-none [&::-webkit-details-marker]:hidden">
              Исходник компонента
            </summary>
            <div className="border-shell-border border-t p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-shell-muted max-w-2xl text-sm text-pretty">
                  Тот же файл, который поставит агент. Нужен, если вы
                  предпочитаете скопировать код руками.
                </p>
                <CopyButton value={source} label="Copy code" />
              </div>
              {source ? (
                <CodeBlock code={source} />
              ) : (
                <p className="text-shell-muted text-sm">
                  Исходник компонента не найден.
                </p>
              )}
            </div>
          </details>
        </section>
      </main>
    </CatalogShell>
  )
}
