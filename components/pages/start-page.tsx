import Link from "next/link"
import { Suspense } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Download,
  FolderOpen,
  Puzzle,
  Sparkles,
} from "lucide-react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { LiveCover } from "@/components/catalog/live-cover"
import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { Reveal } from "@/components/pages/pricing/reveal"
import { AgentTabs } from "@/components/pages/start/agent-tabs"
import { StartProgress, StepCheck } from "@/components/pages/start/progress"
import { StartDemo } from "@/components/pages/start/start-demo"
import { StartNav } from "@/components/pages/start/start-nav"
import { StartWelcome } from "@/components/pages/start/start-welcome"
import { START_TEXTS } from "@/components/pages/start/texts"
import { TryCopy } from "@/components/pages/start/try-copy"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { FREE_MONTHLY_LIMIT } from "@/lib/limits"
import { itemBasePath } from "@/registry/index"

import "@/components/pages/start/start.css"

/** Бесплатный блок, на котором новичок проходит цепочку до конца. */
const TRY_ITEM = "hero-001"

const SETUP_ICONS = [Download, Code2, Puzzle, FolderOpen]

const BTN_PRIMARY =
  "bg-shell-accent text-shell-accent-fg inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition hover:bg-shell-accent-deep active:scale-[0.98] focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"
const BTN_GHOST =
  "border-shell-border text-shell-fg hover:bg-shell-panel hover:border-shell-border-strong inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition active:scale-[0.98] focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none"

/**
 * Гайд для новичка: три входа по уровню, ролик цепочки и реальная кнопка
 * «Копировать для ИИ» в конце — сценарий продукта проверяется прямо здесь.
 * Чужие шаги (Node, редактор, агент) — строка и ссылка на официальные
 * инструкции: они меняются чаще, чем мы успели бы переписывать.
 */
