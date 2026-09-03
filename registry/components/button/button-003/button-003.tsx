import type { ComponentProps, CSSProperties } from "react"

export type Button003Props = ComponentProps<"button"> & {
  accent?: string
  accentForeground?: string
}

// Идея компонента: крупная CTA, которая «притягивает» курсор — на наведении
// она приподнимается, свечение под ней разрастается, а по поверхности
// проходит блик. Эффект целиком на CSS: ни JS, ни отслеживания курсора,
// поэтому компонент остаётся серверным и ничего не тянет в бандл.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте обе точки градиента светлее, иначе кнопка вязнет в фоне.
// Подпись остаётся светлой в обеих ветках — она лежит на насыщенной заливке,
// а не на фоне страницы.
const STYLES = `
:where([data-vibeui-block="button-003"]){
--vibeui-button-003-accent:light-dark(oklch(0.68 0.19 32),oklch(0.73 0.175 32));
--vibeui-button-003-accent-2:light-dark(oklch(0.6 0.21 12),oklch(0.66 0.19 12));
--vibeui-button-003-fg:oklch(0.99 0.004 32);
--vibeui-button-003-glow:color-mix(in oklab, var(--vibeui-button-003-accent) 55%, transparent);
--vibeui-button-003-ring:color-mix(in oklab, var(--vibeui-button-003-accent) 75%, transparent);
--vibeui-button-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-003"]{color-scheme:dark}
[data-vibeui-block="button-003"]{
position:relative;isolation:isolate;overflow:hidden;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5em;
height:3.25rem;padding:0 2rem;border:0;border-radius:9999px;
font-family:var(--vibeui-button-003-font);font-size:1rem;font-weight:600;line-height:1;
letter-spacing:-0.01em;color:var(--vibeui-button-003-fg);
background:linear-gradient(135deg,var(--vibeui-button-003-accent),var(--vibeui-button-003-accent-2));
box-shadow:0 6px 18px -8px var(--vibeui-button-003-glow);
transition:transform .28s cubic-bezier(0.16,1,0.3,1),box-shadow .28s cubic-bezier(0.16,1,0.3,1);
}
[data-vibeui-block="button-003"]::after{
content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;
background:linear-gradient(100deg,transparent 35%,oklch(1 0 0 / 34%) 50%,transparent 65%);
transform:translateX(-120%);transition:transform .65s cubic-bezier(0.16,1,0.3,1);
}
[data-vibeui-block="button-003"]:hover:not(:disabled){transform:translateY(-2px) scale(1.02);box-shadow:0 16px 38px -12px var(--vibeui-button-003-glow)}
[data-vibeui-block="button-003"]:hover:not(:disabled)::after{transform:translateX(120%)}
[data-vibeui-block="button-003"]:active:not(:disabled){transform:translateY(0) scale(0.99)}
[data-vibeui-block="button-003"]:focus-visible{outline:2px solid var(--vibeui-button-003-ring);outline-offset:3px}
[data-vibeui-block="button-003"]:disabled{cursor:not-allowed;opacity:.55;box-shadow:none}
[data-vibeui-block="button-003"] svg{width:1em;height:1em;transition:transform .28s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-003"]:hover:not(:disabled) svg{transform:translateX(3px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-003"],[data-vibeui-block="button-003"]::after,[data-vibeui-block="button-003"] svg{animation:none!important;transition:none!important;transform:none!important}}
`

/**
 * Крупная CTA с эффектом притяжения: подъём, разрастающееся свечение и блик
 * по поверхности. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button003({
  accent,
  accentForeground,
  type = "button",
  className,
  style,
  children = "Начать бесплатно",
  ...props
}: Button003Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-003-accent": accent } : null),
    ...(accentForeground
      ? { "--vibeui-button-003-fg": accentForeground }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-003" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-003"
        className={className}
        style={palette}
      >
        {children}
        <svg viewBox="0 0 14 12" fill="none" aria-hidden="true">
          <path
            d="M1 6h11M8 2l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  )
}
