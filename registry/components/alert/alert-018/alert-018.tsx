"use client"

import { useSyncExternalStore } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
  /** Показать полосу принудительно: витрина, скриншот, отладка. */
  force?: boolean
}

// Идея компонента: полоса «нет соединения». Она единственная в наборе следит
// за состоянием сама, потому что прокидывать его пропом означало бы повторять
// одну и ту же подписку в каждом проекте. Подписка сделана через
// useSyncExternalStore: это штатный способ читать внешний источник, он не
// вызывает лишних рендеров и корректно ведёт себя при серверной отрисовке.
//
// Компонент показывает только отсутствие связи. Сообщения «связь вернулась»
// здесь нет намеренно: о возврате к норме говорит исчезновение полосы, а
// отдельное уведомление об успехе пришлось бы прятать по таймеру.
const STYLES = `
:where([data-vibeui-block="alert-018"]){
--vibeui-alert-018-fg:oklch(0.97 0.004 265);
--vibeui-alert-018-bg:oklch(0.32 0.016 265);
--vibeui-alert-018-muted:oklch(0.82 0.01 265);
--vibeui-alert-018-radius:9999px;
--vibeui-alert-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alert-018"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;
padding:0.5rem 0.9375rem;
border-radius:var(--vibeui-alert-018-radius);
background:var(--vibeui-alert-018-bg);color:var(--vibeui-alert-018-fg);
font-family:var(--vibeui-alert-018-font);font-size:0.8125rem;
box-shadow:0 12px 30px -18px oklch(0.15 0.02 265 / 70%);
}
/* Мигающая точка вместо спиннера: связь не «грузится», она отсутствует. */
[data-vibeui-block="alert-018"] [data-part="dot"]{
flex:none;width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:currentColor;
animation:vibeui-alert-018-blink 1.4s ease-in-out infinite;
}
@keyframes vibeui-alert-018-blink{0%,100%{opacity:1}50%{opacity:.25}}
[data-vibeui-block="alert-018"] [data-part="title"]{font-weight:600}
[data-vibeui-block="alert-018"] [data-part="description"]{color:var(--vibeui-alert-018-muted)}
[data-vibeui-block="alert-018"] [data-part="retry"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:inherit;font:inherit;font-weight:600;text-decoration:underline;
}
[data-vibeui-block="alert-018"] [data-part="retry"]:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-018"] *{animation:none!important;transition:none!important}}
`

function subscribe(callback: () => void) {
  window.addEventListener("online", callback)
  window.addEventListener("offline", callback)

  return () => {
    window.removeEventListener("online", callback)
    window.removeEventListener("offline", callback)
  }
}

/**
 * Полоса отсутствия связи: подписка на события браузера внутри компонента.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert018({
  title = "Нет соединения",
  description = "Изменения сохранятся, когда сеть вернётся.",
  retryLabel = "Повторить",
  onRetry,
  force = false,
  className,
  style,
  ...props
}: Alert018Props) {
  // На сервере считаем, что связь есть: полоса появится уже в браузере.
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )

  if (online && !force) {
    return null
  }

  return (
    <>
      <style href="vibeui-alert-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-018"
        role="status"
        aria-live="polite"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="title">{title}</span>
        {description ? (
          <span data-part="description">{description}</span>
        ) : null}
        {onRetry && retryLabel ? (
          <button data-part="retry" type="button" onClick={onRetry}>
            {retryLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}
