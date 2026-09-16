"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Save, Trash2, UserPlus } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import {
  createPartnerInvite,
  deletePartnerInvite,
  setPartnerPromo,
} from "@/lib/admin-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

/** Форма «имя → ссылка». Право проверяется на сервере, здесь только ввод. */
export function CreateInviteForm() {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const [name, setName] = useState("")
  const [promoCode, setPromoCode] = useState("")
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
          await createPartnerInvite({ name, promoCode })
          setName("")
          setPromoCode("")
          toast({ title: t.created })
          router.refresh()
        } catch (error) {
          toast({
            title:
              error instanceof Error && error.message
                ? error.message
                : t.failed,
            tone: "danger",
          })
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
      <label className="sr-only" htmlFor="partner-promo">
        {t.promoCode}
      </label>
      <input
        id="partner-promo"
        value={promoCode}
        onChange={(event) => setPromoCode(event.target.value)}
        placeholder={t.promoPlaceholder}
        maxLength={24}
        autoCapitalize="off"
        spellCheck={false}
        className={`${INPUT} font-mono sm:max-w-48 sm:flex-none`}
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

/**
 * Промокод блогера: ник, свой процент и выключатель. Пустой процент —
 * общий из настроек; он показан рядом как подсказка.
 */
export function PartnerPromoForm({
  id,
  code,
  percent,
  active,
  defaultPercent,
}: {
  id: string
  code: string | null
  percent: number | null
  active: boolean
  defaultPercent: number
}) {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const toast = useToast()
  const [values, setValues] = useState({
    code: code ?? "",
    percent: percent === null ? "" : String(percent),
    active,
  })
  const [pending, setPending] = useState(false)

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        try {
          await setPartnerPromo({ id, ...values })
          toast({ title: t.promoSaved })
          router.refresh()
        } catch (error) {
          toast({
            title:
              error instanceof Error && error.message
                ? error.message
                : t.failed,
            tone: "danger",
          })
        } finally {
          setPending(false)
        }
      }}
    >
      <label className="flex min-w-0 flex-col gap-1">
        <span className="text-shell-muted text-xs">{t.promoCode}</span>
        <input
          value={values.code}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, code: event.target.value }))
          }
          placeholder={t.promoPlaceholder}
          maxLength={24}
          autoCapitalize="off"
          spellCheck={false}
          className={`${INPUT} w-48 flex-none font-mono`}
        />
      </label>
      <label className="flex min-w-0 flex-col gap-1">
        <span className="text-shell-muted text-xs">
          {t.promoPercent}{" "}
          <span className="tabular-nums">
            ({t.promoPercentDefault} {defaultPercent})
          </span>
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={90}
          step={1}
          value={values.percent}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, percent: event.target.value }))
          }
          placeholder={String(defaultPercent)}
          className={`${INPUT} w-28 flex-none tabular-nums`}
        />
      </label>
      <label className="text-shell-fg flex h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, active: event.target.checked }))
          }
          className="accent-shell-accent size-4"
        />
        {t.promoActive}
      </label>
      <Button
        type="submit"
        pending={pending}
        icon={<Save className="size-4" aria-hidden="true" />}
      >
        {pending ? t.promoSaving : t.promoSave}
      </Button>
    </form>
  )
}
