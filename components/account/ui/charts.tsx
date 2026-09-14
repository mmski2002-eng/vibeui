import type { ReactNode } from "react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { formatAxisDay, formatNumber, type NumberKind } from "@/lib/format"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/**
 * Графики кабинета — свои SVG на сервере.
 *
 * Данных мало (до 90 точек на ряд), поэтому библиотека графиков не
 * оправдана: она тянула бы в бандл рисовалку ради тридцати отрезков.
 * Линии рисуются CSS-анимацией через pathLength="1", столбцы растут
 * transform'ом, подсказки — нативные <title>.
 */

export type DayPoint = { day: string; value: number }

export type Tone = "accent" | "ok" | "warn" | "danger" | "muted"

const STROKE: Record<Tone, string> = {
  accent: "var(--shell-accent)",
  ok: "var(--shell-ok)",
  warn: "var(--shell-warn)",
  danger: "var(--shell-danger)",
  muted: "var(--shell-muted)",
}

function linePath(
  values: number[],
  top: number,
  width: number,
  height: number,
  pad = 2,
) {
  const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0

  return values
    .map((value, index) => {
      const x = pad + index * step
      const y = height - pad - (value / top) * (height - pad * 2)

      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

/** Мини-линия для плитки: без осей, только форма ряда. */
export function Sparkline({
  data,
  tone = "accent",
  index = 0,
  className,
}: {
  data: number[]
  tone?: Tone
  index?: number
  className?: string
}) {
  if (data.length < 2) return null

  const width = 120
  const height = 36
  const top = Math.max(1, ...data)
  const path = linePath(data, top, width, height)
  const id = `spark-${tone}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-9 w-full", className)}
      style={{ ["--i" as string]: index }}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={STROKE[tone]} stopOpacity="0.28" />
          <stop offset="1" stopColor={STROKE[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L${width - 2} ${height} L2 ${height} Z`}
        fill={`url(#${id})`}
        className="acc-fade-late"
      />
      <path
        d={path}
        pathLength={1}
        fill="none"
        stroke={STROKE[tone]}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="acc-draw"
      />
    </svg>
  )
}

/**
 * Линия с областью по дням. До двух рядов: второй — тоньше и пунктиром,
 * им сравнивают, например, переходы с регистрациями.
 */
export function AreaChart({
  data,
  second,
  labels,
  kind = "int",
  locale = "ru",
  index = 0,
  tone = "accent",
  secondTone = "muted",
  height = 180,
}: {
  data: DayPoint[]
  second?: DayPoint[]
  /** Подписи рядов для легенды. */
  labels?: [string, string?]
  kind?: NumberKind
  locale?: Locale
  index?: number
  tone?: Tone
  secondTone?: Tone
  height?: number
}) {
  if (data.length < 2) return null

  const width = 600
  const values = data.map((point) => point.value)
  const others = second?.map((point) => point.value) ?? []
  const top = Math.max(1, ...values, ...others)
  const pad = 4
  const step = (width - pad * 2) / (values.length - 1)
  const y = (value: number) =>
    height - pad - (value / top) * (height - pad * 2)
  const path = linePath(values, top, width, height, pad)
  const mid = Math.floor((data.length - 1) / 2)
  const id = `area-${tone}-${index}`

  return (
    <figure
      className="acc-reveal min-w-0"
      style={{ ["--i" as string]: index }}
    >
      <div className="text-shell-muted mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
        {labels ? (
          <div className="flex items-center gap-4">
            <Legend color={STROKE[tone]}>{labels[0]}</Legend>
            {labels[1] && second ? (
              <Legend color={STROKE[secondTone]} dashed>
                {labels[1]}
              </Legend>
            ) : null}
          </div>
        ) : (
          <span />
        )}
        <span className="tabular-nums">
          max {formatNumber(top, kind, locale)}
        </span>
      </div>

      <div className="relative">
        {/* Сетка — HTML: линии SVG растягивались бы вместе с картинкой. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-between"
        >
          {[0, 1, 2, 3].map((line) => (
            <span
              key={line}
              className="border-shell-divider block w-full border-t border-dashed"
            />
          ))}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={labels?.[0]}
          className="relative block w-full"
          style={{ height }}
        >
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={STROKE[tone]} stopOpacity="0.3" />
              <stop offset="1" stopColor={STROKE[tone]} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`${path} L${width - pad} ${height} L${pad} ${height} Z`}
            fill={`url(#${id})`}
            className="acc-fade-late"
          />

          {second && second.length > 1 ? (
            <path
              d={linePath(others, top, width, height, pad)}
              pathLength={1}
              fill="none"
              stroke={STROKE[secondTone]}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              className="acc-fade-late"
            />
          ) : null}

          <path
            d={path}
            pathLength={1}
            fill="none"
            stroke={STROKE[tone]}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="acc-draw"
          />

          {/* Подсказки: прозрачные полосы на всю высоту, чтобы попадать
              курсором в день, а не в пиксель. */}
          {data.map((point, position) => (
            <g key={point.day}>
              <rect
                x={pad + position * step - step / 2}
                y={0}
                width={step}
                height={height}
                fill="transparent"
                className="hover:fill-[color-mix(in_oklab,var(--shell-fg)_6%,transparent)]"
              >
                <title>
                  {`${formatAxisDay(point.day, locale)}: ${formatNumber(point.value, kind, locale)}${
                    second?.[position]
                      ? ` · ${formatNumber(second[position].value, kind, locale)}`
                      : ""
                  }`}
                </title>
              </rect>
              {point.value > 0 ? (
                <circle
                  cx={pad + position * step}
                  cy={y(point.value)}
                  r="3"
                  fill="var(--shell-panel)"
                  stroke={STROKE[tone]}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  className="acc-fade-late pointer-events-none"
                />
              ) : null}
            </g>
          ))}
        </svg>
      </div>

      <figcaption className="text-shell-muted mt-2 flex justify-between text-[11px] tabular-nums">
        <span>{formatAxisDay(data[0].day, locale)}</span>
        <span>{formatAxisDay(data[mid].day, locale)}</span>
        <span>{formatAxisDay(data[data.length - 1].day, locale)}</span>
      </figcaption>
    </figure>
  )
}

function Legend({
  color,
  dashed,
  children,
}: {
  color: string
  dashed?: boolean
  children: ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className={cn("h-0.5 w-4 rounded-full", dashed && "opacity-60")}
        style={{ background: color }}
      />
      {children}
    </span>
  )
}

/** Столбцы по дням. Пустые дни — тоже столбцы, почти нулевой высоты. */
export function Bars({
  data,
  kind = "int",
  locale = "ru",
  tone = "accent",
  index = 0,
  height = 140,
  label,
}: {
  data: DayPoint[]
  kind?: NumberKind
  locale?: Locale
  tone?: Tone
  index?: number
  height?: number
  label?: string
}) {
  if (data.length === 0) return null

  const top = Math.max(1, ...data.map((point) => point.value))
  const total = data.reduce((sum, point) => sum + point.value, 0)
  const mid = Math.floor((data.length - 1) / 2)

  return (
    <figure
      className="acc-reveal min-w-0"
      style={{ ["--i" as string]: index }}
    >
      <div className="text-shell-muted mb-2 flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="tabular-nums">
          {formatNumber(total, kind, locale)}
        </span>
      </div>
      <div
        role="img"
        aria-label={label ? `${label}: ${total}` : undefined}
        className="border-shell-divider flex items-end gap-px border-b"
        style={{ height }}
      >
        {data.map((point, position) => (
          <span
            key={point.day}
            title={`${formatAxisDay(point.day, locale)}: ${formatNumber(point.value, kind, locale)}`}
            className="group flex h-full min-w-0 flex-1 items-end"
          >
            <span
              className={cn(
                "acc-grow-y block w-full rounded-t-sm transition-opacity group-hover:opacity-100",
                point.value > 0 ? "opacity-80" : "opacity-40",
              )}
              style={{
                ["--i" as string]: position,
                height: `${Math.max(point.value > 0 ? 6 : 2, (point.value / top) * 100)}%`,
                background:
                  point.value > 0 ? STROKE[tone] : "var(--shell-elevated)",
              }}
            />
          </span>
        ))}
      </div>
      <figcaption className="text-shell-muted mt-1.5 flex justify-between text-[11px] tabular-nums">
        <span>{formatAxisDay(data[0].day, locale)}</span>
        {data.length > 2 ? (
          <span>{formatAxisDay(data[mid].day, locale)}</span>
        ) : null}
        {data.length > 1 ? (
          <span>{formatAxisDay(data[data.length - 1].day, locale)}</span>
        ) : null}
      </figcaption>
    </figure>
  )
}

/** Кольцо: доля от целого. Лимит копирований, доля подтверждённых. */
export function Ring({
  value,
  max,
  size = 104,
  stroke = 9,
  tone = "accent",
  children,
  label,
}: {
  value: number
  max: number
  size?: number
  stroke?: number
  tone?: Tone
  /** Содержимое в центре: число, подпись. */
  children?: ReactNode
  label: string
}) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const radius = (size - stroke) / 2

  return (
    <div
      role="img"
      aria-label={label}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="block size-full -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--shell-elevated)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={STROKE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          pathLength={1}
          className="acc-draw"
          style={{ strokeDasharray: 1, strokeDashoffset: 1 - ratio }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

/** Воронка: ступени с долей от первой и конверсией к предыдущей. */
export function Funnel({
  steps,
  locale = "ru",
  index = 0,
}: {
  steps: { label: string; value: number }[]
  locale?: Locale
  index?: number
}) {
  const first = steps[0]?.value ?? 0

  return (
    <ol className="acc-reveal grid gap-3" style={{ ["--i" as string]: index }}>
      {steps.map((step, position) => {
        const previous = steps[position - 1]?.value ?? 0
        const share = first > 0 ? step.value / first : 0
        const conversion =
          position > 0 && previous > 0
            ? Math.round((step.value / previous) * 100)
            : null

        return (
          <li key={step.label} className="grid gap-1.5">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-shell-fg">{step.label}</span>
              <span className="flex items-baseline gap-2 tabular-nums">
                {conversion !== null ? (
                  <span className="text-shell-muted text-xs">
                    {conversion}%
                  </span>
                ) : null}
                <span className="text-shell-fg font-semibold">
                  {formatNumber(step.value, "int", locale)}
                </span>
              </span>
            </div>
            <div className="bg-shell-elevated h-2 overflow-hidden rounded-full">
              <span
                className="acc-grow-x block h-full rounded-full"
                style={{
                  ["--i" as string]: position,
                  width: `${Math.max(share > 0 ? 2 : 0, share * 100)}%`,
                  background:
                    position === 0
                      ? "var(--shell-muted)"
                      : position === steps.length - 1
                        ? "var(--shell-ok)"
                        : "var(--shell-accent)",
                }}
              />
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** Изменение к прошлому периоду: стрелка, процент, цвет по знаку. */
export function Delta({
  value,
  before,
  suffix,
  invert,
}: {
  value: number
  before: number
  /** Подпись после процента: «к прошлым 30 дням». */
  suffix?: string
  /** Рост — плохо (отмены, ошибки): цвета меняются местами. */
  invert?: boolean
}) {
  if (before === 0 && value === 0) return null

  const change =
    before > 0 ? Math.round(((value - before) / before) * 100) : null
  const up = value > before
  const flat = value === before
  const good = invert ? !up : up
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        flat
          ? "text-shell-muted"
          : good
            ? "text-shell-ok"
            : "text-shell-danger",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {change === null ? (up ? "new" : "—") : `${Math.abs(change)}%`}
      {suffix ? (
        <span className="text-shell-muted ml-1 font-normal">{suffix}</span>
      ) : null}
    </span>
  )
}
