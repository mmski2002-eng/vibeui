"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"

import { BlockPreview } from "@/components/block-preview"
import { CopyFlow } from "@/components/catalog/copy-flow"
import {
  ConfigurablePreview,
  ItemControls,
} from "@/components/catalog/item-configurator"
import { CopyForAi } from "@/components/catalog/copy-for-ai"
import { GatedReveal } from "@/components/catalog/gated-reveal"
import {
  defaultValues,
  getControls,
  resolveControlValues,
  resolvePreviewSurface,
  toSearchParams,
  type ControlValues,
  type PreviewSurface,
} from "@/lib/controls"
import { useShellIsLight } from "@/components/catalog/theme-switch"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"
import type { CatalogItem } from "@/registry/meta"

type WorkbenchProps = {
  item: CatalogItem
  kind: ItemKind
  category: string
  locale: Locale
  docUrl: string | null
  /** Закрытый item: у не-Pro кнопка «Копировать» превращается в «Доступно с Pro». */
  pro: boolean
}

/**
 * Превью и выдача на странице item'а. Состояние — подложка и значения
 * контролов — приходит с витрины через query и живёт здесь: обе секции
 * должны показывать одну и ту же настройку, и она же уезжает в ссылку.
 *
 * Query читается на клиенте через `useSearchParams`, а не из `searchParams`
 * страницы: серверное чтение переводило все страницы items в динамический
 * рендер на каждый запрос. Suspense — требование Next для статических
 * страниц; в fallback та же выдача с дефолтами, чтобы HTML не терял разметку.
 */
export function ItemWorkbench(props: WorkbenchProps) {
  return (
    <Suspense
      fallback={
        <Workbench
          {...props}
          initialTheme="auto"
          initialValues={defaultValues(getControls(props.item))}
        />
      }
    >
      <QueryWorkbench {...props} />
    </Suspense>
  )
}

function QueryWorkbench(props: WorkbenchProps) {
  const query = useSearchParams()

  return (
    <Workbench
      {...props}
      initialTheme={resolvePreviewSurface(query.get("theme") ?? undefined)}
      initialValues={resolveControlValues(props.item, query)}
    />
  )
}

