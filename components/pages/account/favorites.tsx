import { desc, eq } from "drizzle-orm"
import { Heart } from "lucide-react"

import {
  FAVORITES_PER_PAGE,
  FavoritesList,
  type FavoriteRow,
} from "@/components/account/favorites-list"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ButtonLink } from "@/components/account/ui/button"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PageHeader } from "@/components/account/ui/page-header"
import { db } from "@/lib/db"
import { favorite } from "@/lib/db/schema"
import { localePath, type Locale } from "@/lib/i18n"
import { getScenario, scenarioText } from "@/lib/scenario"
import { requireUser } from "@/lib/session"
import { getItemDocUrl } from "@/lib/site"
import { KINDS } from "@/registry/categories"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Подпись типа: «Компоненты» → «Компонент» в единственном числе не нужен —
 *  фильтр читается как ярлык группы, а не как счётчик. */
function kindLabel(kind: string, locale: Locale) {
  if (kind === "scenario") return locale === "en" ? "Scenarios" : "Сценарии"

  const found = KINDS.find((entry) => entry.slug === kind)

  if (!found) return kind

  return locale === "en"
    ? kind === "block"
      ? "Blocks"
      : kind === "animation"
        ? "Animations"
        : "Components"
    : found.label
}

/**
 * Избранное. Строки из базы — только имена и даты, дёшево даже для сотен
 * записей; названия и тип приходят из реестра. Поэтому поиск по названию и
 * фильтр по типу считаются здесь, а не в SQL, и уже отфильтрованный список
 * режется на страницы.
 */
export async function AccountFavorites({
  locale,
  page,
  query,
  kind,
}: {
  locale: Locale
  page: number
  query: string
  kind: string
}) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].favorites

  const rows = await db
    .select({ itemName: favorite.itemName, createdAt: favorite.createdAt })
    .from(favorite)
    .where(eq(favorite.userId, user.id))
    .orderBy(desc(favorite.createdAt))

  const all: FavoriteRow[] = rows.map((row) => {
    const addedAt = row.createdAt.toLocaleDateString(
      locale === "en" ? "en-GB" : "ru-RU",
      { day: "numeric", month: "short" },
    )

    // Сценарии лежат в той же таблице под префиксом: у них своя страница
    // и нет ссылки для агента.
    const scenario = row.itemName.startsWith("scenario:")
      ? getScenario(row.itemName.slice("scenario:".length))
      : undefined

    if (scenario) {
      return {
        name: row.itemName,
        title: scenarioText(scenario, locale).label,
        kind: "scenario",
        kindLabel: kindLabel("scenario", locale),
        href: localePath(locale, `/scenarios/${scenario.slug}`),
        docUrl: null,
        addedAt,
      }
    }

    const item = getCatalogItem(row.itemName)
    const itemKind = getItemKind(row.itemName) ?? "component"

    return {
      name: row.itemName,
      title: item?.title ?? row.itemName,
      kind: itemKind,
      kindLabel: kindLabel(itemKind, locale),
      href: `${itemBasePath(itemKind)}/${row.itemName}`,
      docUrl: getItemDocUrl(row.itemName),
      addedAt,
    }
  })

  const kinds = new Map<string, string>()

  for (const row of all) kinds.set(row.kind, row.kindLabel)

  const needle = query.trim().toLowerCase()
  const filtered = all.filter((row) => {
    if (kind !== "all" && row.kind !== kind) return false
    if (!needle) return true

    return (
      row.title.toLowerCase().includes(needle) ||
      row.name.toLowerCase().includes(needle)
    )
  })
  const pageRows = filtered.slice(
    (page - 1) * FAVORITES_PER_PAGE,
    page * FAVORITES_PER_PAGE,
  )

  return (
    <>
      <PageHeader
        title={t.title}
        lead={t.lead}
        action={
          all.length > 0 ? (
            <p className="text-shell-muted text-sm tabular-nums">
              {t.count(all.length)}
            </p>
          ) : null
        }
      />

      {all.length === 0 ? (
        <EmptyState
          index={1}
          icon={<Heart />}
          title={t.empty}
          note={t.emptyNote}
          action={
            <ButtonLink
              href={localePath(locale, "/components")}
              variant="primary"
            >
              {t.emptyAction}
            </ButtonLink>
          }
        />
      ) : (
        <FavoritesList
          locale={locale}
          rows={pageRows}
          kinds={[...kinds.entries()]}
          total={filtered.length}
          page={page}
          query={query}
          kind={kind}
        />
      )}
    </>
  )
}
