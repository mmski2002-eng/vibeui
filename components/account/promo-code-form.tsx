"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { savePartnerWord } from "@/lib/partner-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-11 min-w-0 flex-1 rounded-lg border px-3 font-mono text-sm outline-none transition-colors focus-visible:ring-2"

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
 * скидку одновременно. Уникальность и формат проверяет сервер.
 */
export function PromoCodeForm({
  code,
  labels: t,
}: {
  code: string
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
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-shell-muted text-xs">{t.label}</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t.placeholder}
            maxLength={24}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={`${INPUT} sm:min-w-64`}
          />
        </label>
        <Button
          type="submit"
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