function Workbench({
  item,
  kind,
  category,
  locale,
  docUrl,
  pro,
  initialTheme,
  initialValues,
}: WorkbenchProps & {
  initialTheme: PreviewSurface
  initialValues: ControlValues
}) {
  const t = getDictionary(locale)
  const [theme, setTheme] = useState<PreviewSurface>(initialTheme)
  const shellLight = useShellIsLight()
  // Фрейм превью грузится по ссылке с конкретной темой, «как у оболочки» в
  // ней не выразить — поэтому здесь выбор доводится до dark/light.
  const frameTheme = theme === "auto" ? (shellLight ? "light" : "dark") : theme
  const [values, setValues] = useState<ControlValues>(initialValues)
  const controls = getControls(item)
  // Подсказка живёт дольше, чем «Скопировано» на кнопке: человек в этот
  // момент уже переключается в свой редактор и читает её там краем глаза.
  const [copied, setCopied] = useState(false)
  const hintTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(hintTimer.current), [])

  function noteCopied() {
    setCopied(true)
    window.clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => setCopied(false), 10000)
  }

  const params = toSearchParams(controls, values)

  if (locale !== "ru") {
    params.set("lang", locale)
  }

  // Подложка кадра едет вместе с настройками: инструкция под спойлером и
  // ссылка для агента должны говорить о том блоке, который человек видел.
  params.set("theme", frameTheme)

  const link = docUrl
    ? params.toString()
      ? `${docUrl}?${params}`
      : docUrl
    : null

  // Инструкция для агента забирается по закрытому /c при раскрытии, а не
  // впечатывается в страницу: без входа и без Pro сервер отвечает 401.
  const promptUrl = params.toString()
    ? `/c/${item.name}?${params}`
    : `/c/${item.name}`

  return (
    <>
      {/* Главное действие стоит до превью, а не после него: на телефоне
          превью занимает экран целиком, и кнопка под ним начиналась только
          после долгой прокрутки. Ниже она повторяется — там, где человек
          читает шаги. */}
      <div className="border-shell-border-strong bg-shell-panel mb-6 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-shell-muted max-w-md text-sm text-pretty">
          {t.item.copyLead}
        </p>
        <CopyForAi
          name={item.name}
          params={params.toString()}
          label={t.card.copy}
          copiedLabel={t.card.copied}
          locale={locale}
          pro={pro}
          className="h-11 shrink-0 px-5"
          onCopied={noteCopied}
        />
      </div>

      {copied ? (
        <p
          role="status"
          className="border-shell-accent/40 bg-shell-accent/10 text-shell-fg mb-6 rounded-lg border px-3 py-2 text-sm"
        >
          {t.item.copyHint}
        </p>
      ) : null}

      <section aria-labelledby="preview-heading" className="mb-12">
        <h2
          id="preview-heading"
          className="text-shell-fg mb-4 text-lg font-medium"
        >
          {t.item.preview}
        </h2>
        <BlockPreview
          locale={locale}
          slug={item.name}
          kind={kind}
          category={category}
          theme={frameTheme}
          onThemeChange={setTheme}
        />
      </section>

      <section
        aria-labelledby="use-heading"
        data-preview-theme={theme}
        className="bg-shell-panel border-shell-border-strong mb-10 rounded-xl border p-5 sm:p-6"
      >
        <h2 id="use-heading" className="text-shell-fg text-xl font-medium">
          {t.item.use}
        </h2>

        <ol className="text-shell-muted mt-4 max-w-2xl space-y-1.5 text-sm">
          {t.item.steps.map((step, index) => (
            <li key={step}>
              {index + 1}. {step}
            </li>
          ))}
        </ol>

        {controls.length > 0 ? (
          // Настройка меняет пропсы и ссылку, но не исходник: установленный
          // файл обязан остаться тем же (см. docs/CONTROLS.md).
          <div className="border-shell-border bg-shell mt-5 overflow-hidden rounded-xl border">
            <div className="bg-preview-surface flex min-h-32 items-center justify-center p-6">
              <ConfigurablePreview
                slug={item.name}
                kind={kind}
                category={category}
                full={
                  kind === "block" ||
                  item.meta?.preview?.width === "full" ||
                  item.meta?.preview?.width === "natural"
                }
                // Блок — секция с container-type:inline-size: size-container
                // не даёт содержимому задать свою ширину, и в центрированном
                // кадре без ширины он схлопывается в 0px — контент вылезает
                // узкой колонкой, container query не срабатывает. Поэтому
                // любой блок здесь рисуется во всё поле, как natural.
                // «section» — фон или курсор на весь экран, та же причина.
                natural={
                  kind === "block" ||
                  item.meta?.preview?.width === "natural" ||
                  item.meta?.preview?.width === "section"
                }
                controls={controls}
                values={values}
                previewProps={item.meta?.preview?.props}
              />
            </div>
            <div className="border-shell-border border-t p-4">
              <ItemControls
                controls={controls}
                values={values}
                onChange={setValues}
                locale={locale}
              />
              <button
                type="button"
                onClick={() => setValues(defaultValues(controls))}
                className="text-shell-muted hover:text-shell-fg mt-3 text-xs"
              >
                {t.card.reset}
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <CopyForAi
            name={item.name}
            params={params.toString()}
            label={t.card.copy}
            copiedLabel={t.card.copied}
            locale={locale}
            pro={pro}
            className="h-11 px-5"
            onCopied={noteCopied}
          />
          {copied ? (
            <p role="status" className="text-shell-fg max-w-md text-sm">
              {t.item.copyHint}
            </p>
          ) : null}
        </div>

        <CopyFlow locale={locale} link={link} className="mt-6" />
        <p className="text-shell-muted mt-3 text-xs">
          <Link
            href={`${localePath(locale, "/start")}#paste`}
            className="hover:text-shell-fg inline-flex items-center gap-1 transition-colors"
          >
            {t.item.startGuide}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </p>

        {/* Запасной путь: если агент не может открыть ссылку, инструкцию
            копируют целиком. Тело закрыто — как и сама ссылка /c. */}
        <GatedReveal
          id="ai-prompt"
          url={promptUrl}
          summary={t.item.showFull}
          note={t.item.fullNote}
          copyLabel={t.item.copyFull}
          locale={locale}
        />
      </section>
    </>
  )
}
