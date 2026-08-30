import type { CSSProperties } from "react"

export type Dialog010Shortcut = {
  keys: string[]
  action: string
}

export type Dialog010Group = {
  title: string
  shortcuts: Dialog010Shortcut[]
}

export type Dialog010Props = {
  id?: string
  trigger?: string
  title?: string
  groups?: Dialog010Group[]
  closeLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: справка по горячим клавишам. Клавиши набраны <kbd> и
// выглядят клавишами: тень снизу и светлая грань сверху делают из символа
// объект, который ищут глазами, а не читают. Список разбит на группы, потому
// что плоские тридцать строк не запоминаются.
const STYLES = `
:where([data-vibeui-block="dialog-010"]){
--vibeui-dialog-010-fg:oklch(0.22 0.016 265);
--vibeui-dialog-010-muted:oklch(0.5 0.014 265);
--vibeui-dialog-010-bg:oklch(1 0 0);
--vibeui-dialog-010-key:oklch(0.98 0.003 265);
--vibeui-dialog-010-border:oklch(0.88 0.006 265);
--vibeui-dialog-010-accent:oklch(0.55 0.2 262);
--vibeui-dialog-010-radius:1rem;
--vibeui-dialog-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dialog-010"]{display:inline-flex;font-family:var(--vibeui-dialog-010-font)}
[data-vibeui-block="dialog-010"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;gap:0.5rem;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-010-border);border-radius:0.5rem;
background:var(--vibeui-dialog-010-bg);color:var(--vibeui-dialog-010-fg);
}
[data-vibeui-block="dialog-010"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-010-border) 30%,transparent)}
[data-vibeui-block="dialog-010"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-010-accent);outline-offset:2px}
[data-vibeui-dialog-010-window]{
position:fixed;inset:0;margin:auto;height:fit-content;max-height:min(32rem,calc(100vh - 3rem));
width:min(30rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;overflow-y:auto;
border:1px solid var(--vibeui-dialog-010-border,oklch(0.88 0.006 265));
border-radius:var(--vibeui-dialog-010-radius,1rem);
background:var(--vibeui-dialog-010-bg,oklch(1 0 0));
color:var(--vibeui-dialog-010-fg,oklch(0.22 0.016 265));
font-family:var(--vibeui-dialog-010-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-010-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-010-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-010-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
[data-vibeui-dialog-010-window] [data-part="title"]{margin:0 0 1rem;font-size:1rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-010-window] [data-part="group"] + [data-part="group"]{margin-top:1.125rem}
[data-vibeui-dialog-010-window] [data-part="group-title"]{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dialog-010-muted,oklch(0.5 0.014 265));
}
[data-vibeui-dialog-010-window] dl{margin:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-dialog-010-window] [data-part="row"]{display:flex;align-items:center;gap:1rem;font-size:0.875rem}
[data-vibeui-dialog-010-window] dt{flex:1 1 auto;min-width:0}
[data-vibeui-dialog-010-window] dd{margin:0;flex:none;display:flex;gap:0.25rem}
/* Клавиша выглядит клавишей: светлая грань сверху и тень снизу. */
[data-vibeui-dialog-010-window] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.5rem;height:1.5rem;padding:0 0.375rem;
border:1px solid var(--vibeui-dialog-010-border,oklch(0.88 0.006 265));
border-bottom-width:2px;border-radius:0.375rem;
background:var(--vibeui-dialog-010-key,oklch(0.98 0.003 265));
font-family:inherit;font-size:0.75rem;font-weight:600;line-height:1;
}
[data-vibeui-dialog-010-window] [data-part="actions"]{display:flex;justify-content:flex-end;margin-top:1.25rem}
[data-vibeui-dialog-010-window] [data-part="close"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dialog-010-border,oklch(0.88 0.006 265));
}
[data-vibeui-dialog-010-window] :focus-visible{outline:2px solid var(--vibeui-dialog-010-accent,oklch(0.55 0.2 262));outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-010"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-010-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_GROUPS: Dialog010Group[] = [
  {
    title: "Проект",
    shortcuts: [
      { keys: ["Ctrl", "S"], action: "Сохранить черновик" },
      { keys: ["Ctrl", "Enter"], action: "Опубликовать" },
      { keys: ["Ctrl", "Z"], action: "Отменить последнее действие" },
    ],
  },
  {
    title: "Навигация",
    shortcuts: [
      { keys: ["G", "P"], action: "К списку страниц" },
      { keys: ["G", "D"], action: "К настройкам домена" },
      { keys: ["/"], action: "Поиск по проекту" },
    ],
  },
  {
    title: "Редактор",
    shortcuts: [
      { keys: ["Esc"], action: "Снять выделение блока" },
      { keys: ["Alt", "↑"], action: "Поднять блок выше" },
      { keys: ["Alt", "↓"], action: "Опустить блок ниже" },
    ],
  },
]

/**
 * Окно горячих клавиш: группы и клавиши, набранные <kbd>.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog010({
  id = "vibeui-dialog-010",
  trigger = "Горячие клавиши",
  title = "Горячие клавиши",
  groups = DEFAULT_GROUPS,
  closeLabel = "Закрыть",
  className,
  style,
}: Dialog010Props) {
  return (
    <>
      <style href="vibeui-dialog-010" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="dialog-010" className={className} style={style}>
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
          <kbd>?</kbd>
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-010-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={style}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {groups.map((group) => (
            <section key={group.title} data-part="group">
              <p data-part="group-title">{group.title}</p>
              <dl>
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.action} data-part="row">
                    <dt>{shortcut.action}</dt>
                    <dd>
                      {shortcut.keys.map((key) => (
                        <kbd key={key}>{key}</kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <div data-part="actions">
            <button data-part="close" type="button" popoverTarget={id}>
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
