"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import { createPartnerInvite, deletePartnerInvite } from "@/lib/admin-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none focus-visible:ring-2"

/** Форма «имя → ссылка». Право проверяется на сервере, здесь только ввод. */
export function CreateInviteForm() {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const [name, setName] = useState("")
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<"done" | "failed">()

  return (
    <form
      className="border-shell-border bg-shell-panel flex flex-wrap items-center gap-2 rounded-2xl border p-4"
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)
        setStatus(undefined)

        try {
          await createPartnerInvite({ name })
          setName("")
          setStatus("done")
          router.refresh()
        } catch {
          setStatus("failed")
        } finally {
          setPending(false)
        }
      }}
    >
      <label className="sr-only" htmlFor="partner-name">
        {t.nameLabel}
      </label>
      <input
        id="partner-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t.namePlaceholder}
        maxLength={120}
        required
        minLength={2}
        className={INPUT}
      />
      <button
        type="submit"
        disabled={pending || name.trim().length < 2}
        className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {pending ? t.creating : t.create}
      </button>
      {status ? (
        <p
          role="status"
          className={`w-full text-xs ${status === "done" ? "text-shell-muted" : "text-shell-accent-text"}`}
        >
          {status === "done" ? t.created : t.failed}
        </p>
      ) : null}
    </form>
  )
}

/** Удаление незанятой ссылки. Подтверждение через confirm: действие
 *  редкое, а отдельный диалог ради него — лишний экран. */
export function DeleteInviteButton({ id }: { id: string }) {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      title={t.delete}
      onClick={async () => {
        if (!window.confirm(t.deleteConfirm)) return
        setPending(true)

        try {
          await deletePartnerInvite({ id })
          router.refresh()
        } finally {
          setPending(false)
        }
      }}
      className="border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-45"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="size-3.5" aria-hidden="true" />
      )}
      <span className="sr-only">{t.delete}</span>
    </button>
  )
}
