import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button002Props = ComponentPropsWithoutRef<"button"> & {
  /** Подпись и обработчик второй зоны. Первая зона — обычные пропсы button. */
  menuLabel?: string
  onMenuClick?: () => void
  accent?: string
  accentForeground?: string
  /** Класс попадает на группу, а не на основную кнопку: зон две. */
  className?: string
}

// Идея компонента: одно управляющее пятно, разделённое волосяной линией на
// две зоны — основное действие и его варианты. Вторая зона уже первой и чуть
// притоплена, поэтому читается как приставка, а не как вторая кнопка.
const STYLES = `
:where([data-vibeui-block="button-002"]){
--vibeui-button-002-accent:oklch(0.58 0.16 258);
--vibeui-button-002-accent-fg:oklch(0.99 0.004 258);
--vibeui-button-002-divider:oklch(1 0 0 / 28%);
--vibeui-button-002-ring:color-mix(in oklab, var(--vibeui-button-002-accent) 70%, transparent);
--vibeui-button-002-radius:0.625rem;
--vibeui-button-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-002"]{
display:inline-flex;align-items:stretch;isolation:isolate;
border-radius:var(--vibeui-button-002-radius);overflow:hidden;
font-family:var(--vibeui-button-002-font);
}
[data-vibeui-block="button-002"] [data-part]{
appearance:none;border:0;cursor:pointer;background:var(--vibeui-button-002-accent);
color:var(--vibeui-button-002-accent-fg);font:inherit;font-weight:500;font-size:0.875rem;
line-height:1;height:2.5rem;display:inline-flex;align-items:center;justify-content:center;
transition:background-color .18s ease,opacity .18s ease;
}
[data-vibeui-block="button-002"] [data-part="action"]{padding:0 1.125rem}
[data-vibeui-block="button-002"] [data-part="more"]{
padding:0 0.625rem;box-shadow:inset 1px 0 0 var(--vibeui-button-002-divider);
background:color-mix(in oklab, var(--vibeui-button-002-accent) 88%, black);
}
[data-vibeui-block="button-002"] [data-part]:hover:not(:disabled){background:color-mix(in oklab, var(--vibeui-button-002-accent) 80%, black)}
[data-vibeui-block="button-002"] [data-part]:focus-visible{outline:2px solid var(--vibeui-button-002-ring);outline-offset:2px;z-index:1}
[data-vibeui-block="button-002"] [data-part]:disabled{cursor:not-allowed;opacity:.55}
[data-vibeui-block="button-002"] svg{width:0.75rem;height:0.75rem;display:block;transition:transform .18s ease}
[data-vibeui-block="button-002"] [data-part="more"]:hover:not(:disabled) svg{transform:translateY(1px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка с приставкой вариантов: основное действие слева, вызов списка
 * альтернатив справа. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button002({
  menuLabel = "Другие варианты",
  onMenuClick,
  accent,
  accentForeground,
  type = "button",
  disabled,
  className,
  style,
  children = "Опубликовать",
  ...props
}: Button002Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-002-accent": accent } : null),
    ...(accentForeground
      ? { "--vibeui-button-002-accent-fg": accentForeground }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="button-002"
        role="group"
        className={className}
        style={palette}
      >
        <button {...props} type={type} data-part="action" disabled={disabled}>
          {children}
        </button>
        <button
          type="button"
          data-part="more"
          aria-label={menuLabel}
          onClick={onMenuClick}
          disabled={disabled}
        >
          <svg viewBox="0 0 12 8" fill="none" aria-hidden="true">
            <path
              d="M1 1.5 6 6.5l5-5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  )
}