export function StartPage({ locale }: { locale: Locale }) {
  const t = START_TEXTS[locale]
  const dictionary = getDictionary(locale)
  const itemHref = localePath(locale, `${itemBasePath("block")}/${TRY_ITEM}`)

  const setupIds = t.setup.steps.map((_, index) => `setup-${index}`)
  const pasteSteps = [t.paste.pick, t.paste.copy, t.paste.agent, t.paste.check]
  const pasteIds = pasteSteps.map((_, index) => `paste-${index}`)

  return (
    <CatalogShell locale={locale} wash>
      <StartProgress ids={[...setupIds, ...pasteIds]}>
        <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pb-6 lg:px-6">
          {/* Первый экран: заголовок всплывает лесенкой, под ним сразу
              ролик — он и есть главный визуал страницы. */}
          <header className="start-glow -mx-4 px-4 pt-6 lg:-mx-6 lg:px-6 lg:pt-10">
            <Suspense fallback={null}>
              <StartWelcome text={t.welcome} variant="top" />
            </Suspense>

            <div className="hero-rise flex flex-col items-start gap-4">
              <span className="border-shell-accent-line bg-shell-accent-soft/80 text-shell-accent-text inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3.5" aria-hidden="true" />
                {t.badge}
              </span>
              <h1 className="type-h1 text-shell-fg max-w-3xl">{t.title}</h1>
              <p className="type-lead text-shell-muted max-w-2xl text-pretty">
                {t.lead}
              </p>

              <nav
                aria-label={t.navLabel}
                className="grid w-full gap-3 pt-2 sm:grid-cols-3"
              >
                {t.levels.map((level, index) => (
                  <a
                    key={level.anchor}
                    href={`#${level.anchor}`}
                    className="group border-shell-border bg-shell-panel acc-lift relative flex flex-col gap-1 overflow-hidden rounded-xl border p-4"
                  >
                    <span aria-hidden="true" className="start-index">
                      {index + 1}
                    </span>
                    <span className="text-shell-fg font-medium">
                      {level.title}
                    </span>
                    <span className="text-shell-muted text-sm">
                      {level.note}
                    </span>
                    <ArrowRight
                      className="text-shell-muted group-hover:text-shell-accent-text mt-2 size-4 transition-[color,transform] duration-(--motion-base) group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </nav>
            </div>

            <Reveal className="mt-10">
              <StartDemo text={t.demo} />
            </Reveal>
          </header>

          <StartNav locale={locale} />

          <Section
            id="setup"
            number={1}
            heading={t.setup.heading}
            lead={t.setup.lead}
          >
            <ol className="grid gap-4 sm:grid-cols-2">
              {t.setup.steps.map((step, index) => {
                const Icon = SETUP_ICONS[index] ?? Download

                return (
                  <li key={step.title}>
                    <Reveal delay={index * 80} className="h-full">
                      <div className="border-shell-border bg-shell-panel acc-lift relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border p-4">
                        <span aria-hidden="true" className="start-index">
                          {index + 1}
                        </span>
                        <div className="flex items-start gap-3">
                          <StepCheck
                            id={setupIds[index]}
                            number={index + 1}
                            label={t.checkLabel(step.title)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <h3 className="text-shell-fg flex items-center gap-2 font-medium">
                                <Icon
                                  className="text-shell-accent-text size-4 shrink-0"
                                  aria-hidden="true"
                                />
                                {step.title}
                              </h3>
                              {step.link ? (
                                <a
                                  href={step.link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-shell-muted hover:text-shell-fg inline-flex shrink-0 items-center gap-1 text-xs transition-colors"
                                >
                                  {step.link.label}
                                  <ArrowUpRight
                                    className="size-3"
                                    aria-hidden="true"
                                  />
                                </a>
                              ) : null}
                            </div>
                            <p className="text-shell-muted mt-1 text-sm leading-relaxed">
                              {step.body}
                            </p>
                          </div>
                        </div>
                        {step.code ? (
                          <CopyableCode
                            code={step.code}
                            label={t.copy}
                            copiedLabel={t.copied}
                          />
                        ) : null}
                      </div>
                    </Reveal>
                  </li>
                )
              })}
            </ol>
          </Section>

          <Section
            id="paste"
            number={2}
            heading={t.paste.heading}
            lead={t.paste.lead}
          >
            <ol className="flex flex-col gap-8">
              <Step
                id={pasteIds[0]}
                number={1}
                title={t.paste.pick.title}
                label={t.checkLabel(t.paste.pick.title)}
              >
                <p>{t.paste.pick.body}</p>
              </Step>
              <Step
                id={pasteIds[1]}
                number={2}
                title={t.paste.copy.title}
                label={t.checkLabel(t.paste.copy.title)}
              >
                <p>{t.paste.copy.body}</p>
              </Step>
              <Step
                id={pasteIds[2]}
                number={3}
                title={t.paste.agent.title}
                label={t.checkLabel(t.paste.agent.title)}
              >
                <p>{t.paste.agent.body}</p>
                <div className="mt-4">
                  <AgentTabs
                    tabs={t.paste.agent.tabs}
                    copy={t.copy}
                    copied={t.copied}
                  />
                </div>
                <p className="border-shell-border text-shell-muted mt-4 border-l-2 pl-3 text-sm">
                  {t.paste.agent.fallback}
                </p>
              </Step>
              <Step
                id={pasteIds[3]}
                number={4}
                title={t.paste.check.title}
                label={t.checkLabel(t.paste.check.title)}
              >
                <p>{t.paste.check.body}</p>
                <p className="border-shell-accent-line bg-shell-accent-soft/40 text-shell-fg mt-3 rounded-lg border px-3 py-2 text-sm">
                  {t.paste.check.fix}
                </p>
              </Step>
            </ol>

            <Reveal className="mt-10">
              <div className="border-shell-accent-line bg-shell-panel overflow-hidden rounded-2xl border shadow-[0_24px_64px_-32px_color-mix(in_oklab,var(--shell-accent)_60%,transparent)]">
                <LiveCover
                  src={`/preview/${TRY_ITEM}`}
                  title={TRY_ITEM}
                  height={720}
                />
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-shell-fg font-medium">
                      {t.paste.tryIt.title}
                    </h3>
                    <p className="text-shell-muted text-sm">
                      {t.paste.tryIt.body}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <TryCopy
                      name={TRY_ITEM}
                      label={dictionary.card.copy}
                      copiedLabel={dictionary.card.copied}
                      locale={locale}
                    />
                    <Link
                      href={itemHref}
                      className="text-shell-muted hover:text-shell-fg inline-flex items-center gap-1 text-sm transition-colors"
                    >
                      {t.paste.tryIt.open}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </Section>

          <Section
            id="page"
            number={3}
            heading={t.page.heading}
            lead={t.page.lead}
          >
            <ul className="grid gap-4 sm:grid-cols-2">
              {t.page.items.map((item, index) => (
                <li key={item.title}>
                  <Reveal delay={index * 80} className="h-full">
                    <div className="border-shell-border bg-shell-panel acc-lift flex h-full flex-col gap-2 rounded-xl border p-4">
                      <h3 className="text-shell-fg font-medium">
                        {item.title}
                      </h3>
                      <p className="text-shell-muted text-sm leading-relaxed">
                        {item.body.replace(
                          "{limit}",
                          String(FREE_MONTHLY_LIMIT),
                        )}
                      </p>
                      {item.link ? (
                        <Link
                          href={localePath(locale, item.link.href)}
                          className="text-shell-fg hover:text-shell-accent-text mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium transition-colors"
                        >
                          {item.link.label}
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>

          {/* Финал: тёплое пятно снизу, как последняя секция лендинга. */}
          <Reveal className="start-glow-bottom -mx-4 mt-20 px-4 pt-16 pb-12 text-center lg:-mx-6 lg:px-6">
            <h2 className="type-h2 text-shell-fg mx-auto max-w-2xl">
              {t.finish.title}
            </h2>
            <p className="type-lead text-shell-muted mx-auto mt-3 max-w-xl text-pretty">
              {t.finish.lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Suspense fallback={null}>
                <StartWelcome text={t.welcome} variant="bottom" />
              </Suspense>
              <Link
                href={localePath(locale, "/blocks")}
                className={BTN_PRIMARY}
              >
                {t.finish.catalog}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={localePath(locale, "/scenarios")}
                className={BTN_GHOST}
              >
                {t.finish.scenarios}
              </Link>
            </div>
          </Reveal>
        </main>
      </StartProgress>
    </CatalogShell>
  )
}

function Section({
  id,
  number,
  heading,
  lead,
  children,
}: {
  id: string
  number: number
  heading: string
  lead: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-32 pt-16">
      <Reveal>
        <header className="mb-6">
          <span className="type-label text-shell-accent-text">{number}</span>
          <h2 className="type-h2 text-shell-fg mt-1">{heading}</h2>
          <p className="text-shell-muted mt-2 max-w-2xl text-pretty">{lead}</p>
        </header>
      </Reveal>
      {children}
    </section>
  )
}

function Step({
  id,
  number,
  title,
  label,
  children,
}: {
  id: string
  number: number
  title: string
  label: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Reveal className="grid gap-2 sm:grid-cols-[2.5rem_1fr]">
        <StepCheck id={id} number={number} label={label} />
        <div className="text-shell-muted text-sm leading-relaxed sm:text-base">
          <h3 className="text-shell-fg mb-1 text-base font-medium sm:text-lg">
            {title}
          </h3>
          {children}
        </div>
      </Reveal>
    </li>
  )
}

/* Команда или фраза для агента с кнопкой копирования в углу. */
function CopyableCode({
  code,
  label,
  copiedLabel,
}: {
  code: string
  label: string
  copiedLabel: string
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <CodeBlock code={code} />
      </div>
      <CopyButton
        value={code}
        label={label}
        copiedLabel={copiedLabel}
        className="h-8 px-2.5 text-xs"
      />
    </div>
  )
}
