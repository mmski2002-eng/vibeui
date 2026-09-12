import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup004Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр страницы. Без него окно берёт children, а без них — заглушку. */
  src?: string
  alt?: string
  /** Живое содержимое окна: любая разметка вместо картинки. */
  children?: ReactNode
  /** Адрес в строке. */
  url?: string
  /** Заголовок активной вкладки. */
  title?: string
  /** Тема хрома окна. Не зависит от темы страницы: окно — часть кадра. */
  theme?: "light" | "dark"
  /** Мягкая тень под окном. */
  shadow?: boolean
  /** Подпись под окном. */
  caption?: string
}

// Идея: окно браузера под скриншот сайта. Хром окна — светофор, вкладка с
// заголовком, кнопка новой вкладки, стрелки истории и адресная строка с
// замком — нарисован разметкой, поэтому адрес и заголовок меняются пропами,
// а не в редакторе. Тема хрома задаётся пропом и не следует за темой
// страницы: окно — часть кадра, и на тёмном сайте оно должно оставаться
// таким, каким его снял автор.
const STYLES = `
:where([data-vibeui-block="mockup-004"]){
--vibeui-mockup-004-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-004-muted:color-mix(in oklab,var(--vibeui-mockup-004-fg) 62%,transparent);
--vibeui-mockup-004-chrome:oklch(0.96 0.003 265);
--vibeui-mockup-004-chrome-deep:oklch(0.9 0.004 265);
--vibeui-mockup-004-chrome-fg:oklch(0.3 0.01 265);
--vibeui-mockup-004-chrome-muted:oklch(0.55 0.01 265);
--vibeui-mockup-004-chrome-line:oklch(0.84 0.005 265);
--vibeui-mockup-004-field:oklch(1 0 0);
--vibeui-mockup-004-screen-bg:oklch(0.98 0.002 265);
--vibeui-mockup-004-shadow:light-dark(oklch(0 0 0 / 0.28),oklch(0 0 0 / 0.6));
--vibeui-mockup-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-004"]{color-scheme:dark}
[data-vibeui-block="mockup-004"][data-chrome="dark"]{
--vibeui-mockup-004-chrome:oklch(0.26 0.006 265);
--vibeui-mockup-004-chrome-deep:oklch(0.2 0.006 265);
--vibeui-mockup-004-chrome-fg:oklch(0.92 0.005 265);
--vibeui-mockup-004-chrome-muted:oklch(0.65 0.008 265);
--vibeui-mockup-004-chrome-line:oklch(0.34 0.006 265);
--vibeui-mockup-004-field:oklch(0.32 0.006 265);
--vibeui-mockup-004-screen-bg:oklch(0.16 0.006 265);
}
[data-vibeui-block="mockup-004"]{
display:block;box-sizing:border-box;margin:0;width:100%;max-width:56rem;
container-type:inline-size;
color:var(--vibeui-mockup-004-fg);font-family:var(--vibeui-mockup-004-font);
}
[data-vibeui-block="mockup-004"] *{box-sizing:border-box}
[data-vibeui-block="mockup-004"] [data-part="window"]{
position:relative;overflow:hidden;isolation:isolate;
border-radius:clamp(0.5rem,1.4cqw,0.875rem);
background:var(--vibeui-mockup-004-screen-bg);
box-shadow:
  0 0 0 1px oklch(0 0 0 / 0.12),
  inset 0 0 0 1px oklch(1 0 0 / 0.08);
}
[data-vibeui-block="mockup-004"][data-shadow="true"] [data-part="window"]{
box-shadow:
  0 0 0 1px oklch(0 0 0 / 0.12),
  inset 0 0 0 1px oklch(1 0 0 / 0.08),
  0 2.5cqw 5cqw -2cqw var(--vibeui-mockup-004-shadow),
  0 0.6cqw 1.4cqw -0.6cqw var(--vibeui-mockup-004-shadow);
}
/* Верхняя полоса: светофор и вкладки. */
[data-vibeui-block="mockup-004"] [data-part="tabs"]{
display:flex;align-items:flex-end;gap:clamp(0.375rem,1cqw,0.75rem);
padding:clamp(0.375rem,0.9cqw,0.625rem) clamp(0.5rem,1.2cqw,0.875rem) 0;
background:var(--vibeui-mockup-004-chrome-deep);
color:var(--vibeui-mockup-004-chrome-fg);
}
[data-vibeui-block="mockup-004"] [data-part="lights"]{
display:flex;gap:clamp(0.3rem,0.7cqw,0.5rem);
padding:0 clamp(0.25rem,0.5cqw,0.375rem) clamp(0.45rem,1cqw,0.7rem);
}
[data-vibeui-block="mockup-004"] [data-part="lights"] > i{
width:clamp(0.5rem,1.1cqw,0.75rem);height:clamp(0.5rem,1.1cqw,0.75rem);border-radius:50%;
background:oklch(0.72 0.19 25);box-shadow:inset 0 0 0 1px oklch(0 0 0 / 0.12);
}
[data-vibeui-block="mockup-004"] [data-part="lights"] > i:nth-child(2){background:oklch(0.82 0.16 85)}
[data-vibeui-block="mockup-004"] [data-part="lights"] > i:nth-child(3){background:oklch(0.75 0.19 145)}
[data-vibeui-block="mockup-004"] [data-part="tab"]{
display:flex;align-items:center;gap:clamp(0.3rem,0.7cqw,0.5rem);
min-width:0;max-width:34%;
padding:clamp(0.3rem,0.7cqw,0.5rem) clamp(0.6rem,1.4cqw,1rem);
border-radius:clamp(0.375rem,0.9cqw,0.625rem) clamp(0.375rem,0.9cqw,0.625rem) 0 0;
background:var(--vibeui-mockup-004-chrome);
font-size:clamp(0.625rem,1.3cqw,0.8125rem);line-height:1.2;white-space:nowrap;
}
[data-vibeui-block="mockup-004"] [data-part="tab"] > span{overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="mockup-004"] [data-part="favicon"]{
flex:none;width:clamp(0.5rem,1.1cqw,0.75rem);height:clamp(0.5rem,1.1cqw,0.75rem);border-radius:25%;
background:linear-gradient(135deg,oklch(0.7 0.18 300),oklch(0.75 0.16 210));
}
[data-vibeui-block="mockup-004"] [data-part="plus"]{
padding-bottom:clamp(0.35rem,0.8cqw,0.55rem);
color:var(--vibeui-mockup-004-chrome-muted);
font-size:clamp(0.75rem,1.6cqw,1rem);line-height:1;
}
/* Панель адреса: стрелки истории и поле с замком. */
[data-vibeui-block="mockup-004"] [data-part="bar"]{
display:flex;align-items:center;gap:clamp(0.375rem,0.9cqw,0.625rem);
padding:clamp(0.3rem,0.7cqw,0.5rem) clamp(0.5rem,1.2cqw,0.875rem);
background:var(--vibeui-mockup-004-chrome);
border-bottom:1px solid var(--vibeui-mockup-004-chrome-line);
color:var(--vibeui-mockup-004-chrome-muted);
}
[data-vibeui-block="mockup-004"] [data-part="arrows"]{
display:flex;gap:clamp(0.25rem,0.6cqw,0.4rem);
font-size:clamp(0.75rem,1.6cqw,1rem);line-height:1;
}
[data-vibeui-block="mockup-004"] [data-part="arrows"] > i{
font-style:normal;width:1.4em;text-align:center;
}
[data-vibeui-block="mockup-004"] [data-part="arrows"] > i:nth-child(2){opacity:0.4}
[data-vibeui-block="mockup-004"] [data-part="field"]{
display:flex;align-items:center;gap:clamp(0.3rem,0.7cqw,0.5rem);
flex:1;min-width:0;
padding:clamp(0.25rem,0.55cqw,0.4rem) clamp(0.5rem,1.1cqw,0.75rem);
border-radius:999px;
background:var(--vibeui-mockup-004-field);
box-shadow:inset 0 0 0 1px var(--vibeui-mockup-004-chrome-line);
color:var(--vibeui-mockup-004-chrome-fg);
font-size:clamp(0.625rem,1.3cqw,0.8125rem);line-height:1.2;white-space:nowrap;
}
[data-vibeui-block="mockup-004"] [data-part="field"] > svg{
flex:none;width:0.9em;height:0.9em;color:var(--vibeui-mockup-004-chrome-muted);
}
[data-vibeui-block="mockup-004"] [data-part="field"] > span{overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="mockup-004"] [data-part="menu"]{
display:flex;flex-direction:column;gap:2px;padding:0 clamp(0.2rem,0.4cqw,0.3rem);
}
[data-vibeui-block="mockup-004"] [data-part="menu"] > i{
width:3px;height:3px;border-radius:50%;background:currentColor;
}
[data-vibeui-block="mockup-004"] [data-part="screen"]{
position:relative;overflow:hidden;width:100%;aspect-ratio:16/10;
}
[data-vibeui-block="mockup-004"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-004"] [data-part="content"]{position:absolute;inset:0;overflow:hidden}
/* Заглушка: каркас лендинга — шапка, заголовок, две колонки. */
[data-vibeui-block="mockup-004"] [data-part="placeholder"]{
position:absolute;inset:0;display:grid;gap:3cqw;padding:3cqw 6cqw;
align-content:start;
}
[data-vibeui-block="mockup-004"] [data-part="placeholder"] > i{
display:block;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-mockup-004-chrome-fg) 14%,transparent);
}
[data-vibeui-block="mockup-004"] [data-part="placeholder"] > i:nth-child(1){height:1.2cqw;width:22%}
[data-vibeui-block="mockup-004"] [data-part="placeholder"] > i:nth-child(2){height:4cqw;width:58%;margin-top:6cqw;border-radius:1cqw;background:color-mix(in oklab,var(--vibeui-mockup-004-chrome-fg) 55%,transparent)}
[data-vibeui-block="mockup-004"] [data-part="placeholder"] > i:nth-child(3){height:1.4cqw;width:44%}
[data-vibeui-block="mockup-004"] [data-part="placeholder"] > i:nth-child(4){height:3cqw;width:14%;margin-top:1cqw;border-radius:0.8cqw;background:linear-gradient(135deg,oklch(0.7 0.18 300),oklch(0.75 0.16 210))}
[data-vibeui-block="mockup-004"] [data-part="cards"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:3cqw;margin-top:6cqw;
}
[data-vibeui-block="mockup-004"] [data-part="cards"] > i{
display:block;aspect-ratio:4/3;border-radius:1.2cqw;
background:color-mix(in oklab,var(--vibeui-mockup-004-chrome-fg) 8%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-mockup-004-chrome-fg) 12%,transparent);
}
[data-vibeui-block="mockup-004"] figcaption{
margin-top:1.25rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-004-muted);
}
`

