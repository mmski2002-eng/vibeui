"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Trash2, UserPlus } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { createPartnerInvite, deletePartnerInvite } from "@/lib/admin-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

/** Форма «имя → ссылка». Право проверяется на сервере, здесь только ввод. */
export function CreateInviteForm() {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const [name, setName] = useState("")
  const toast = useToast()
  const [pending, setPending] = useState(false)

  return (
    <form
      className="border-shell-border bg-shell-panel acc-shadow acc-reveal flex flex-wrap items-center gap-2 rounded-2xl border p-4"
      style={{ ["--i" as string]: 1 }}
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        try {
          await createPartnerInvite({ name })
          setName("")
          toast({ title: t.created })
          router.refresh()
        } catch {
          toast({ title: t.failed, tone: "danger" })
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
      <Button
        type="submit"
        variant="primary"
        pending={pending}
        disabled={name.trim().length < 2}
        icon={<UserPlus className="size-4" aria-hidden="true" />}
      >
        {pending ? t.creating : t.create}
      </Button>
    </form>
  )
}

/** Удаление незанятой ссылки. Подтверждение через confirm: действие
 *  редкое, а отдельный диалог ради него — лишний экран. */
export function DeleteInviteButton({ id }: { id: string }) {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const toast = useToast()
  const [pending, setPending] = useState(false)

  return (
    <Button
      size="sm"
      variant="ghost"
      pending={pending}
      title={t.delete}
      icon={<Trash2 className="size-4" aria-hidden="true" />}
      onClick={async () => {
        if (!window.confirm(t.deleteConfirm)) return
        setPending(true)

        try {
          await deletePartnerInvite({ id })
          router.refresh()
        } catch {
          toast({ title: t.failed, tone: "danger" })
        } finally {
          setPending(false)
        }
      }}
    >
      <span className="sr-only">{t.delete}</span>
    </Button>
  )
}
