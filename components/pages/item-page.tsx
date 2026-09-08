import Link from "next/link"
import { notFound } from "next/navigation"

import { CatalogItemNav } from "@/components/catalog/catalog-item-nav"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { CatalogColumns } from "@/components/catalog/catalog-columns"
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"
import { ItemWorkbench } from "@/components/catalog/item-workbench"
import { CodeBlock } from "@/components/code-block"
import { JsonLd } from "@/components/json-ld"
import { CopyButton } from "@/components/copy-button"
import { resolveControlValues, resolvePreviewSurface } from "@/lib/controls"
import { buildCopyForAiPrompt } from "@/lib/copy-for-ai"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { breadcrumbs, SITE_URL } from "@/lib/seo"
import {
  getInstallCommand,
  getItemDocUrl,
  getRegistryItemUrl,
} from "@/lib/site"
import {
  catalogBasePath,
  getCatalogItem,
  getCategoryLabel,
  getItemKind,
} from "@/registry/index"
import { getBlockSource } from "@/registry/source.server"

/**
 * Страница item'а. Подложка и значения контролов приезжают с витрины через
 * query: переход по карточке не должен сбрасывать то, что человек уже
 * выставил (см. docs/CONTROLS.md).
 */
export async function ItemPage({
  locale,
  slug,
  query,
}: {
  locale: Locale
  slug: string
  query: Record<string, string | string[] | undefined>
}) {
  const found = getCatalogItem(slug)

  if (!found) {
    notFound()
  }

  const t = getDictionary(locale)
  const block = localizeItem(found, locale)

  const flat = new URLSearchParams(
    Object.entries(query).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value] as [string, string]] : [],
    ),
  )
  const initialTheme = resolvePreviewSurface(flat.get("theme") ?? undefined)
  const initialValues = resolveControlValues(block, flat)

  const source = await getBlockSource(slug)
  const installCommand = getInstallCommand(block.name)
  const registryUrl = getRegistryItemUrl(block.name)
  const docUrl = getItemDocUrl(block.name)
  const kind = getItemKind(block.name) ?? "block"
  const aiPrompt = buildCopyForAiPrompt(block, {
    installCommand,
    registryUrl,
    kind,
    locale,
  })
  const category = block.categories?.[0]
  const tags = block.meta?.tags ?? []

  const rootLabel =
    kind === "block"
      ? t.topbar.blocks
      : kind === "animation"
        ? t.topbar.animations
        : t.topbar.components
  const path = `${catalogBasePath(kind)}/${block.name}`

  return (
    <CatalogShell locale={locale}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: block.title ?? block.name,
          description: block.description,
          url: `${SITE_URL}${localePath(locale, path)}`,
          codeSampleType: "full solution",
          programmingLanguage: "TypeScript",
          runtimePlatform: "React",
          keywords: tags.join(", ") || undefined,
          isPartOf: { "@id": `${SITE_URL}/#website` },
        }}
      />
      <JsonLd
        data={breadcrumbs(locale, [
          { name: rootLabel, path: catalogBasePath(kind) },
          ...(category
            ? [
                {
                  name: getCategoryLabel(category, locale),
                  path: `${catalogBasePath(kind)}/${category}`,
                },
              ]
            : []),
          { name: block.title ?? block.name, path },
        ])}
      />
      <CatalogColumns>
        <CatalogSidebar>
          <CatalogItemNav activeSlug={block.name} locale={locale} />
        </CatalogSidebar>

        <main className="min-w-0 flex-1 py-6 lg:py-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="text-shell-muted flex flex-wrap items-center gap-2 text-sm">
              <li>
                <Link
                  href={localePath(locale, catalogBasePath(kind))}
                  className="hover:text-shell-fg"
                >
                  {rootLabel}
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={localePath(
                        locale,
                        `${catalogBasePath(kind)}/${category}`,
                      )}
                      className="hover:text-shell-fg"
                    >
                      {getCategoryLabel(category, locale)}
                    </Link>
                  </li>
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
                {getCategoryLabel(category, locale)}
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

          <ItemWorkbench
            item={block}
            kind={kind}
            category={category ?? ""}
            locale={locale}
            docUrl={docUrl}
            fullPrompt={aiPrompt}
            initialTheme={initialTheme}
            initialValues={initialValues}
          />

          {/* Вторичное: developer / inspection. Не путь установки. */}
          <section aria-labelledby="dev-heading" className="mb-12">
            <h2
              id="dev-heading"
              className="text-shell-muted mb-4 text-xs font-medium tracking-wide uppercase"
            >
              {t.item.dev}
            </h2>

            <div className="space-y-3">
              {installCommand && registryUrl ? (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <code className="bg-shell-elevated border-shell-border text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm">
                      {installCommand}
                    </code>
                    <CopyButton
                      value={installCommand}
                      label={t.item.copyCommand}
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <code className="bg-shell-elevated border-shell-border text-shell-muted min-w-0 flex-1 overflow-x-auto rounded-md border px-3 py-2 font-mono text-sm">
                      {registryUrl}
                    </code>
                    <CopyButton
                      value={registryUrl}
                      label={t.item.registryUrl}
                    />
                  </div>
                </>
              ) : (
                <p className="text-shell-muted text-sm">
                  {t.item.noCommand}
                  <code className="mx-1 font-mono">REGISTRY_BASE_URL</code>
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
                {t.item.source}
              </summary>
              <div className="border-shell-border border-t p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-shell-muted max-w-2xl text-sm text-pretty">
                    {t.item.sourceNote}
                  </p>
                  <CopyButton value={source} label={t.item.copyCode} />
                </div>
                {source ? (
                  <CodeBlock code={source} />
                ) : (
                  <p className="text-shell-muted text-sm">{t.item.noSource}</p>
                )}
              </div>
            </details>
          </section>
        </main>
      </CatalogColumns>
    </CatalogShell>
  )
}