/**
 * Окно браузера на чистом CSS: вкладка, адресная строка, кадр или живая
 * разметка внутри, светлый или тёмный хром. Один файл, ноль зависимостей.
 */
export function Mockup004({
  src,
  alt = "",
  children,
  url = "vibeui.dev",
  title = "Главная",
  theme = "light",
  shadow = true,
  caption,
  className,
  style,
  ...props
}: Mockup004Props) {
  return (
    <>
      <style href="vibeui-mockup-004" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-004"
        data-chrome={theme}
        data-shadow={shadow ? "true" : undefined}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="window">
          <div data-part="tabs" aria-hidden="true">
            <span data-part="lights">
              <i />
              <i />
              <i />
            </span>
            <span data-part="tab">
              <i data-part="favicon" />
              <span>{title}</span>
            </span>
            <span data-part="plus">+</span>
          </div>
          <div data-part="bar" aria-hidden="true">
            <span data-part="arrows">
              <i>‹</i>
              <i>›</i>
            </span>
            <span data-part="field">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect
                  x="3"
                  y="7"
                  width="10"
                  height="7"
                  rx="1.5"
                  fill="currentColor"
                />
                <path
                  d="M5 7V5a3 3 0 0 1 6 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span>{url}</span>
            </span>
            <span data-part="menu">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div data-part="screen">
            {src ? (
              <img src={src} alt={alt} loading="lazy" decoding="async" />
            ) : children ? (
              <div data-part="content">{children}</div>
            ) : (
              <div data-part="placeholder" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <div data-part="cards">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
