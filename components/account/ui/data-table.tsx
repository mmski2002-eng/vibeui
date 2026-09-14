import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type Column = {
  key: string
  label: ReactNode
  align?: "left" | "right"
  /** Ширина колонки: класс Tailwind, например `w-28`. */
  className?: string
  /** Спрятать на узком экране. */
  hideBelow?: "sm" | "md" | "lg"
}

export type Row = {
  id: string
  /** Вся строка — ссылка на карточку. */
  href?: string
  cells: ReactNode[]
  className?: string
}

const HIDE: Record<NonNullable<Column["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
}

/**
 * Таблица списков: платежи, пользователи, обращения, рефералы.
 *
 * Настоящий <table> с липкой шапкой вместо <ul> из flex-строк: у списка
 * колонки «дата — почта — статус — сумма» плыли от строки к строке, и
 * глаз не мог пробежать по одному столбцу сверху вниз.
 */
export function DataTable({
  columns,
  rows,
  empty,
  index,
  caption,
}: {
  columns: Column[]
  rows: Row[]
  empty: ReactNode
  index?: number
  caption?: string
}) {
  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "border-shell-border text-shell-muted rounded-2xl border border-dashed px-6 py-10 text-center text-sm",
          index !== undefined && "acc-reveal",
        )}
        style={index !== undefined ? { ["--i" as string]: index } : undefined}
      >
        {empty}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "border-shell-border bg-shell-panel acc-shadow overflow-x-auto rounded-2xl border",
        index !== undefined && "acc-reveal",
      )}
      style={index !== undefined ? { ["--i" as string]: index } : undefined}
    >
      <table className="w-full border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-shell-panel sticky top-0 z-10">
          <tr className="border-shell-divider border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "text-shell-muted px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase",
                  column.align === "right" && "text-right",
                  column.className,
                  column.hideBelow && HIDE[column.hideBelow],
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-shell-divider divide-y">
          {rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "group transition-colors",
                row.href && "hover:bg-shell-elevated/70",
                row.className,
              )}
            >
              {row.cells.map((cell, position) => {
                const column = columns[position]

                return (
                  <td
                    key={column?.key ?? position}
                    className={cn(
                      "text-shell-fg px-4 py-3 align-middle",
                      column?.align === "right" && "text-right",
                      column?.className,
                      column?.hideBelow && HIDE[column.hideBelow],
                      row.href && "p-0",
                    )}
                  >
                    {row.href ? (
                      <Link
                        href={row.href}
                        tabIndex={position === 0 ? 0 : -1}
                        className={cn(
                          "flex min-h-12 items-center px-4 py-3 focus-visible:outline-none",
                          column?.align === "right" && "justify-end",
                          position === 0 &&
                            "group-focus-within:ring-shell-ring rounded-l-lg",
                        )}
                      >
                        {cell}
                      </Link>
                    ) : (
                      cell
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Две строки в ячейке: главное и подпись под ним. */
export function CellStack({
  primary,
  secondary,
  mono,
}: {
  primary: ReactNode
  secondary?: ReactNode
  mono?: boolean
}) {
  return (
    <span className="block min-w-0">
      <span className="text-shell-fg block truncate">{primary}</span>
      {secondary ? (
        <span
          className={cn(
            "text-shell-muted block truncate text-xs",
            mono && "font-mono",
          )}
        >
          {secondary}
        </span>
      ) : null}
    </span>
  )
}
