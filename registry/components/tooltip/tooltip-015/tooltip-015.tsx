import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip015Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string
  caption?: string
  /** data: или обычный URL картинки-превью. */
  src?: string
  alt?: string
}

const DEFAULT_PREVIEW =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100">' +
      '<rect width="160" height="100" fill="#dbe4ff"/>' +
      '<circle cx="40" cy="66" r="26" fill="#a9bcf5"/>' +
      '<rect x="70" y="18" width="76" height="10" rx="5" fill="#7c93e6"/>' +
      '<rect x="70" y="36" width="56" height="8" rx="4" fill="#a9bcf5"/>' +
      '<path d="M0 100 L54 52 L92 82 L128 46 L160 78 L160 100 Z" fill="#c3d0f8"/>' +
      "</svg>",
  )

// Идея компонента: подсказка-миниатюра. Ссылка на файл или изображение сама
// по себе ничего не показывает, поэтому наведение и фокус раскрывают
// маленькую карточку с картинкой-превью и подписью — узнать содержимое
// можно не открывая файл.
const STYLES = `
:where([data-vibeui-block="tooltip-015"]){
--vibeui-tooltip-015-bg:oklch(1 0 0);
--vibeui-tooltip-015-fg:oklch(0.25 0.014 265);
--vibeui-tooltip-015-muted:oklch(0.55 0.014 265);
--vibeui-tooltip-015-border:oklch(0.9 0.006 265);
--vibeui-tooltip-015-link:oklch(0.5 0.16 265);
--vibeui-tooltip-015-accent:oklch(0.57 0.17 265);
--vibeui-tooltip-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-015"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-015-font);
}
[data-vibeui-block="tooltip-015"] [data-part="trigger"]{
appearance:none;cursor:pointer;border:none;background:none;padding:0;
color:var(--vibeui-tooltip-015-link);font:inherit;font-size:0.875rem;font-weight:600;
text-decoration:underline;text-underline-offset:0.1875rem;
}
[data-vibeui-block="tooltip-015"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-015-accent);outline-offset:3px;border-radius:0.1875rem}
/* Карточка-превью: картинка сверху, подпись снизу, всё в один непрозрачный блок. */
[data-vibeui-block="tooltip-015"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.625rem);left:0;z-index:20;
width:11rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-tooltip-015-border);border-radius:0.75rem;
background:var(--vibeui-tooltip-015-bg);
box-shadow:0 20px 40px -24px oklch(0.15 0.02 265 / 55%);
pointer-events:none;opacity:0;
transform:translateY(0.375rem);
transition:opacity .15s ease,transform .15s ease;
}
[data-vibeui-block="tooltip-015"] [data-part="thumb"]{
display:block;width:100%;height:6.875rem;object-fit:cover;background:oklch(0.94 0.006 265);
}
[data-vibeui-block="tooltip-015"] [data-part="caption"]{
display:block;padding:0.5rem 0.625rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-tooltip-015-muted);
}
[data-vibeui-block="tooltip-015"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-015"]:focus-within [data-part="tip"]{
opacity:1;transform:translateY(0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-015"] *{animation:none!important;transition:none!important}}
`

/**
 * Подсказка-карточка с миниатюрой изображения и подписью под ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip015({
  label = "обложка_релиза.png",
  caption = "1600×1000 · добавлено сегодня",
  src = DEFAULT_PREVIEW,
  alt = "Миниатюра превью изображения",
  className,
  style,
  ...props
}: Tooltip015Props) {
  return (
    <>
      <style href="vibeui-tooltip-015" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="tooltip-015"
        className={className}
        style={style as CSSProperties}
      >
        <button
          data-part="trigger"
          type="button"
          aria-describedby="vibeui-tooltip-015-tip"
        >
          {label}
        </button>
        <span data-part="tip" role="tooltip" id="vibeui-tooltip-015-tip">
          <img data-part="thumb" src={src} alt={alt} />
          <span data-part="caption">{caption}</span>
        </span>
      </span>
    </>
  )
}
