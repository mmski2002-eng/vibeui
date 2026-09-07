import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Button048Provider = "google" | "github" | "apple"

export type Button048Props = Omit<ComponentProps<"button">, "children"> & {
  /** Провайдер входа: от него зависят подпись и знак слева. */
  provider?: Button048Provider
  label?: string
  /** Подписи провайдеров: компонент несёт русские, проект подставляет свои. */
  providerText?: Record<string, string>
  /** Поверхность кнопки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: кнопка входа через провайдера. Знак прибит к левому краю,
// а подпись центрируется по всей кнопке — так ряд кнопок разных провайдеров
// выстраивается в колонку с общей осью текста. Знаки здесь условные, из CSS:
// настоящие логотипы приносит проект, у них свои правила использования.
const STYLES = `
:where([data-vibeui-block="button-048"]){
--vibeui-button-048-surface:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-button-048-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-button-048-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-048-ring:light-dark(oklch(0.55 0 265 / 65%),oklch(0.78 0 265 / 70%));
--vibeui-button-048-hover:light-dark(oklch(0.97 0 265),oklch(0.3 0 265));
--vibeui-button-048-hover-border:light-dark(oklch(0.8 0 265),oklch(0.52 0 265));
--vibeui-button-048-mark:light-dark(oklch(0.24 0 265),oklch(0.9 0 265));
--vibeui-button-048-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-048"]{color-scheme:dark}
[data-vibeui-block="button-048"]{
position:relative;appearance:none;cursor:pointer;box-sizing:border-box;
display:flex;align-items:center;justify-content:center;
width:100%;max-width:20rem;height:2.75rem;padding:0 3rem;
border:1px solid var(--vibeui-button-048-border);border-radius:0.625rem;
background:var(--vibeui-button-048-surface);color:var(--vibeui-button-048-fg);
font-family:var(--vibeui-button-048-font);font-size:0.875rem;font-weight:600;line-height:1;
box-shadow:0 1px 2px oklch(0 0 0 / 6%);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-048"]:hover:not(:disabled){
background:var(--vibeui-button-048-hover);border-color:var(--vibeui-button-048-hover-border);
}
[data-vibeui-block="button-048"]:focus-visible{outline:2px solid var(--vibeui-button-048-ring);outline-offset:2px}
[data-vibeui-block="button-048"]:disabled{cursor:not-allowed;opacity:.55}
/* Знак прижат к краю, подпись центрируется по всей ширине кнопки. */
/* Знак провайдера — настоящий логотип, а не абстрактная фигура: кнопка
   входа узнаётся именно по нему. Google остаётся в своих цветах, у
   остальных знак берёт цвет текста. */
[data-vibeui-block="button-048"] [data-part="mark"]{
position:absolute;left:0.9375rem;top:50%;margin-top:-0.5625rem;
width:1.125rem;height:1.125rem;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-048"]{transition:none!important}}
`

// Знаки провайдеров: Google в фирменных цветах (его логотип не
// перекрашивают), остальные — currentColor, чтобы работать на любой подложке.
const MARKS: Record<Button048Provider, ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
}

const LABELS: Record<string, string> = {
  google: "Продолжить с Google",
  github: "Продолжить с GitHub",
  apple: "Продолжить с Apple",
}

/**
 * Ветка темы для заданной поверхности. Без неё светлая заливка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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

/**
 * Кнопка входа через провайдера: знак у края, подпись по центру.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button048({
  provider = "google",
  label,
  providerText = LABELS,
  background = "",
  type = "button",
  className,
  style,
  ...props
}: Button048Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-button-048-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-048" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-048"
        data-provider={provider}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true">
          {MARKS[provider]}
        </span>
        {label ?? providerText[provider] ?? LABELS[provider]}
      </button>
    </>
  )
}
