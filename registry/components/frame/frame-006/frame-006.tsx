import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame006Props = ComponentProps<"figure"> & {
  caption?: string
  index?: number
  source?: string
  align?: "start" | "center"
  /** Шаблон номера рисунка: {index} подставляется числом. */
  indexText?: string
  /** Надпись пустого медиа-слота. */
  stubText?: string
  accent?: string
  /** Пусто — подложки нет, рамка ложится на фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: рамка с подписью под содержимым. Подпись — это figcaption
// внутри figure, а не абзац рядом: только так связь картинки и текста видна
// скринридеру. Номер рисунка набран отдельным элементом и не переносится
// вместе с текстом; источник вынесен в третью строку, потому что слитая
// подпись «Рис. 2. Каталог. Скриншот» читается как одно предложение.
const STYLES = `
:where([data-vibeui-block="frame-006"]){
--vibeui-frame-006-bg:transparent;
--vibeui-frame-006-media:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.008 265));
--vibeui-frame-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-006-muted:color-mix(in oklab,var(--vibeui-frame-006-fg) 68%,transparent);
--vibeui-frame-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.011 265));
--vibeui-frame-006-accent:light-dark(oklch(0.52 0.16 262),oklch(0.74 0.15 262));
--vibeui-frame-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-006"]{color-scheme:dark}
[data-vibeui-block="frame-006"]{
display:flex;flex-direction:column;gap:0.625rem;margin:0;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-frame-006-bg);
border:1px solid var(--vibeui-frame-006-border);border-radius:1rem;
font-family:var(--vibeui-frame-006-font);color:var(--vibeui-frame-006-fg);
}
[data-vibeui-block="frame-006"] *{box-sizing:border-box}
[data-vibeui-block="frame-006"] [data-part="media"]{
overflow:hidden;aspect-ratio:16 / 10;
background:var(--vibeui-frame-006-media);
border:1px solid var(--vibeui-frame-006-border);border-radius:0.75rem;
}
[data-vibeui-block="frame-006"] [data-part="media"] > *{display:block;width:100%}
[data-vibeui-block="frame-006"] img{display:block;width:100%;height:100%;object-fit:cover}
/* Пустой кадр рисует иллюстрацию средствами CSS, а не выкладывает серое
   поле с надписью: категория обещает картинку с подписью, и картинка нужна
   уже на миниатюре каталога. Смысл кадра несёт aria-label, фигуры внутри
   декоративны. */
[data-vibeui-block="frame-006"] [data-part="media"] [data-part="stub"]{
position:relative;overflow:hidden;height:100%;
background:linear-gradient(180deg,oklch(0.72 0.13 265) 0%,oklch(0.8 0.12 40) 62%,oklch(0.86 0.1 70) 100%);
}
[data-vibeui-block="frame-006"] [data-part="sun"]{
position:absolute;left:26%;top:26%;
width:22%;aspect-ratio:1 / 1;border-radius:9999px;
background:oklch(0.95 0.11 85);
box-shadow:0 0 2.5rem oklch(0.9 0.12 75 / 0.75);
}
/* Горы — треугольники на clip-path: без картинок и без SVG-файла. */
[data-vibeui-block="frame-006"] [data-part="peak"]{
position:absolute;bottom:18%;
background:oklch(0.42 0.06 285);
clip-path:polygon(50% 0,100% 100%,0 100%);
}
[data-vibeui-block="frame-006"] [data-part="peak"][data-pos="left"]{left:-4%;width:56%;height:52%}
[data-vibeui-block="frame-006"] [data-part="peak"][data-pos="right"]{
right:-2%;width:48%;height:40%;background:oklch(0.5 0.05 290);
}
[data-vibeui-block="frame-006"] [data-part="ground"]{
position:absolute;inset:auto 0 0;height:18%;
background:oklch(0.34 0.05 285);
}
[data-vibeui-block="frame-006"] figcaption{
display:flex;flex-direction:column;gap:0.1875rem;
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="frame-006"][data-align="center"] figcaption{align-items:center;text-align:center}
/* Номер отдельным элементом: он не должен переноситься вместе с подписью. */
[data-vibeui-block="frame-006"] [data-part="index"]{
color:var(--vibeui-frame-006-accent);font-weight:700;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="frame-006"] [data-part="text"]{margin:0}
[data-vibeui-block="frame-006"] [data-part="source"]{
font-size:0.6875rem;color:var(--vibeui-frame-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Рамка с нумерованной подписью и строкой источника под содержимым.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame006({
  caption = "Каталог компонентов: карточка раскрывает превью по наведению",
  index = 2,
  source = "Источник: скриншот VibeUI, август 2026",
  align = "start",
  indexText = "Рис. {index}",
  stubText = "Место под скриншот",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame006Props) {
  const palette = {
    ...(accent ? { "--vibeui-frame-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-006" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-006"
        data-align={align}
        className={className}
        style={palette}
      >
        <div data-part="media">
          {children ?? (
            <div data-part="stub" role="img" aria-label={stubText}>
              <span data-part="sun" />
              <span data-part="peak" data-pos="right" />
              <span data-part="peak" data-pos="left" />
              <span data-part="ground" />
            </div>
          )}
        </div>
        <figcaption>
          <span data-part="index">
            {indexText.replace("{index}", String(index))}
          </span>
          <p data-part="text">{caption}</p>
          {source ? <span data-part="source">{source}</span> : null}
        </figcaption>
      </figure>
    </>
  )
}
