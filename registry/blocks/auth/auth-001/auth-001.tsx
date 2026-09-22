import type { CSSProperties, ReactNode } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button077 } from "@/registry/components/button/button-077/button-077"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Checkbox001 } from "@/registry/components/checkbox/checkbox-001/checkbox-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Auth001Props = {
  title?: string
  lead?: string
  emailLabel?: string
  passwordLabel?: string
  forgot?: string
  submit?: string
  providers?: string[]
  switchText?: string
  switchLink?: string
  /** Подпись флажка «не выходить»: компонент несёт русскую. */
  keepLabel?: string
  /** Слово в разделителе перед входом через сервисы. */
  orLabel?: string
  emailPlaceholder?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход. Поля помечены autocomplete-подсказками username и
// current-password — без них менеджеры паролей не подставляют данные, и человек
// вводит всё руками. Ссылка «забыли пароль» стоит рядом с полем пароля, а не в
// подвале: её ищут именно в момент неудачи. Вход через сервисы вынесен ниже
// формы и отделён разделителем: сверху он перехватывает внимание у тех, кто
// уже завёл пароль. Кнопка занимает всю ширину — это главное действие экрана.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-001"]){
--vibeui-auth-001-bg:transparent;
--vibeui-auth-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-001-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-001-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-001-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-auth-001-on-accent:oklch(from var(--vibeui-auth-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auth-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-001"]{color-scheme:dark}
[data-vibeui-block="auth-001"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:23rem;margin-inline:auto;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-001-bg);
border:1px solid var(--vibeui-auth-001-border);border-radius:1rem;
font-family:var(--vibeui-auth-001-sans);color:var(--vibeui-auth-001-fg);
}
[data-vibeui-block="auth-001"] *{box-sizing:border-box}
[data-vibeui-block="auth-001"] [data-part="heading"]{margin-bottom:0.25rem}
[data-vibeui-block="auth-001"] form{display:grid;gap:0.75rem}
[data-vibeui-block="auth-001"] [data-part="submit"]{width:100%}
[data-vibeui-block="auth-001"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-001-muted)}
[data-vibeui-block="auth-001"] [data-part="row"]{display:flex;justify-content:flex-end}
/* Вход через сервисы ниже формы: сверху он перехватывает внимание. */
[data-vibeui-block="auth-001"] [data-part="or"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0.625rem;
margin:0.875rem 0;font-size:0.6875rem;color:var(--vibeui-auth-001-muted);
}
[data-vibeui-block="auth-001"] [data-part="or"]::before,
[data-vibeui-block="auth-001"] [data-part="or"]::after{content:"";height:1px;background:var(--vibeui-auth-001-border)}
[data-vibeui-block="auth-001"] [data-part="providers"]{display:grid;gap:0.5rem}
[data-vibeui-block="auth-001"] [data-part="provider"]{
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
appearance:none;cursor:pointer;height:2.375rem;
border:1px solid var(--vibeui-auth-001-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="auth-001"] [data-part="provider"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="auth-001"] [data-part="provider"]:focus-visible{outline:2px solid var(--vibeui-auth-001-accent);outline-offset:2px}
[data-vibeui-block="auth-001"] [data-part="switch"]{
margin:1rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-auth-001-muted);
}
[data-vibeui-block="auth-001"] [data-part="switch"] a{color:var(--vibeui-auth-001-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-001"] *{animation:none!important;transition:none!important}}
`

// Фирменные значки провайдеров подбираются по тексту кнопки: список
// провайдеров приходит строками, а значок без подписи бесполезен. Google —
// в своих цветах (логотип не перекрашивают), GitHub и Apple — currentColor.
const PROVIDER_ICONS: Record<string, ReactNode> = {
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

function providerIcon(label: string): ReactNode {
  const key = label.toLowerCase()
  const known = ["google", "github", "apple"].find((name) => key.includes(name))
  return known ? PROVIDER_ICONS[known] : null
}

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
 * Вход: подсказки для менеджеров паролей и «забыли пароль» рядом с полем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth001({
  title = "Вход в VibeUI",
  lead = "Каталог, ключи доступа и история установок вашего проекта.",
  emailLabel = "Почта",
  passwordLabel = "Пароль",
  forgot = "Забыли пароль?",
  submit = "Войти",
  providers = ["Продолжить с Google", "Продолжить с GitHub"],
  switchText = "Нет аккаунта?",
  switchLink = "Создать",
  keepLabel = "Не выходить на этом устройстве",
  orLabel = "или",
  emailPlaceholder = "name@company.ru",
  background = "",
  accent,
  className,
  style,
}: Auth001Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-001"
        className={className}
        style={palette}
        aria-label={title}
      >
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

          <div data-part="form-field">
            <Input001
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label={passwordLabel}
              accent={accent}
            />
            <span data-part="row">
              <Button077
                data-part="forgot"
                label={forgot}
                href="#"
                accent={accent}
              />
            </span>
          </div>

          <Checkbox001 description="" name="remember" defaultChecked label={keepLabel} accent={accent} />

          <Button001 type="submit" data-part="submit" size="lg" accent={accent}>
            {submit}
          </Button001>
        </form>

        <p data-part="or">{orLabel}</p>

        <div data-part="providers">
          {providers.map((provider) => (
            <button key={provider} type="button" data-part="provider">
              {providerIcon(provider)}
              <span>{provider}</span>
            </button>
          ))}
        </div>

        <p data-part="switch">
          {switchText} <a href="#">{switchLink}</a>
        </p>
      </section>
    </>
  )
}
