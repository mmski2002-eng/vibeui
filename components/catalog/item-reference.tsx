import Link from "next/link"

import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import type { ItemLink } from "@/lib/item-links"
import type { ItemControl } from "@/registry/meta"

type Dictionary = ReturnType<typeof getDictionary>

/** Значение по умолчанию словами; пустое — не выдумываем, а молчим. */
function defaultLabel(control: ItemControl, t: Dictionary): string | null {
  const value = control.default

  if (control.type === "boolean") {
    return value ? t.item.settingsOn : t.item.settingsOff
  }
  if (control.type === "color" && value === "") {
    return t.item.settingsTheme
  }
  if (value === "") {
    return null
  }

  return String(value)
}

/**
 * Справка item'а для человека: как вызвать, что настраивается и где он уже
 * стоит. Всё из metadata и состава сценариев — исходник здесь не появляется.
 */
export function ItemReference({
  locale,
  usage,
  controls,
  blocks,
  scenarios,
}: {
  locale: Locale
  usage?: string
  controls: ItemControl[]
  blocks: ItemLink[]
  scenarios: (ItemLink & { role: string })[]
}) {
  const t = getDictionary(locale)

  return (
    <>
      {usage ? (
        <section
          aria-labelledby="usage-heading"
          className="border-shell-border mb-10 rounded-xl border p-5"
        >
          <h2
            id="usage-heading"
            className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase"
          >
            {t.item.usage}
          </h2>
          <pre className="bg-shell-panel text-shell-fg overflow-x-auto rounded-lg p-4 font-mono text-xs leading-relaxed">
            <code>{usage}</code>
          </pre>
          <p className="text-shell-muted mt-3 max-w-2xl text-sm text-pretty">
            {t.item.usageNote}
          </p>
        </section>
      ) : null}

      {controls.length > 0 ? (
        <section
          aria-labelledby="settings-heading"
          className="border-shell-border mb-10 rounded-xl border p-5"
        >
          <h2
            id="settings-heading"
            className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase"
          >
            {t.item.settings}
          </h2>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {controls.map((control) => {
              const fallback = defaultLabel(control, t)

              return (
                <div key={control.prop} className="min-w-0">
                  <dt className="text-shell-fg text-sm">{control.label}</dt>
                  <dd className="text-shell-muted mt-0.5 text-xs break-words">
                    <code className="font-mono">{control.prop}</code>
                    {fallback !== null ? (
                      <>
                        {" · "}
                        {t.item.settingsDefault}: {fallback}
                      </>
                    ) : null}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>
      ) : null}

      {blocks.length > 0 ? (
        <LinkList
          id="used-in-blocks-heading"
          heading={t.item.usedInBlocks}
          locale={locale}
          links={blocks.map((block) => ({
            ...block,
            note: block.name,
          }))}
        />
      ) : null}

      {scenarios.length > 0 ? (
        <LinkList
          id="used-in-scenarios-heading"
          heading={t.item.usedInScenarios}
          locale={locale}
          links={scenarios.map((scenario) => ({
            ...scenario,
            note: scenario.role,
          }))}
        />
      ) : null}
    </>
  )
}

function LinkList({
  id,
  heading,
  locale,
  links,
}: {
  id: string
  heading: string
  locale: Locale
  links: (ItemLink & { note: string })[]
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-shell-border mb-10 rounded-xl border p-5"
    >
      <h2
        id={id}
        className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase"
      >
        {heading}
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.path} className="min-w-0">
            <Link
              href={localePath(locale, link.path)}
              className="text-shell-fg hover:text-shell-accent block text-sm text-pretty transition-colors"
            >
              {link.title}
            </Link>
            <span className="text-shell-muted block text-xs">{link.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
