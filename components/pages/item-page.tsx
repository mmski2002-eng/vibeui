import Link from "next/link"
import { notFound } from "next/navigation"

import { CatalogItemNav } from "@/components/catalog/catalog-item-nav"
import { CatalogColumns } from "@/components/catalog/catalog-columns"
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"
import { ItemWorkbench } from "@/components/catalog/item-workbench"
import { GatedReveal } from "@/components/catalog/gated-reveal"
import { JsonLd } from "@/components/json-ld"
import { ReportDialog } from "@/components/report/report-dialog"
import { resolveControlValues, resolvePreviewSurface } from "@/lib/controls"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { breadcrumbs, SITE_URL } from "@/lib/seo"
import { getItemDocUrl } from "@/lib/site"
import {
  catalogBasePath,
  getCatalogItem,
  getCategoryLabel,
  getItemKind,
} from "@/registry/index"

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

  const docUrl = getItemDocUrl(block.name)
  const kind = getItemKind(block.name) ?? "block"
  const category = block.categories?.[0]
  const tags = block.meta?.tags ?? []
  // Три пункта — верхняя граница читаемого списка в шапке: дальше человек
  // перестаёт их различать и просто пролистывает.
  const adapt = (block.meta?.ai?.adapt ?? []).slice(0, 3)

  const rootLabel =
    kind === "block"
      ? t.topbar.blocks
      : kind === "animation"
        ? t.topbar.animations
        : t.topbar.components
  const path = `${catalogBasePath(kind)}/${block.name}`

  return (
    <>
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
            {/* Вместо английских тегов — то, ради чего человек и открыл
                страницу: что в этом дизайне можно поменять под себя. Теги
                нужны поиску и лежат ниже, в разделе для разработчика. */}
            {adapt.length > 0 ? (
              <div className="mt-5 max-w-2xl">
                <p className="text-shell-muted mb-2 text-xs font-medium tracking-wide uppercase">
                  {t.item.adapt}
                </p>
                <ul className="text-shell-fg space-y-1 text-sm">
                  {adapt.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="text-shell-accent">
                        ·
                      </span>
                      <span className="text-pretty">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </header>

          <ItemWorkbench
            item={block}
            kind={kind}
            category={category ?? ""}
            locale={locale}
            docUrl={docUrl}
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

            <p className="text-shell-muted max-w-2xl text-sm text-pretty">
              {locale === "en"
                ? "The install command lives in the “Component source” block below — a signed link that stays valid for 24 hours."
                : "Команда установки — в блоке «Исходник компонента» ниже: подписанная ссылка действует сутки."}
            </p>

            {block.docs ? (
              <details className="border-shell-border mt-4 rounded-xl border">
                <summary className="text-shell-fg cursor-pointer px-4 py-3 text-sm font-medium select-none marker:content-none [&::-webkit-details-marker]:hidden">
                  {t.item.notes}
                </summary>
                <p className="text-shell-muted border-shell-border border-t px-4 py-3 text-sm text-pretty">
                  {block.docs}
                </p>
              </details>
            ) : null}

            {tags.length > 0 ? (
              <div className="mt-4">
                <p className="text-shell-muted mb-2 text-xs font-medium tracking-wide uppercase">
                  {t.item.tags}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-shell-border text-shell-muted rounded-full border px-2.5 py-1 text-xs"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Жалоба на компонент отсюда: человек уже стоит перед тем, что
                у него не заработало, и код item'а подставится сам. */}
            <div className="mt-4">
              {/* Почту вошедшего форма узнаёт на клиенте: страницы item'ов
                  собираются заранее, и обращение к сессии на сервере сделало
                  бы их динамическими — полторы тысячи страниц вместо файлов. */}
              <ReportDialog locale={locale} itemName={block.name} />
            </div>

            <GatedReveal
              id="code"
              issueFor={block.name}
              asCode
              summary={t.item.source}
              note={t.item.sourceNote}
              copyLabel={t.item.copyCode}
              locale={locale}
            />
          </section>
        </main>
      </CatalogColumns>
    </>
  )
}
