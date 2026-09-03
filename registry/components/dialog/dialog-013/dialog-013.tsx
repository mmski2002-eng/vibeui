import type { CSSProperties } from "react"

export type Dialog013Props = {
  id?: string
  /**
   * Показать окно раскрытым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  title?: string
  description?: string
  /** Подписи оценок слева направо: от худшей к лучшей. */
  scale?: string[]
  /** Подпись ряда оценок для скринридера. */
  scaleLabel?: string
  fieldLabel?: string
  placeholder?: string
  submitLabel?: string
  skipLabel?: string
  accent?: string
  /** Подложка окна и кнопки. Пусто — собственная подложка по теме. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно отзыва. Оценка — ряд нативных radio с подписями, а не
// звёзды: словами человек отвечает точнее, чем количеством звёзд, и разработчик
// потом понимает, что означала «тройка». Поле для текста необязательное и
// стоит после оценки: спросить сначала одно нажатие, потом слова.
const STYLES = `
:where([data-vibeui-block="dialog-013"]){
--vibeui-dialog-013-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-013-muted:color-mix(in oklab,var(--vibeui-dialog-013-fg) 68%,transparent);
--vibeui-dialog-013-bg:light-dark(oklch(1 0 0),oklch(0.23 0.012 265));
--vibeui-dialog-013-field:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-dialog-013-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 262));
--vibeui-dialog-013-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-dialog-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-013-radius:1rem;
--vibeui-dialog-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-013"]{color-scheme:dark}
[data-vibeui-block="dialog-013"]{display:inline-flex;font-family:var(--vibeui-dialog-013-font)}
[data-vibeui-block="dialog-013"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-013-border);border-radius:0.5rem;
background:var(--vibeui-dialog-013-bg);color:var(--vibeui-dialog-013-fg);
}
[data-vibeui-block="dialog-013"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-013-border) 30%,transparent)}
[data-vibeui-block="dialog-013"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-013-accent);outline-offset:2px}
[data-vibeui-dialog-013-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(27rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-013-border,light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265)));
border-radius:var(--vibeui-dialog-013-radius,1rem);
background:var(--vibeui-dialog-013-bg,light-dark(oklch(1 0 0),oklch(0.23 0.012 265)));
color:var(--vibeui-dialog-013-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-013-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-013-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-013-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-013-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
[data-vibeui-dialog-013-window] [data-part="title"]{margin:0 0 0.25rem;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-013-window] [data-part="description"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-dialog-013-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-013-window] [data-part="scale"]{display:flex;gap:0.375rem}
/* Оценка словами, а не звёздами: «тройка» ничего не значит без подписи. */
[data-vibeui-dialog-013-window] [data-part="grade"]{
flex:1 1 0;display:flex;align-items:center;justify-content:center;
padding:0.5rem 0.25rem;cursor:pointer;text-align:center;
border:1px solid var(--vibeui-dialog-013-border,light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265)));
border-radius:0.625rem;font-size:0.75rem;line-height:1.3;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-dialog-013-window] [data-part="grade"]:has(input:checked){
border-color:var(--vibeui-dialog-013-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
background:color-mix(in oklab,var(--vibeui-dialog-013-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262))) 10%,transparent);
font-weight:600;
}
[data-vibeui-dialog-013-window] [data-part="grade"] input{position:absolute;opacity:0;width:0;height:0}
[data-vibeui-dialog-013-window] [data-part="field"]{display:flex;flex-direction:column;gap:0.375rem;margin-top:1rem;font-size:0.8125rem;font-weight:500}
[data-vibeui-dialog-013-window] textarea{
width:100%;box-sizing:border-box;margin:0;min-height:5rem;padding:0.625rem 0.75rem;resize:vertical;
border:1px solid var(--vibeui-dialog-013-border,light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265)));
border-radius:0.625rem;background:var(--vibeui-dialog-013-field,light-dark(oklch(1 0 0),oklch(0.2 0.012 265)));color:inherit;
font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-dialog-013-window] textarea:focus{
outline:none;border-color:var(--vibeui-dialog-013-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-dialog-013-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262))) 20%,transparent);
}
[data-vibeui-dialog-013-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.125rem}
[data-vibeui-dialog-013-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
}
[data-vibeui-dialog-013-window] [data-part="skip"]{background:transparent;color:var(--vibeui-dialog-013-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)));border-color:var(--vibeui-dialog-013-border,light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265)))}
[data-vibeui-dialog-013-window] [data-part="submit"]{background:var(--vibeui-dialog-013-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));color:var(--vibeui-dialog-013-on-accent,light-dark(oklch(1 0 0),oklch(0.18 0.03 262)))}
[data-vibeui-dialog-013-window] [data-part="submit"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-013-window] :focus-visible{outline:2px solid var(--vibeui-dialog-013-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-013-window]:popover-open){overflow:hidden}
/* Развёрнутый режим: окно стоит в потоке вместо кнопки, а не в верхнем слое.
   Без него на карточке каталога от компонента видна одна кнопка. */
[data-vibeui-block="dialog-013"]:has([data-open="true"]){display:block;width:100%}
[data-vibeui-block="dialog-013"]:has([data-open="true"]) [data-part="trigger"]{display:none}
[data-vibeui-dialog-013-window][data-open="true"]{
position:static;inset:auto;margin:0;width:100%;max-width:27rem;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-013"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-013-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_SCALE = ["Мешало", "Терпимо", "Нормально", "Удобно", "Отлично"]

/**
 * Ветка темы для заданной подложки. Без неё светлая подложка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Окно отзыва: оценка словами и необязательный комментарий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog013({
  id = "vibeui-dialog-013",
  open = false,
  trigger = "Оставить отзыв",
  title = "Как прошла сборка страницы?",
  description = "Ответ анонимный и занимает пару секунд. Он попадает прямо к тем, кто делает редактор.",
  scale = DEFAULT_SCALE,
  scaleLabel = "Оценка",
  fieldLabel = "Что можно улучшить? Необязательно",
  placeholder = "Например: блок тарифов сложно двигать на телефоне",
  submitLabel = "Отправить",
  skipLabel = "Не сейчас",
  accent,
  background = "",
  className,
  style,
}: Dialog013Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-013" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-013"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dialog-013-window=""
          data-open={open || undefined}
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          style={palette}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {description ? (
            <p data-part="description" id={`${id}-description`}>
              {description}
            </p>
          ) : null}
          <form method="dialog">
            <div data-part="scale" role="group" aria-label={scaleLabel}>
              {scale.map((grade, index) => (
                <label key={grade} data-part="grade">
                  <input
                    type="radio"
                    name={`${id}-grade`}
                    value={index + 1}
                    defaultChecked={index === scale.length - 2}
                  />
                  {grade}
                </label>
              ))}
            </div>
            <label data-part="field">
              {fieldLabel}
              <textarea name="comment" placeholder={placeholder} />
            </label>
            <div data-part="actions">
              <button
                data-part="skip"
                type="button"
                popoverTarget={id}
                autoFocus
              >
                {skipLabel}
              </button>
              <button data-part="submit" type="submit" popoverTarget={id}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
