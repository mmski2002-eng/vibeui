"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Loader2, Tag, X } from "lucide-react"

import { checkPromo } from "@/lib/payment-actions"
import type { AppliedPromo, PromoFailure } from "@/lib/promo.shared"
import { cn } from "@/lib/utils"

export type PromoTexts = {
  have: string
  placeholder: string
  apply: string
  remove: string
  byCode: string
  instead: string
  errors: Record<PromoFailure | "failed", string>
}

/** Код держится на время визита: переключение месяц/год его не сбрасывает. */
const STORAGE_KEY = "vibeui-promo"

function readStored() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function store(code: string | null) {
  try {
    if (code) window.sessionStorage.setItem(STORAGE_KEY, code)
    else window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // приватное окно или закрытое хранилище — код просто не запомнится
  }
}

/**
 * Поле промокода в карточке Pro. Свёрнуто в тихую ссылку, раскрывается в
 * строку ввода, после проверки сворачивается в плашку с кодом и процентом.
 * Цены не считает: сервер возвращает готовые, витрина только показывает.
 */
export function PromoField({
  texts: t,
  initialCode,
  applied,
  onApplied,
}: {
  texts: PromoTexts
  /** Код из адреса или куки партнёра: применяется сам, без ввода. */
  initialCode: string | null
  applied: AppliedPromo | null
  onApplied: (next: AppliedPromo | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<PromoFailure | "failed" | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const checkedRef = useRef(false)

  async function check(code: string) {
    setPending(true)
    setError(null)

    try {
      const result = await checkPromo(code)

      if (result.ok) {
        onApplied({
          code: result.code,
          percent: result.percent,
          prices: result.prices,
        })
        store(result.code)
        setOpen(false)
      } else {
        setError(result.reason)
        store(null)
      }
    } catch {
      setError("failed")
    } finally {
      setPending(false)
    }
  }

  // Код из адреса, куки или хранилища вкладки проверяется один раз при
  // монтировании; состояние меняется только после ответа сервера.
  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    const code = initialCode ?? readStored()

    if (code) void check(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (applied) {
    return (
      <div className="promo-applied mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff5900]/50 bg-[#ff5900]/10 px-3 py-1 font-medium text-[#f2f2f2]">
          <Check className="size-3.5 text-[#ff5900]" aria-hidden="true" />
          <span className="font-mono">{applied.code}</span>
          <span className="text-[#f2f2f2]/70">· −{applied.percent} %</span>
        </span>
        <button
          type="button"
          onClick={() => {
            onApplied(null)
            store(null)
            setValue("")
          }}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-[#f2f2f2]/60 transition-colors hover:text-[#f2f2f2] focus-visible:ring-2 focus-visible:ring-[#ff5900] focus-visible:outline-none"
        >
          <X className="size-3.5" aria-hidden="true" />
          {t.remove}
        </button>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm text-[#f2f2f2]/60 transition-colors hover:text-[#f2f2f2] focus-visible:ring-2 focus-visible:ring-[#ff5900] focus-visible:outline-none"
      >
        <Tag className="size-3.5" aria-hidden="true" />
        {t.have}
      </button>
    )
  }

  return (
    <form
      className="promo-form mt-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (value.trim()) void check(value)
      }}
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
          }}
          disabled={pending}
          placeholder={t.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={24}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-10 min-w-0 flex-1 rounded-lg border bg-[#f2f2f2]/5 px-3 font-mono text-sm text-[#f2f2f2] transition-colors outline-none placeholder:text-[#f2f2f2]/40 focus-visible:border-[#ff5900] focus-visible:ring-2 focus-visible:ring-[#ff5900]/40 disabled:opacity-60",
            error ? "border-shell-danger" : "border-[#f2f2f2]/25",
          )}
        />
        <button
          type="submit"
          disabled={pending || !value.trim()}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#f2f2f2]/25 px-3.5 text-sm font-medium text-[#f2f2f2] transition-colors hover:border-[#ff5900] focus-visible:ring-2 focus-visible:ring-[#ff5900] focus-visible:outline-none disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {t.apply}
        </button>
      </div>
      {error ? (
        <p className="text-shell-danger mt-1.5 text-xs" role="alert">
          {t.errors[error]}
        </p>
      ) : null}
    </form>
  )
}
