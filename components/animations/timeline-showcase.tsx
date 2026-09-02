"use client"

import { Moon, Sun } from "lucide-react"
import { useState } from "react"

import {
  ActivityTimeline,
  type ActivityTimelineEvent,
  type ActivityTimelineProps,
} from "@/components/animations/activity-timeline"

type Theme = "light" | "dark"

const ONBOARDING: ActivityTimelineEvent[] = [
  {
    label: "Аккаунт создан",
    desc: "Рабочая область готова",
    meta: "3 дн",
    state: "done",
  },
  {
    label: "Команда приглашена",
    desc: "8 участников",
    meta: "1 дн",
    state: "done",
  },
  {
    label: "Настройка интеграций",
    desc: "Slack, GitHub, Linear",
    meta: "Сегодня",
    state: "current",
  },
  {
    label: "Первый проект",
    desc: "Запуск со стейкхолдерами",
    meta: "Далее",
    state: "todo",
  },
]

type Variant = {
  id: string
  tag: string
  props: Partial<ActivityTimelineProps>
}

const VARIANTS: Variant[] = [
  { id: "default", tag: "default", props: {} },
  { id: "fade", tag: "fadeOut", props: { fadeOut: true } },
  { id: "iso", tag: "isometric", props: { isometric: true } },
  {
    id: "iso-fade",
    tag: "isometric · fadeOut",
    props: { isometric: true, fadeOut: true },
  },
  {
    id: "flat",
    tag: "default · no gradient",
    props: { gradient: false },
  },
  {
    id: "custom",
    tag: "custom steps",
    props: { title: "Онбординг", badge: "Q2", events: ONBOARDING },
  },
]

const TOGGLE =
  "border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong hover:bg-shell-panel focus-visible:ring-shell-ring inline-flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"

/**
 * Карточка варианта повторяет каталожную: рамка, кадр с тулбаром и подложкой,
 * подпись снизу. Тему кадр берёт из data-preview-theme, как в каталоге, и
 * переключается кнопкой в тулбаре у каждой карточки отдельно.
 */
function VariantCard({ variant }: { variant: Variant }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const isDark = theme === "dark"
  const tall = variant.props.isometric

  return (
    <article className="bg-shell border-shell-card-strong relative flex h-full flex-col overflow-clip rounded-2xl border p-0.5 shadow-sm shadow-black/5">
      <div
        data-preview-theme={theme}
        className="border-shell-border bg-shell flex min-h-44 min-w-0 flex-1 flex-col overflow-clip rounded-xl border"
      >
        <div className="border-shell-border bg-shell flex shrink-0 items-center justify-between gap-2 border-b px-1.5 py-1.5">
          <span className="text-shell-muted px-1 font-mono text-[0.6875rem]">
            {variant.tag}
          </span>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-pressed={isDark}
            className={TOGGLE}
          >
            {isDark ? (
              <Sun className="size-3.5" aria-hidden="true" />
            ) : (
              <Moon className="size-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {isDark ? "Светлая тема" : "Тёмная тема"}
            </span>
          </button>
        </div>

        <div
          className={`bg-preview-surface flex flex-1 items-center justify-center overflow-clip p-8 ${
            tall ? "min-h-[26rem]" : "min-h-96"
          }`}
        >
          <ActivityTimeline {...variant.props} />
        </div>
      </div>
    </article>
  )
}

export function TimelineShowcase() {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <li key={variant.id}>
          <VariantCard variant={variant} />
        </li>
      ))}
    </ul>
  )
}
