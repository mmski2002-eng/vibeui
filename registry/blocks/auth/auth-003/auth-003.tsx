import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button077 } from "@/registry/components/button/button-077/button-077"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Auth003Props = {
  title?: string
  lead?: string
  submit?: string
  sentTitle?: string
  sentText?: string
  resend?: string
  back?: string
  emailLabel?: string
  emailPlaceholder?: string
  /** Адрес на экране отправки: его показывают, чтобы заметить опечатку. */
  email?: string
  state?: "form" | "sent"
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: восстановление пароля с честным ответом. Текст после отправки
// намеренно не говорит, существует ли такая почта: иначе форма превращается в
// проверку чужих адресов. Отсюда же формулировка «если адрес зарегистрирован».
// Экран «письмо отправлено» показывает адрес, чтобы человек заметил опечатку,
// и даёт кнопку повторной отправки — без неё остаётся только перезагружать
// страницу. Оба состояния живут в одном блоке и переключаются пропом.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-003"]){
--vibeui-auth-003-bg:transparent;
--vibeui-auth-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-003-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-003-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-003-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-auth-003-on-accent:oklch(from var(--vibeui-auth-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auth-003-ok:light-dark(oklch(0.58 0.14 152),oklch(0.74 0.13 152));
--vibeui-auth-003-ok-soft:light-dark(oklch(0.58 0.14 152 / 14%),oklch(0.74 0.13 152 / 20%));
--vibeui-auth-003-chip:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-auth-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-003"]{color-scheme:dark}
[data-vibeui-block="auth-003"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:23rem;margin-inline:auto;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-003-bg);
border:1px solid var(--vibeui-auth-003-border);border-radius:1rem;
font-family:var(--vibeui-auth-003-sans);color:var(--vibeui-auth-003-fg);
}
[data-vibeui-block="auth-003"] *{box-sizing:border-box}
[data-vibeui-block="auth-003"] [data-part="heading"]{margin-bottom:0.25rem}
[data-vibeui-block="auth-003"] form{display:grid;gap:0.75rem}
[data-vibeui-block="auth-003"] [data-part="submit"]{width:100%}
[data-vibeui-block="auth-003"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-003-muted)}
/* Экран отправки: значок подтверждает действие, а адрес ловит опечатку. */
[data-vibeui-block="auth-003"] [data-part="badge"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;margin-bottom:0.75rem;
border-radius:9999px;background:var(--vibeui-auth-003-ok-soft);
color:var(--vibeui-auth-003-ok);font-size:1.125rem;line-height:1;
}
[data-vibeui-block="auth-003"] [data-part="mail"]{
display:inline-block;margin:0 0 0.875rem;padding:0.25rem 0.5rem;
border-radius:0.5rem;background:var(--vibeui-auth-003-chip);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="auth-003"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/**
 * Восстановление пароля: ответ не раскрывает, существует ли адрес.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth003({
  title = "Восстановление доступа",
  lead = "Введите почту — пришлём ссылку для смены пароля. Ссылка живёт час.",
  submit = "Прислать ссылку",
  sentTitle = "Проверьте почту",
  sentText = "Если адрес зарегистрирован, письмо со ссылкой уже отправлено. Ссылка действует час.",
  resend = "Отправить ещё раз",
  back = "Вернуться ко входу",
  emailLabel = "Почта",
  email = "anna@vibeui.ru",
  state = "form",
  background = "",
  accent,
  className,
  style,
}: Auth003Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-003"
        className={className}
        style={palette}
        aria-label={state === "sent" ? sentTitle : title}
      >
        {state === "sent" ? (
          <>
            <span data-part="badge" aria-hidden="true">
              ✓
            </span>
            <h2>{sentTitle}</h2>
            <p data-part="mail">{email}</p>
            <p data-part="lead">{sentText}</p>
            <div data-part="actions">
              <Button001 data-part="resend" type="button" tone="outline" accent={accent}>
                {resend}
              </Button001>
            </div>
            <Button077
              data-part="back"
              label={back}
              href="#"
              accent={accent}
            />
          </>
        ) : (
          <>
            <Heading001
              data-part="heading"
              title={title}
              size="xs"
              accent={accent}
            />
            <p data-part="lead">{lead}</p>
            <form>
              <Input001
                name="email"
                type="email"
                autoComplete="username"
                required
                label={emailLabel}
                accent={accent}
              />
              <Button001 type="submit" data-part="submit" size="lg" accent={accent}>
                {submit}
              </Button001>
            </form>
            <Button077
              data-part="back"
              label={back}
              href="#"
              accent={accent}
            />
          </>
        )}
      </section>
    </>
  )
}
