import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

type Hero001Action = {
  label: string
  href: string
}

export type Hero001Props = {
  badge?: string
  title?: string
  titleAccent?: string
  description?: string
  primaryAction?: Hero001Action
  secondaryAction?: Hero001Action
  highlights?: string[]
  accent?: string
  accentForeground?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
}

// Блок везде выглядит одинаково, поэтому палитра, шрифт и keyframes живут здесь,
// а не в globals.css проекта. Селектор в :where() — нулевая специфичность,
// так что любой класс или inline style пользователя переопределяет значение.
//
// container-type делает блок собственным query-контейнером: раскладка и размер
// шрифта считаются от ширины блока, а не от ширины окна. Поэтому блок выглядит
// одинаково и на странице, и в масштабированной миниатюре каталога, где он
// рендерится в 1280px внутри узкого окна. Правила раскладки живут здесь, а не
// в Tailwind-вариантах, чтобы блок не зависел от версии Tailwind в чужом
// проекте; специфичность (0,2,0) — выше утилит, поэтому они переопределяются.
const STYLES = `
:where([data-vibeui-block="hero-001"]){
--vibeui-hero-bg:transparent;
--vibeui-hero-fg:light-dark(oklch(0.19 0 266),oklch(0.98 0 266));
--vibeui-hero-muted:light-dark(oklch(0.5 0 266),oklch(0.75 0 266));
--vibeui-hero-border:light-dark(oklch(0.16 0 266 / 14%),oklch(1 0 0 / 18%));
--vibeui-hero-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-accent-fg:oklch(from var(--vibeui-hero-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-ring:color-mix(in oklab, var(--vibeui-hero-accent) 75%, transparent);
--vibeui-hero-glow:color-mix(in oklab, var(--vibeui-hero-accent) 38%, transparent);
--vibeui-hero-grid:light-dark(oklch(0.16 0 266 / 7%),oklch(1 0 0 / 6%));
--vibeui-hero-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-001"]{color-scheme:dark}
:where([data-vibeui-block="hero-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
container-type:inline-size;
}
@container (min-width:40rem){
[data-vibeui-block="hero-001"] [data-part="frame"]{padding-left:2.5rem;padding-right:2.5rem}
[data-vibeui-block="hero-001"] [data-part="actions"]{width:auto;flex-direction:row}
}
@container (min-width:48rem){
[data-vibeui-block="hero-001"] [data-part="frame"]{min-height:680px;padding-top:8rem;padding-bottom:8rem}
}
@keyframes vibeui-hero-001-fade-up{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-001-glow{0%,100%{opacity:.68}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-001"] *{animation:none!important;transition:none!important}}
`

const ENTER =
  "animate-[vibeui-hero-001-fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

export function Hero001({
  badge = "Уже в открытой бете",
  title = "Запускайте продукт",
  titleAccent = "вдвое быстрее",
  description = "Всё, что нужно команде, чтобы проектировать, собирать и выпускать, — в одном пространстве, которое не мешает работать.",
  primaryAction = { label: "Начать сборку", href: "#" },
  secondaryAction = { label: "Записаться на демо", href: "#" },
  highlights = ["Без карты", "14 дней бесплатно", "Соответствие SOC 2"],
  accent,
  accentForeground,
  background = "",
  tone = "auto",
  className,
}: Hero001Props) {
  const style = {
    ...(accent ? { "--vibeui-hero-accent": accent } : {}),
    ...(accentForeground
      ? { "--vibeui-hero-accent-fg": accentForeground }
      : {}),
    ...(background
      ? {
          "--vibeui-hero-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : {}),
  } as CSSProperties

  return (
    <section
      data-vibeui-block="hero-001"
      data-tone={tone === "auto" ? undefined : tone}
      style={style}
      className={cx(
        "relative isolate overflow-hidden bg-[var(--vibeui-hero-bg)] font-[family-name:var(--vibeui-hero-font)] text-[var(--vibeui-hero-fg)] antialiased",
        className,
      )}
    >
      <style href="vibeui-hero-001" precedence="medium">
        {STYLES}
      </style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-[35%] h-[85%] animate-[vibeui-hero-001-glow_12s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 55%, var(--vibeui-hero-glow), transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--vibeui-hero-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--vibeui-hero-grid) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(60% 55% at 50% 45%, black, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(60% 55% at 50% 45%, black, transparent 100%)",
        }}
      />

      {/* Отступы и высота живут на внутреннем слое: container-запросы читают
          ширину секции, а сама секция своим контейнером быть не может. */}
      <div
        data-part="frame"
        className="relative flex min-h-[560px] items-center px-6 py-24"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {badge ? (
            <span
              className={cx(
                ENTER,
                "inline-flex items-center gap-2 rounded-full border border-[var(--vibeui-hero-border)] px-3.5 py-1.5 text-xs font-medium tracking-wide text-[var(--vibeui-hero-muted)]",
              )}
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[var(--vibeui-hero-accent)]"
              />
              {badge}
            </span>
          ) : null}

          <Heading001
            data-part="heading"
            className="mt-7"
            title={title}
            titleAccent={titleAccent}
            lede={description}
            level="h1"
            size="xl"
            align="center"
            accent={accent}
          />

          <div
            data-part="actions"
            className={cx(
              ENTER,
              "mt-10 flex w-full max-w-full flex-col gap-3 [animation-delay:180ms]",
            )}
          >
            {primaryAction ? (
              <Button016 label={primaryAction.label} href={primaryAction.href} external={false} size="lg" tone="accent" accent={accent} />
            ) : null}

            {secondaryAction ? (
              <Button016 label={secondaryAction.label} href={secondaryAction.href} external={false} size="lg" tone="neutral" arrow accent={accent} />
            ) : null}
          </div>

          {highlights.length > 0 ? (
            <ul
              className={cx(
                ENTER,
                "mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-[var(--vibeui-hero-muted)] [animation-delay:240ms]",
              )}
            >
              {highlights.map((highlight, index) => (
                <li key={highlight} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="size-1 rounded-full bg-[var(--vibeui-hero-border)]"
                    />
                  ) : null}
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
