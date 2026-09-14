"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { AlertTriangle, Check, Info, X } from "lucide-react"

import { cn } from "@/lib/utils"

type Tone = "ok" | "danger" | "info"

type Toast = { id: number; title: string; note?: string; tone: Tone }

type Push = (toast: { title: string; note?: string; tone?: Tone }) => void

const ToastContext = createContext<Push>(() => {})

const TONE: Record<Tone, { icon: typeof Check; className: string }> = {
  ok: { icon: Check, className: "text-shell-ok" },
  danger: { icon: AlertTriangle, className: "text-shell-danger" },
  info: { icon: Info, className: "text-shell-accent-text" },
}

/**
 * Уведомления о результате действия: сохранено, отозвано, не получилось.
 *
 * Вместо строки текста под кнопкой: строка появлялась там, куда человек
 * уже не смотрит, и сдвигала вёрстку. Тост всплывает в одном углу и сам
 * уходит; ошибка держится дольше успеха.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((was) => was.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback<Push>(
    ({ title, note, tone = "ok" }) => {
      const id = ++counter.current

      setToasts((was) => [...was.slice(-2), { id, title, note, tone }])
      window.setTimeout(() => dismiss(id), tone === "danger" ? 7000 : 3500)
    },
    [dismiss],
  )

  const value = useMemo(() => push, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        {toasts.map((toast) => {
          const Icon = TONE[toast.tone].icon

          return (
            <div
              key={toast.id}
              role="status"
              className="acc-toast border-shell-border bg-shell-panel acc-shadow pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm"
            >
              <Icon
                className={cn("mt-0.5 size-4 shrink-0", TONE[toast.tone].className)}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-shell-fg font-medium">{toast.title}</p>
                {toast.note ? (
                  <p className="text-shell-muted mt-0.5 text-xs leading-relaxed">
                    {toast.note}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="×"
                className="text-shell-muted hover:text-shell-fg -m-1 rounded p-1 transition-colors"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
