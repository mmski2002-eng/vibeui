"use client"

import { Check } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

const STORAGE_KEY = "vibeui-start-done"
const CHANGE_EVENT = "vibeui-start-done-change"

type Progress = {
  done: ReadonlySet<string>
  total: number
  toggle: (id: string) => void
}

const ProgressContext = createContext<Progress | null>(null)

/* Отметки читаются как внешнее хранилище: на сервере их нет, после
   гидрации React сам перечитает localStorage — без setState в эффекте. */
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", callback)

  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

function readSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]"
  } catch {
    return "[]"
  }
}

function serverSnapshot(): string {
  return "[]"
}

/**
 * Чек-лист гайда. Отметки живут в localStorage: новичок закрывает вкладку,
 * ставит Node, возвращается — и видит, где остановился. Сервер про отметки
 * не знает, это не данные аккаунта.
 */
export function StartProgress({
  ids,
  children,
}: {
  ids: string[]
  children: ReactNode
}) {
  const raw = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot)
  const known = ids.join(",")

  const done = useMemo(() => {
    const allowed = known.split(",")

    try {
      const saved: unknown = JSON.parse(raw)

      return new Set(
        Array.isArray(saved)
          ? saved.filter(
              (id): id is string =>
                typeof id === "string" && allowed.includes(id),
            )
          : [],
      )
    } catch {
      return new Set<string>()
    }
  }, [raw, known])

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(done)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        // Приватный режим: отметка не сохранится, и только.
      }

      window.dispatchEvent(new Event(CHANGE_EVENT))
    },
    [done],
  )

  const value = useMemo(
    () => ({ done, total: ids.length, toggle }),
    [done, ids.length, toggle],
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useStartProgress(): Progress {
  const context = useContext(ProgressContext)

  if (!context) {
    throw new Error("useStartProgress вне StartProgress")
  }

  return context
}

/** Номер шага, который по клику становится галкой. */
export function StepCheck({
  id,
  number,
  label,
  className,
}: {
  id: string
  number: number
  label: string
  className?: string
}) {
  const { done, toggle } = useStartProgress()
  const checked = done.has(id)

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => toggle(id)}
      className={cn(
        "focus-visible:ring-shell-ring flex size-8 shrink-0 items-center justify-center rounded-full border text-sm transition-[background-color,border-color,color,transform] duration-(--motion-base) hover:scale-105 focus-visible:ring-2 focus-visible:outline-none active:scale-95",
        checked
          ? "border-shell-ok bg-shell-ok text-shell-bg"
          : "border-shell-border text-shell-fg hover:border-shell-accent hover:text-shell-accent-text",
        className,
      )}
    >
      {checked ? (
        <Check className="copy-check size-4" aria-hidden="true" />
      ) : (
        <span className="tabular-nums">{number}</span>
      )}
    </button>
  )
}
