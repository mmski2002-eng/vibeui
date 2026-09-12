"use client"

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
} from "react"

export type Button002Item = {
  label: string
  onSelect?: () => void
  disabled?: boolean
}

export type Button002Props = ComponentProps<"button"> & {
  /** Подпись второй зоны для скринридера: у шеврона нет текста. */
  menuLabel?: string
  /** Пункты встроенного меню. Пустой массив — меню нет, шеврон зовёт onMenuClick. */
  items?: Button002Item[]
  /** Запасной обработчик шеврона, когда встроенное меню отключено. */
  onMenuClick?: () => void
  accent?: string
  accentForeground?: string
  /** Класс попадает на обёртку, а не на основную кнопку: зон две плюс меню. */
  className?: string
}

// Идея компонента: одно управляющее пятно, разделённое волосяной линией на
// две зоны — основное действие и его варианты. Вторая зона уже первой и чуть
// притоплена, поэтому читается как приставка, а не как вторая кнопка.
// Шеврон раскрывает меню вариантов; выбранный пункт становится подписью
// основной кнопки. items={[]} возвращает старый режим «только колбэк».
//
// Меню живёт в top layer через Popover API: absolute-позиционирование
// резалось overflow карточек каталога, а transform масштабированной
// миниатюры превращал fixed в локальный. Координаты считаются от пилюли
// при каждом открытии; прокрутка и ресайз закрывают меню вместо пересчёта.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте акцент светлее, подпись на нём темнее, а волосяная линия между
// зонами меняет знак — светлая на светлом акценте не видна.
const STYLES = `
:where([data-vibeui-block="button-002"]){
/* Светлая ветка глубже брендового light-dark(#1a1a1a,#f2f2f2): на L 0.55 белая подпись
   держит ≥4.5:1. Тёмная — чистый light-dark(#1a1a1a,#f2f2f2) с почти чёрной подписью. */
--vibeui-button-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-002-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.15 0 0));
--vibeui-button-002-divider:light-dark(oklch(1 0 0 / 28%),oklch(0.18 0 0 / 30%));
--vibeui-button-002-ring:color-mix(in oklab, var(--vibeui-button-002-accent) 70%, transparent);
--vibeui-button-002-menu-bg:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-button-002-menu-fg:light-dark(oklch(0.26 0 0),oklch(0.94 0 0));
--vibeui-button-002-menu-border:light-dark(oklch(0.9 0 0),oklch(0.36 0 0));
--vibeui-button-002-radius:0.625rem;
--vibeui-button-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-002"]{color-scheme:dark}
[data-vibeui-block="button-002"]{
position:relative;display:inline-flex;
font-family:var(--vibeui-button-002-font);
}
[data-vibeui-block="button-002"] [data-part="pill"]{
display:inline-flex;align-items:stretch;isolation:isolate;
border-radius:var(--vibeui-button-002-radius);overflow:hidden;
}
[data-vibeui-block="button-002"] [data-part="action"],
[data-vibeui-block="button-002"] [data-part="more"]{
appearance:none;border:0;cursor:pointer;background:var(--vibeui-button-002-accent);
color:oklch(from var(--vibeui-button-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font:inherit;font-weight:500;font-size:0.875rem;
line-height:1;height:2.5rem;display:inline-flex;align-items:center;justify-content:center;
transition:background-color .18s ease,opacity .18s ease;
}
[data-vibeui-block="button-002"] [data-part="action"]{padding:0 1.125rem}
[data-vibeui-block="button-002"] [data-part="more"]{
padding:0 0.625rem;box-shadow:inset 1px 0 0 var(--vibeui-button-002-divider);
background:color-mix(in oklab, var(--vibeui-button-002-accent) 88%, black);
}
[data-vibeui-block="button-002"] [data-part="action"]:hover:not(:disabled),
[data-vibeui-block="button-002"] [data-part="more"]:hover:not(:disabled){background:color-mix(in oklab, var(--vibeui-button-002-accent) 80%, black)}
[data-vibeui-block="button-002"] [data-part="action"]:focus-visible,
[data-vibeui-block="button-002"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-button-002-ring);outline-offset:2px;z-index:1}
[data-vibeui-block="button-002"] [data-part="action"]:disabled,
[data-vibeui-block="button-002"] [data-part="more"]:disabled{cursor:not-allowed;opacity:.55}
[data-vibeui-block="button-002"] [data-part="more"] svg{width:0.75rem;height:0.75rem;display:block;transition:transform .18s ease}
[data-vibeui-block="button-002"] [data-part="more"]:hover:not(:disabled) svg{transform:translateY(1px)}
[data-vibeui-block="button-002"] [data-part="more"][aria-expanded="true"] svg{transform:rotate(180deg)}
/* Popover: сбрасываем UA-стили top layer (inset/margin/границы) и держим
   свои. Координаты ставит скрипт при открытии. */
[data-vibeui-block="button-002"] [data-part="menu"]{
position:fixed;inset:auto;margin:0;box-sizing:border-box;
min-width:11rem;width:max-content;
display:flex;flex-direction:column;padding:0.25rem;
background:var(--vibeui-button-002-menu-bg);
color:var(--vibeui-button-002-menu-fg);
border:1px solid var(--vibeui-button-002-menu-border);
border-radius:var(--vibeui-button-002-radius);
box-shadow:0 12px 28px -14px oklch(0 0 0 / 40%);
opacity:1;translate:0 0;
transition:opacity .16s ease,translate .16s ease;
}
/* display:flex перебивает браузерное display:none у закрытого popover:
   без этого меню висело раскрытым всегда. */
[data-vibeui-block="button-002"] [data-part="menu"]:not(:popover-open){display:none}
@starting-style{
[data-vibeui-block="button-002"] [data-part="menu"]:popover-open{opacity:0;translate:0 -0.25rem}
}
[data-vibeui-block="button-002"] [data-part="menu"] button{
appearance:none;border:0;background:transparent;cursor:pointer;
border-radius:calc(var(--vibeui-button-002-radius) - 0.1875rem);
padding:0.5rem 0.75rem;text-align:left;white-space:nowrap;
font:inherit;font-size:0.875rem;line-height:1.2;font-weight:450;
color:var(--vibeui-button-002-menu-fg);
}
/* Подсветка одна и следует за roving focus: наведение переносит фокус
   (onMouseEnter → focus), поэтому :hover отдельно не подсвечивается и два
   пункта разом не горят. */
[data-vibeui-block="button-002"] [data-part="menu"] button:focus{
outline:none;background:color-mix(in oklab, var(--vibeui-button-002-accent) 14%, transparent);
}
[data-vibeui-block="button-002"] [data-part="menu"] button:disabled{cursor:not-allowed;opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Button002Item[] = [
  { label: "Опубликовать сейчас" },
  { label: "Запланировать публикацию" },
  { label: "Сохранить как черновик" },
]

/**
 * Кнопка с приставкой вариантов: основное действие слева, справа шеврон,
 * раскрывающий меню; выбранный пункт становится подписью основной кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button002({
  menuLabel = "Другие варианты",
  items = DEFAULT_ITEMS,
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
  const [open, setOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pressingMenu = useRef(false)
  const pendingFocus = useRef<"first" | "last" | null>(null)
  const menuId = useId()
  const hasMenu = items.length > 0

  // Показ попапа и координаты — эффектом: пока popover закрыт, мерить и
  // фокусировать нечего. Прокрутка и ресайз закрывают меню: пересчёт позиции
  // на каждый кадр дороже и не нужен.
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) {
      return
    }
    if (!open) {
      if (menu.matches(":popover-open")) {
        menu.hidePopover()
      }
      return
    }
    const anchor = pillRef.current?.getBoundingClientRect()
    if (anchor) {
      menu.style.top = `${anchor.bottom + 6}px`
      menu.style.right = `${Math.max(0, window.innerWidth - anchor.right)}px`
      menu.style.minWidth = `${Math.max(anchor.width, 176)}px`
    }
    menu.showPopover()
    const nodes = menu.querySelectorAll<HTMLButtonElement>(
      "button:not(:disabled)",
    )
    if (nodes.length && pendingFocus.current) {
      const target =
        pendingFocus.current === "last" ? nodes[nodes.length - 1] : nodes[0]
      target.focus()
    }
    pendingFocus.current = null

    const dismiss = () => setOpen(false)
    window.addEventListener("scroll", dismiss, { capture: true, passive: true })
    window.addEventListener("resize", dismiss)
    return () => {
      window.removeEventListener("scroll", dismiss, { capture: true })
      window.removeEventListener("resize", dismiss)
    }
  }, [open])

  const openMenu = (focus: "first" | "last") => {
    pendingFocus.current = focus
    setOpen(true)
  }

  const closeMenu = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) {
      moreRef.current?.focus()
    }
  }

  const handleMoreClick = () => {
    if (!hasMenu) {
      onMenuClick?.()
      return
    }
    if (open) {
      closeMenu()
    } else {
      openMenu("first")
    }
  }

  const handleMoreKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!hasMenu) {
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      openMenu("first")
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      openMenu("last")
    } else if (event.key === "Escape" && open) {
      closeMenu()
    }
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nodes = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ) ?? [],
    )
    if (!nodes.length) {
      return
    }
    const current = nodes.indexOf(document.activeElement as HTMLButtonElement)
    const focusAt = (index: number) => {
      nodes[(index + nodes.length) % nodes.length].focus()
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        focusAt(current + 1)
        break
      case "ArrowUp":
        event.preventDefault()
        focusAt(current - 1)
        break
      case "Home":
        event.preventDefault()
        focusAt(0)
        break
      case "End":
        event.preventDefault()
        focusAt(nodes.length - 1)
        break
      case "Escape":
        event.preventDefault()
        closeMenu()
        break
    }
  }

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
        data-slot="button"
        data-vibeui-block="button-002"
        className={className}
        style={palette}
        onMouseUpCapture={() => {
          pressingMenu.current = false
        }}
        onBlurCapture={(event) => {
          // Уход фокуса наружу закрывает меню; переход между зонами и
          // пунктами — нет. Нажатие по пункту в Safari уводит фокус, не
          // отдавая его кнопке, поэтому клик прикрыт флагом pressingMenu.
          if (pressingMenu.current) {
            return
          }
          const next = event.relatedTarget as Node | null
          if (next && event.currentTarget.contains(next)) {
            return
          }
          setOpen(false)
        }}
      >
        <div data-part="pill" role="group" ref={pillRef}>
          <button {...props} type={type} data-part="action" disabled={disabled}>
            {selectedLabel ?? children}
          </button>
          <button
            ref={moreRef}
            type="button"
            data-part="more"
            aria-label={menuLabel}
            aria-haspopup={hasMenu ? "menu" : undefined}
            aria-expanded={hasMenu ? open : undefined}
            aria-controls={hasMenu && open ? menuId : undefined}
            onClick={handleMoreClick}
            onKeyDown={handleMoreKeyDown}
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
        {hasMenu ? (
          <div
            ref={menuRef}
            id={menuId}
            data-part="menu"
            role="menu"
            aria-label={menuLabel}
            popover="manual"
            onKeyDown={handleMenuKeyDown}
            onMouseDown={() => {
              pressingMenu.current = true
            }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onMouseEnter={(event) => {
                  event.currentTarget.focus()
                }}
                onClick={() => {
                  pressingMenu.current = false
                  setSelectedLabel(item.label)
                  item.onSelect?.()
                  closeMenu()
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
