"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { savePartnerWord } from "@/lib/partner-actions"

export type PromoCodeLabels = {
  label: string
  placeholder: string
  hint: string
  save: string
  saving: string
  saved: string
  failed: string
}

/**
 * Блогер задаёт своё слово — реф-код ссылки `/?ref=<слово>` и промокод на
 * скидку одновременно. Префикс ссылки показан слева от поля, чтобы слово
 * читалось как часть адреса. Уникальность и формат проверяет сервер.
 */
export function PromoCodeForm({
  code,
  prefix,
  labels: t,
}: {
  code: string
  /** Начало ссылки, напр. `vibeui.ru/?ref=`. Только для показа. */
  prefix?: string
  labels: PromoCodeLabels
}) {
  const router = useRouter()
  const toast = useToast()
  const [value, setValue] = useState(code)
  const [pending, setPending] = useState(false)

  return (
    <form
      className="grid gap-2"
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        try {
          await savePartnerWord({ code: value })
          toast({ title: t.saved })
          router.refresh()
        } catch (error) {
          toast({
            title:
              error instanceof Error && error.message ? error.message : t.failed,
            tone: "danger",
          })
        } finally {
          setPending(false)
        }
      }}
    >
      <label className="text-shell-muted text-xs" htmlFor="partner-word">
        {t.label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <div className="border-shell-border bg-shell-elevated focus-within:border-shell-accent focus-within:ring-shell-ring flex h-11 w-full items-center overflow-hidden rounded-lg border pl-3 transition-colors focus-within:ring-2 sm:w-auto">
          {prefix ? (
            <span className="text-shell-muted shrink-0 font-mono text-sm select-none">
              {prefix}
            </span>
          ) : null}
          <input
            id="partner-word"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t.placeholder}
            maxLength={24}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="text-shell-fg placeholder:text-shell-muted h-full w-40 min-w-0 flex-1 bg-transparent px-1 font-mono text-sm font-medium outline-none"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          pending={pending}
          icon={<Save className="size-4" aria-hidden="true" />}
        >
          {pending ? t.saving : t.save}
        </Button>
      </div>
      <p className="text-shell-muted text-xs">{t.hint}</p>
    </form>
  )
}
