"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { partnerInvite, payoutRequest } from "@/lib/db/schema"
import {
  assignPartnerWord,
  isPartner,
  openPayoutRequest,
  payoutProfile,
  payoutTotals,
} from "@/lib/partners"
import { MIN_PAYOUT } from "@/lib/limits"
import { normalizePromo, promoStats } from "@/lib/promo"
import { requireUser } from "@/lib/session"

/** ИНН физлица и самозанятого — двенадцать цифр. */
const INN = /^\d{12}$/

/**
 * Блогер задаёт своё слово — оно же реф-код ссылки `/?ref=<слово>` и промокод
 * на скидку. Формат как у админа (`normalizePromo`), уникальность и запись в
 * оба поля — в `assignPartnerWord`.
 */
export async function savePartnerWord(input: { code: string }) {
  const user = await requireUser()

  if (!(await isPartner(user.id))) {
    throw new Error("Раздел только для партнёров")
  }

  const code = normalizePromo(input.code)

  if (!code) {
    throw new Error("Слово: латиница, цифры, «-» и «_», 3–24 символа")
  }

  await assignPartnerWord(user.id, code)

  revalidatePath("/account/referrals")
  revalidatePath("/en/account/referrals")
}

/**
 * Блогер сохраняет реквизиты выплаты: ИНН самозанятого (по нему он закроет
 * выплату своим чеком) и куда переводить — карта или телефон для СБП.
 */
export async function savePayoutProfile(input: {
  inn: string
  details: string
}) {
  const user = await requireUser()

  if (!(await isPartner(user.id))) {
    throw new Error("Раздел только для партнёров")
  }

  const inn = input.inn.trim()

  if (inn && !INN.test(inn)) {
    throw new Error("ИНН — 12 цифр")
  }

  const details = input.details.trim().slice(0, 200)

  await db
    .update(partnerInvite)
    .set({ payoutInn: inn || null, payoutDetails: details || null })
    .where(eq(partnerInvite.claimedBy, user.id))

  revalidatePath("/account/referrals")
  revalidatePath("/en/account/referrals")
}

/**
 * Блогер подаёт заявку на вывод «к выплате». Одна открытая заявка за раз;
 * сумма и реквизиты проверяются на сервере, чтобы заявку нельзя было подать
 * на воздух. Сумма замораживается в заявке — дальнейшее начисление её не
 * меняет.
 */
export async function requestPayout() {
  const user = await requireUser()

  if (!(await isPartner(user.id))) {
    throw new Error("Раздел только для партнёров")
  }

  if (await openPayoutRequest(user.id)) {
    throw new Error("Заявка уже на рассмотрении")
  }

  const profile = await payoutProfile(user.id)

  if (!profile.inn || !profile.details) {
    throw new Error("Сначала заполните реквизиты выплаты")
  }

  const [stats, paid] = await Promise.all([
    promoStats(user.id),
    payoutTotals(user.id),
  ])
  const pending = stats.commission - paid.paid

  if (pending < MIN_PAYOUT) {
    throw new Error(`К выводу доступно от ${MIN_PAYOUT} ₽`)
  }

  await db.insert(payoutRequest).values({
    id: randomUUID(),
    partnerId: user.id,
    amount: String(pending),
  })

  revalidatePath("/account/referrals")
  revalidatePath("/en/account/referrals")
  revalidatePath("/account/admin/payouts")
}
