import { ArrowRight } from "lucide-react"

import { getDictionary, type Locale } from "@/lib/i18n"

/**
 * Цепочка целиком в трёх кадрах: выбрал — вставил — получил.
 *
 * Обещания про реестр и зависимости человеку ничего не говорят, пока он не
 * увидел, что именно происходит после нажатия кнопки. Кадры нарисованы
 * разметкой, а не картинками: они переживают смену темы и не тянут
 * ни килобайта в первый экран.
 */
export function CopyFlow({
  locale,
  link,
  className,
}: {
  locale: Locale
  /** Ссылка, которую человек и правда скопирует: в примере она настоящая. */
  link: string | null
  className?: string
}) {
  const t = getDictionary(locale)
  const [pick, paste, result] = t.item.flowSteps

  return (
    <section
      aria-label={t.item.flow}
      className={
        "grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch " +
        (className ?? "")
      }
    >
      <Frame step={1} caption={pick}>
        <div className="border-shell-border bg-shell overflow-hidden rounded-md border">
          <div className="bg-preview-surface flex h-14 flex-col justify-center gap-1.5 px-3">
            <span className="bg-shell-fg/45 block h-1.5 w-2/3 rounded-full" />
            <span className="bg-shell-fg/20 block h-1 w-1/2 rounded-full" />
            <span className="bg-shell-accent/70 mt-0.5 block h-2 w-10 rounded-sm" />
          </div>
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <span className="bg-shell-fg/20 block h-1 w-10 rounded-full" />
            <span className="bg-shell-accent text-shell-accent-fg rounded px-1.5 py-0.5 text-[9px] leading-none font-semibold">
              AI
            </span>
          </div>
        </div>
      </Frame>

      <Arrow />

      <Frame step={2} caption={paste}>
        <div className="border-shell-border bg-shell space-y-1.5 rounded-md border p-2">
          <p className="text-shell-muted text-[10px] leading-snug">
            {t.item.flowChat}
          </p>
          <p className="bg-shell-elevated border-shell-border text-shell-fg truncate rounded border px-1.5 py-1 font-mono text-[10px]">
            {link ?? "vibeui.ru"}
          </p>
          <div className="flex justify-end">
            <span className="bg-shell-accent block h-3 w-8 rounded-sm" />
          </div>
        </div>
      </Frame>

      <Arrow />

      <Frame step={3} caption={result}>
        <div className="border-shell-border bg-shell overflow-hidden rounded-md border">
          <div className="border-shell-border flex items-center gap-1 border-b px-2 py-1">
            <span className="bg-shell-fg/25 block size-1 rounded-full" />
            <span className="bg-shell-fg/25 block size-1 rounded-full" />
            <span className="bg-shell-fg/25 block size-1 rounded-full" />
          </div>
          <div className="from-shell-accent/25 flex h-14 flex-col justify-center gap-1.5 bg-gradient-to-br to-transparent px-3">
            <span className="bg-shell-fg/45 block h-1.5 w-3/4 rounded-full" />
            <span className="bg-shell-fg/20 block h-1 w-1/2 rounded-full" />
            <span className="bg-shell-accent mt-0.5 block h-2 w-10 rounded-sm" />
          </div>
          <div className="grid grid-cols-3 gap-1 p-2">
            <span className="bg-shell-fg/10 block h-3 rounded-sm" />
            <span className="bg-shell-fg/10 block h-3 rounded-sm" />
            <span className="bg-shell-fg/10 block h-3 rounded-sm" />
          </div>
        </div>
      </Frame>
    </section>
  )
}

function Frame({
  step,
  caption,
  children,
}: {
  step: number
  caption: string
  children: React.ReactNode
}) {
  return (
    <figure className="border-shell-border bg-shell-panel flex min-w-0 flex-col rounded-lg border p-2.5">
      {children}
      <figcaption className="text-shell-muted mt-auto flex items-center gap-1.5 pt-2 text-xs">
        <span className="border-shell-border text-shell-fg flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] tabular-nums">
          {step}
        </span>
        {caption}
      </figcaption>
    </figure>
  )
}

/* Стрелка между кадрами: на телефоне кадры стоят колонкой, и горизонтальная
   стрелка там читается как обрыв — поэтому её видно только в ряду. */
function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="text-shell-muted hidden size-4 shrink-0 self-center sm:block"
    />
  )
}
