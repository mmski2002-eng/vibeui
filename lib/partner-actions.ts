"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { partnerInvite } from "@/lib/db/schema"
import { isPartner } from "@/lib/partners"
import { requireUser } from "@/lib/session"

/** ИНН физлица и самозанятого — двенадцать цифр. */
const INN = /^\d{12}$/

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
