"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox021Node = {
  id: string
  label: string
  children?: Checkbox021Node[]
}

export type Checkbox021Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange" | "title"
> & {
  title?: string
  nodes?: Checkbox021Node[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: дерево с наследованием вниз и вычислением вверх. Состояние
// хранится только для листьев: ветка отмечена, когда отмечены все её листья,
// и промежуточна, когда часть. Ветки лежат в <details>, поэтому сворачиваются
// без JS, а линии слева показывают вложенность на любой глубине.
const STYLES = `
:where([data-vibeui-block="checkbox-021"]){
--vibeui-checkbox-021-bg:oklch(1 0 0);
--vibeui-checkbox-021-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-021-muted:oklch(0.57 0.014 265);
--vibeui-checkbox-021-border:oklch(0.9 0.006 265);
--vibeui-checkbox-021-line:oklch(0.93 0.005 265);
--vibeui-checkbox-021-hover:oklch(0.975 0.003 265);
--vibeui-checkbox-021-accent:oklch(0.52 0.15 195);
--vibeui-checkbox-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-021"]{
display:block;width:100%;max-width:22rem;box-sizing:border-box;
padding:0.875rem;border:1px solid var(--vibeui-checkbox-021-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-021-bg);
font-family:var(--vibeui-checkbox-021-font);color:var(--vibeui-checkbox-021-fg);
}
[data-vibeui-block="checkbox-021"] [data-part="title"]{
margin:0 0 0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="checkbox-021"] ul{margin:0;padding:0;list-style:none}
/* Вложенность рисуется линией слева, а не только отступом: на третьем
   уровне отступ перестаёт читаться. */
[data-vibeui-block="checkbox-021"] ul ul{
margin-left:0.5625rem;padding-left:0.6875rem;
border-left:1px solid var(--vibeui-checkbox-021-line);
}
[data-vibeui-block="checkbox-021"] label{
display:flex;align-items:center;gap:0.5rem;
min-height:1.875rem;padding:0 0.375rem;margin:0 -0.375rem;border-radius:0.5rem;
font-size:0.8125rem;cursor:pointer;
transition:background-color .15s ease;
}
[data-vibeui-block="checkbox-021"] label:hover{background:var(--vibeui-checkbox-021-hover)}
[data-vibeui-block="checkbox-021"] [data-part="branch"] label{font-weight:600}
[data-vibeui-block="checkbox-021"] input{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1rem;height:1rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-021-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-021-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-021"] input:checked,
[data-vibeui-block="checkbox-021"] input:indeterminate{
border-color:transparent;background:var(--vibeui-checkbox-021-accent);
}
[data-vibeui-block="checkbox-021"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.21875rem;height:0.40625rem;margin:-0.28125rem 0 0 -0.109375rem;
border-right:2px solid oklch(0.99 0.01 195);border-bottom:2px solid oklch(0.99 0.01 195);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-021"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;border-radius:1px;
background:oklch(0.99 0.01 195);
}
[data-vibeui-block="checkbox-021"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-021-accent);outline-offset:2px}
[data-vibeui-block="checkbox-021"] summary{
display:flex;align-items:center;gap:0.25rem;list-style:none;cursor:pointer;
}
[data-vibeui-block="checkbox-021"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="checkbox-021"] [data-part="arrow"]{
flex:none;width:0.75rem;color:var(--vibeui-checkbox-021-muted);font-size:0.625rem;
transition:transform .15s ease;
}
[data-vibeui-block="checkbox-021"] details[open] > summary [data-part="arrow"]{transform:rotate(90deg)}
[data-vibeui-block="checkbox-021"] summary:focus-visible{outline:2px solid var(--vibeui-checkbox-021-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="checkbox-021"] [data-part="foot"]{
margin:0.625rem 0 0;padding-top:0.5rem;
border-top:1px solid var(--vibeui-checkbox-021-border);
font-size:0.75rem;color:var(--vibeui-checkbox-021-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NODES: Checkbox021Node[] = [
  {
    id: "content",
    label: "Контент",
    children: [
      {
        id: "pages",
        label: "Страницы",
        children: [
          { id: "pages-read", label: "Читать" },
          { id: "pages-edit", label: "Редактировать" },
          { id: "pages-delete", label: "Удалять" },
        ],
      },
      {
        id: "media",
        label: "Медиа",
        children: [
          { id: "media-read", label: "Смотреть" },
          { id: "media-upload", label: "Загружать" },
        ],
      },
    ],
  },
  {
    id: "team",
    label: "Команда",
    children: [
      { id: "team-read", label: "Список участников" },
      { id: "team-invite", label: "Приглашать" },
    ],
  },
]

function leavesOf(node: Checkbox021Node): string[] {
  return node.children
    ? node.children.flatMap((child) => leavesOf(child))
    : [node.id]
}

function Row({
  node,
  value,
  onToggle,
}: {
  node: Checkbox021Node
  value: string[]
  onToggle: (ids: string[], checked: boolean) => void
}) {
  const leaves = leavesOf(node)
  const picked = leaves.filter((leaf) => value.includes(leaf))
  const all = picked.length === leaves.length
  const some = picked.length > 0 && !all
  const ref = useRef<HTMLInputElement>(null)

  // indeterminate живёт только в DOM: атрибутом его не выставить.
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = some
    }
  }, [some])

  // Клик по галочке внутри <summary> иначе свернул бы ветку: активация
  // summary происходит на нём самом, поэтому событие до него не доводим.
  const box = (
    <label onClick={(event) => event.stopPropagation()}>
      <input
        ref={ref}
        type="checkbox"
        checked={all}
        onChange={() => onToggle(leaves, !all)}
      />
      <span>{node.label}</span>
    </label>
  )

  if (!node.children) {
    return <li>{box}</li>
  }

  return (
    <li data-part="branch">
      <details open>
        <summary>
          <span data-part="arrow" aria-hidden="true">
            ▶
          </span>
          {box}
        </summary>
        <ul>
          {node.children.map((child) => (
            <Row
              key={child.id}
              node={child}
              value={value}
              onToggle={onToggle}
            />
          ))}
        </ul>
      </details>
    </li>
  )
}

/**
 * Дерево чекбоксов с наследованием: ветка переключает все свои листья,
 * а её состояние считается из них. Один файл, ноль зависимостей.
 */
export function Checkbox021({
  title = "Права доступа",
  nodes = DEFAULT_NODES,
  defaultValue = ["pages-read", "media-read"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox021Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-021-accent": accent } : null),
    ...style,
  } as CSSProperties

  const total = nodes.flatMap((node) => leavesOf(node)).length

  const toggle = (ids: string[], checked: boolean) => {
    const next = checked
      ? [...new Set([...value, ...ids])]
      : value.filter((item) => !ids.includes(item))

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-021" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="checkbox-021"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h3 data-part="title">{title}</h3>
        <ul>
          {nodes.map((node) => (
            <Row key={node.id} node={node} value={value} onToggle={toggle} />
          ))}
        </ul>
        <p data-part="foot" role="status">
          Выдано прав: {value.length} из {total}
        </p>
      </section>
    </>
  )
}
