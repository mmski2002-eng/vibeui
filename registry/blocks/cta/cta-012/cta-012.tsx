import type { CSSProperties } from "react"

export type Cta012Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  eyebrow?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  names?: string[]
  proof?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с доверием: под кнопкой — стопка аватаров-инициалов и строка
// «5 000+ команд уже строят». Аватары рисуются из имён, без картинок:
// фотографии незнакомых людей в таком блоке всё равно никто не разглядывает,
// а инициалы честнее стоковых лиц и не требуют внешних файлов.
const STYLES = `
:where([data-vibeui-block="cta-012"]){
--vibeui-cta-012-bg:transparent;
--vibeui-cta-012-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-012-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-012-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-012-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-012-button-ink:oklch(from var(--vibeui-cta-012-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-012-avatar:color-mix(in oklab,var(--vibeui-cta-012-accent) 14%,light-dark(oklch(1 0 0),oklch(0.24 0 0)));
--vibeui-cta-012-ring:light-dark(oklch(1 0 0),oklch(0.19 0 0));
--vibeui-cta-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-012-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-012"]{color-scheme:dark}
[data-vibeui-block="cta-012"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-012-bg);color:var(--vibeui-cta-012-ink);
font-family:var(--vibeui-cta-012-font);
}
[data-vibeui-block="cta-012"] [data-part="shell"]{
max-width:44rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-012"] [data-part="eyebrow"]{
margin:0 0 0.75rem;color:var(--vibeui-cta-012-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="cta-012"] [data-part="title"]{
margin:0 auto 0.875rem;max-width:22ch;
font-size:clamp(1.625rem,5.5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="cta-012"] [data-part="description"]{
margin:0 auto 1.75rem;max-width:48ch;
color:var(--vibeui-cta-012-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-012"] [data-part="action"]{
display:inline-block;padding:0.875rem 1.75rem;border-radius:999px;
background:var(--vibeui-cta-012-button);color:var(--vibeui-cta-012-button-ink);
font-size:0.9375rem;font-weight:650;text-decoration:none;
transition:filter var(--vibeui-cta-012-dur-2) ease,transform var(--vibeui-cta-012-dur-2) ease;
}
[data-vibeui-block="cta-012"] [data-part="action"]:hover{filter:brightness(1.05);transform:translateY(-1px)}
[data-vibeui-block="cta-012"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-cta-012-accent);outline-offset:2px;
}
[data-vibeui-block="cta-012"] [data-part="trust"]{
margin-top:1.75rem;
display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:0.375rem 0.875rem;
}
[data-vibeui-block="cta-012"] [data-part="stack"]{display:flex}
[data-vibeui-block="cta-012"] [data-part="avatar"]{
position:relative;width:2.25rem;height:2.25rem;border-radius:999px;
display:grid;place-items:center;color:var(--vibeui-cta-012-accent);
box-shadow:0 0 0 2px var(--vibeui-cta-012-ring);
font-size:0.6875rem;font-weight:750;letter-spacing:0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="cta-012"] [data-part="avatar"][data-empty="true"]{background:var(--vibeui-cta-012-avatar);}
[data-vibeui-block="cta-012"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="cta-012"] [data-part="avatar"]+[data-part="avatar"]{margin-left:-0.5rem}
[data-vibeui-block="cta-012"] [data-part="proof"]{
margin:0;color:var(--vibeui-cta-012-muted);font-size:0.875rem;line-height:1.4;
}
@container (min-width: 34rem){
[data-vibeui-block="cta-012"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

const DEFAULT_NAMES = [
  "Анна Ковалёва",
  "Игорь Демидов",
  "Мария Соболева",
  "Пётр Ляхов",
  "Ольга Титова",
]

/** Центрированный призыв со стопкой аватаров и строкой социального доказательства. */
export function Cta012({
  eyebrow = "К нам уже пришли",
  avatarImage = "",
  title = "Стройте страницы вместе с теми, кто уже строит",
  description = "Команды собирают сайты из готовых секций и отдают рутину AI-агенту. Присоединяйтесь — первый макет получится сегодня.",
  actionLabel = "Присоединиться",
  actionHref = "#start",
  names = DEFAULT_NAMES,
  proof = "5 000+ команд уже строят на VibeUI",
  background = "",
  accent,
  className,
  style,
}: Cta012Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-012-accent": accent,
          "--vibeui-cta-012-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
          <div data-part="trust">
            <span data-part="stack" aria-hidden="true">
              {names.map((name) => (
                <span
                  key={name}
                  data-part="avatar"
                  data-empty={avatarImage ? undefined : "true"}
                >
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {initials(name)}
                </span>
              ))}
            </span>
            <p data-part="proof">{proof}</p>
          </div>
        </div>
      </section>
    </>
  )
}
