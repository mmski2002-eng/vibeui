"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { and, eq, isNull } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { logAdminAction, requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import {
  partnerInvite,
  partnerPayout,
  payoutRequest,
  payment,
  registryToken,
  session,
  setting,
  subscription,
  usage,
  user,
} from "@/lib/db/schema"
import { currentPeriod } from "@/lib/entitlements"
import {
  assignPartnerWord,
  createInvite,
  deleteInvite,
  wordTaken,
} from "@/lib/partners"
import { applyPaymentEvent, grantDays } from "@/lib/payment-apply"
import { PRICE_KEYS } from "@/lib/plan-prices"
import {
  COMMISSION_PERCENT_KEY,
  isPromoPercent,
  normalizePromo,
  PROMO_PERCENT_KEY,
} from "@/lib/promo"
import { fetchPayment } from "@/lib/yookassa"

/**
 * Действия администратора над чужими аккаунтами и платежами.
 *
 * Три правила на весь файл: право спрашивается заново в каждом действии,
 * причина обязательна там, где действие меняет доступ или деньги, и всё
 * пишется в журнал. Спрятанная кнопка защитой не является — серверное
 * действие вызывается по имени.
 */

function refresh(userId?: string) {
  revalidatePath("/account/admin")
  revalidatePath("/account/admin/users")
  revalidatePath("/account/admin/payments")
  revalidatePath("/account/admin/log")

  if (userId) {
    revalidatePath(`/account/admin/users/${userId}`)
  }
}

function requireReason(reason: string) {
  const text = reason.trim()

  if (text.length < 3) {
    throw new Error("Причина обязательна")
  }

  return text.slice(0, 500)
}

/** Выдать или продлить Pro. Записывается бонусными днями — списаний по ним
 *  не бывает, и в кабинете человека это видно честно. */
export async function grantProDays(input: {
  userId: string
  days: number
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)
  const days = Math.min(365, Math.max(1, Math.round(input.days)))

  await grantDays(input.userId, days)
  await logAdminAction({
    adminEmail: admin.email,
    action: "user.grant_pro",
    targetType: "user",
    targetId: input.userId,
    details: { days, reason },
  })

  refresh(input.userId)
}

export async function setBlocked(input: {
  userId: string
  blocked: boolean
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)

  await db
    .update(user)
    .set({
      blockedAt: input.blocked ? new Date() : null,
      blockedReason: input.blocked ? reason : null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, input.userId))

  if (input.blocked) {
    await db.delete(session).where(eq(session.userId, input.userId))
  }

  await logAdminAction({
    adminEmail: admin.email,
    action: input.blocked ? "user.block" : "user.unblock",
    targetType: "user",
    targetId: input.userId,
    details: { reason },
  })

  refresh(input.userId)
}

/** Отозвать все действующие ключи установки — при утечке ключа наружу. */
export async function revokeUserTokens(input: {
  userId: string
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)

  await db
    .update(registryToken)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(registryToken.userId, input.userId),
        isNull(registryToken.revokedAt),
      ),
    )

  await logAdminAction({
    adminEmail: admin.email,
    action: "user.revoke_tokens",
    targetType: "user",
    targetId: input.userId,
    details: { reason },
  })

  refresh(input.userId)
}

/** Сбросить расход текущего месяца: компенсация за наш сбой. */
export async function resetMonthlyLimit(input: {
  userId: string
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)
  const period = currentPeriod()

  await db
    .delete(usage)
    .where(and(eq(usage.userId, input.userId), eq(usage.period, period)))

  await logAdminAction({
    adminEmail: admin.email,
    action: "user.reset_limit",
    targetType: "user",
    targetId: input.userId,
    details: { reason, period },
  })

  refresh(input.userId)
}

/** Подтвердить почту вручную: когда письма не доходят, а владение адресом
 *  доказано перепиской. */
export async function verifyEmailManually(input: {
  userId: string
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)

  await db
    .update(user)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(user.id, input.userId))

  await logAdminAction({
    adminEmail: admin.email,
    action: "user.verify_email",
    targetType: "user",
    targetId: input.userId,
    details: { reason },
  })

  refresh(input.userId)
}

/** Отправить письмо подтверждения повторно — от лица поддержки. */
export async function resendVerification(input: { userId: string }) {
  const admin = await requireAdmin()

  const [target] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, input.userId))
    .limit(1)

  if (!target) {
    throw new Error("Пользователь не найден")
  }

  await auth.api.sendVerificationEmail({
    body: { email: target.email, callbackURL: "/verify?state=done" },
  })

  await logAdminAction({
    adminEmail: admin.email,
    action: "user.resend_verification",
    targetType: "user",
    targetId: input.userId,
  })

  refresh(input.userId)
}

/** Завершить все сессии — по просьбе владельца аккаунта. */
export async function signOutEverywhere(input: {
  userId: string
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)

  await db.delete(session).where(eq(session.userId, input.userId))

  await logAdminAction({
    adminEmail: admin.email,
    action: "user.sign_out_all",
    targetType: "user",
    targetId: input.userId,
    details: { reason },
  })

  refresh(input.userId)
}

/** Внутренняя заметка о пользователе. Пользователю не показывается. */
export async function saveUserNote(input: { userId: string; note: string }) {
  const admin = await requireAdmin()
  const note = input.note.trim().slice(0, 2000)

  await db
    .update(user)
    .set({ adminNote: note || null, updatedAt: new Date() })
    .where(eq(user.id, input.userId))

  await logAdminAction({
    adminEmail: admin.email,
    action: "user.note",
    targetType: "user",
    targetId: input.userId,
  })

  refresh(input.userId)
}

/**
 * Сверить платёж с ЮKassa. Источник правды о деньгах — платёжный сервис, а
 * не наша таблица: вебхук мог не дойти.
 */
export async function syncPayment(input: { paymentId: string }) {
  const admin = await requireAdmin()

  const [row] = await db
    .select()
    .from(payment)
    .where(eq(payment.id, input.paymentId))
    .limit(1)

  if (!row) {
    throw new Error("Платёж не найден")
  }

  const fresh = await fetchPayment(row.yookassaId)

  await db
    .update(payment)
    .set({
      status: fresh.status,
      paidAt: fresh.status === "succeeded" ? (row.paidAt ?? new Date()) : null,
      payload: fresh as unknown as Record<string, unknown>,
    })
    .where(eq(payment.id, row.id))

  await logAdminAction({
    adminEmail: admin.email,
    action: "payment.sync",
    targetType: "payment",
    targetId: row.id,
    details: { status: fresh.status },
  })

  refresh(row.userId)

  return fresh.status
}

/**
 * Применить событие заново: прогнать сохранённый ответ ЮKassa через тот же
 * код, что и вебхук. Нужно, когда деньги прошли, а подписка не продлилась.
 */
export async function replayPayment(input: { paymentId: string }) {
  const admin = await requireAdmin()

  const [row] = await db
    .select()
    .from(payment)
    .where(eq(payment.id, input.paymentId))
    .limit(1)

  if (!row?.payload) {
    throw new Error("У платежа нет сохранённого ответа ЮKassa")
  }

  const result = await applyPaymentEvent(
    row.payload as Parameters<typeof applyPaymentEvent>[0],
    { force: true },
  )

  await logAdminAction({
    adminEmail: admin.email,
    action: "payment.replay",
    targetType: "payment",
    targetId: row.id,
    details: result as unknown as Record<string, unknown>,
  })

  refresh(row.userId)

  return result
}

/**
 * Пометить платёж возвращённым. Сам возврат делается в кабинете ЮKassa:
 * кнопки, двигающей чужие деньги из нашего кода, здесь намеренно нет.
 */
export async function markRefunded(input: {
  paymentId: string
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)

  const [row] = await db
    .select({ id: payment.id, userId: payment.userId })
    .from(payment)
    .where(eq(payment.id, input.paymentId))
    .limit(1)

  if (!row) {
    throw new Error("Платёж не найден")
  }

  await db
    .update(payment)
    .set({ status: "refunded" })
    .where(eq(payment.id, row.id))

  await logAdminAction({
    adminEmail: admin.email,
    action: "payment.mark_refunded",
    targetType: "payment",
    targetId: row.id,
    details: { reason },
  })

  refresh(row.userId)
}

/**
 * Ссылка на чек из «Мой налог». Пустая строка стирает ссылку. Только https:
 * ссылку откроет человек из своего кабинета, и вести она должна на сайт
 * налоговой, а не куда попало.
 */
export async function setReceiptUrl(input: { paymentId: string; url: string }) {
  const admin = await requireAdmin()
  const url = input.url.trim().slice(0, 500)

  if (url !== "" && !/^https:\/\/[^\s]+$/i.test(url)) {
    throw new Error("Ссылка должна начинаться с https://")
  }

  const updated = await db
    .update(payment)
    .set({ receiptUrl: url || null })
    .where(eq(payment.id, input.paymentId))
    .returning({ userId: payment.userId })

  if (updated.length === 0) {
    throw new Error("Платёж не найден")
  }

  await logAdminAction({
    adminEmail: admin.email,
    action: "payment.receipt",
    targetType: "payment",
    targetId: input.paymentId,
    details: { url: url || null },
  })

  refresh(updated[0]?.userId)
  revalidatePath(`/account/admin/payments/${input.paymentId}`)
  revalidatePath("/account/payments")
}

/** Ссылка для блогера. Имя и, если известен, ник для промокода. */
export async function createPartnerInvite(input: { name: string; promoCode?: string }) {
  const admin = await requireAdmin()
  const name = input.name.trim().slice(0, 120)

  if (name.length < 2) {
    throw new Error("Имя обязательно")
  }

  // НИК блогера — единое слово: и код реф-ссылки приглашения, и промокод.
  // Уникально на всю программу. Без ника — случайный код приглашения.
  const nick = input.promoCode?.trim() ? promoCodeOrThrow(input.promoCode) : null

  if (nick && (await wordTaken(nick))) {
    throw new Error("Такой код уже занят")
  }

  const invite = await createInvite(name, admin.email, nick ?? undefined)

  if (nick) {
    await db
      .update(partnerInvite)
      .set({ promoCode: nick })
      .where(eq(partnerInvite.id, invite.id))
  }

  await logAdminAction({
    adminEmail: admin.email,
    action: "partner.create",
    targetType: "partner",
    targetId: invite.id,
    details: { name, code: invite.code, promoCode: nick },
  })

  revalidatePath("/account/admin/partners")

  return invite
}

/**
 * Промокод блогера: ник, свой процент (пусто — общий) и выключатель.
 * Смена кода старые платежи не трогает: доля считается по partner_id.
 */
export async function setPartnerPromo(input: {
  id: string
  code: string
  percent: string
  active: boolean
}) {
  const admin = await requireAdmin()
  const word = input.code.trim() ? promoCodeOrThrow(input.code) : null
  const percentRaw = input.percent.trim()
  const percent = percentRaw ? Number(percentRaw) : null

  if (percent !== null && !isPromoPercent(percent)) {
    throw new Error("Процент: целое число от 1 до 90")
  }

  const [invite] = await db
    .select({
      claimedBy: partnerInvite.claimedBy,
      code: partnerInvite.code,
      promoCode: partnerInvite.promoCode,
    })
    .from(partnerInvite)
    .where(eq(partnerInvite.id, input.id))
    .limit(1)

  if (!invite) {
    throw new Error("Приглашение не найдено")
  }

  // Слово блогера ведёт себя одинаково для блогера и админа: у занятого
  // приглашения переименовывает реф-код и промокод, у незанятого — код
  // приглашения и промокод. Пусто — снять промокод.
  if (word) {
    if (invite.claimedBy) {
      await assignPartnerWord(invite.claimedBy, word)
    } else {
      const self = word === invite.code || word === invite.promoCode

      if (!self && (await wordTaken(word))) {
        throw new Error("Такой код уже занят другим блогером")
      }

      await db
        .update(partnerInvite)
        .set({ code: word, promoCode: word })
        .where(eq(partnerInvite.id, input.id))
    }
  } else {
    await db
      .update(partnerInvite)
      .set({ promoCode: null })
      .where(eq(partnerInvite.id, input.id))
  }

  await db
    .update(partnerInvite)
    .set({ promoPercent: percent, promoActive: input.active })
    .where(eq(partnerInvite.id, input.id))

  await logAdminAction({
    adminEmail: admin.email,
    action: "partner.promo",
    targetType: "partner",
    targetId: input.id,
    details: { code: word, percent, active: input.active },
  })

  revalidatePath("/account/admin/partners")
  revalidatePath(`/account/admin/partners/${input.id}`)
  revalidatePath("/account/referrals")
  revalidatePath("/pricing")
  revalidatePath("/en/pricing")
}

function promoCodeOrThrow(raw: string) {
  const code = normalizePromo(raw)

  if (!code) {
    throw new Error("Промокод: латиница, цифры, «-» и «_», от 3 до 24 символов")
  }

  return code
}

/**
 * Записать выплату комиссии блогеру. Деньги уходят вне платформы (перевод по
 * реквизитам), сюда вносится факт: реестр показывает блогеру «выплачено» и
 * «к выплате». Требует partnerId — аккаунт зарегистрировавшегося блогера.
 */
export async function recordPartnerPayout(input: {
  partnerId: string
  amount: string
  note: string
}) {
  const admin = await requireAdmin()
  const amount = rublesOrThrow(input.amount, "Сумма выплаты")
  const note = input.note.trim().slice(0, 500) || null

  await db.insert(partnerPayout).values({
    id: randomUUID(),
    partnerId: input.partnerId,
    amount,
    note,
    createdBy: admin.email,
  })

  await logAdminAction({
    adminEmail: admin.email,
    action: "partner.payout",
    targetType: "partner",
    targetId: input.partnerId,
    details: { amount, note },
  })

  revalidatePath("/account/admin/partners")
  revalidatePath("/account/referrals")
}

/**
 * Заявка блогера на вывод проходит три шага у администратора:
 *
 * - `approve` — согласовать (pending → approved): деньги ещё не ушли;
 * - `pay` — отметить выплату (approved → paid), обязательно приложив ссылку
 *   на чек блогера из «Мой налог»; создаётся запись partner_payout;
 * - `reject` — отклонить (из pending или approved).
 *
 * Переходы защищены проверкой текущего статуса в WHERE: параллельное решение
 * второй вкладкой ничего не сломает.
 */
export async function resolvePayoutRequest(input: {
  id: string
  action: "approve" | "pay" | "reject"
  receipt?: string
  note: string
}) {
  const admin = await requireAdmin()
  const note = input.note.trim().slice(0, 500) || null

  const [request] = await db
    .select()
    .from(payoutRequest)
    .where(eq(payoutRequest.id, input.id))
    .limit(1)

  if (!request) {
    throw new Error("Заявка не найдена")
  }

  if (input.action === "approve") {
    if (request.status !== "pending") {
      throw new Error("Согласовать можно только новую заявку")
    }

    await db
      .update(payoutRequest)
      .set({ status: "approved", approvedAt: new Date(), approvedBy: admin.email, note })
      .where(and(eq(payoutRequest.id, input.id), eq(payoutRequest.status, "pending")))
  } else if (input.action === "pay") {
    if (request.status !== "approved") {
      throw new Error("Сначала согласуйте заявку")
    }

    const receipt = (input.receipt ?? "").trim()

    if (!/^https:\/\/[^\s]+$/i.test(receipt)) {
      throw new Error("Приложите ссылку на чек (https://)")
    }

    await db.insert(partnerPayout).values({
      id: randomUUID(),
      partnerId: request.partnerId,
      amount: request.amount,
      note: note ?? receipt,
      createdBy: admin.email,
    })

    await db
      .update(payoutRequest)
      .set({
        status: "paid",
        receiptUrl: receipt,
        note,
        resolvedAt: new Date(),
        resolvedBy: admin.email,
      })
      .where(and(eq(payoutRequest.id, input.id), eq(payoutRequest.status, "approved")))
  } else {
    if (request.status !== "pending" && request.status !== "approved") {
      throw new Error("Заявка уже закрыта")
    }

    await db
      .update(payoutRequest)
      .set({ status: "rejected", note, resolvedAt: new Date(), resolvedBy: admin.email })
      .where(eq(payoutRequest.id, input.id))
  }

  await logAdminAction({
    adminEmail: admin.email,
    action: `partner.payout_${input.action}`,
    targetType: "partner",
    targetId: request.partnerId,
    details: { requestId: request.id, amount: request.amount, note },
  })

  revalidatePath("/account/admin/payouts")
  revalidatePath("/account/admin/partners")
  revalidatePath("/account/referrals")
}

/** Удалить незанятое приглашение: занятое хранит аккаунт и его рефералов. */
export async function deletePartnerInvite(input: { id: string }) {
  const admin = await requireAdmin()
  const deleted = await deleteInvite(input.id)

  if (!deleted) {
    throw new Error("Приглашение уже использовано")
  }

  await logAdminAction({
    adminEmail: admin.email,
    action: "partner.delete",
    targetType: "partner",
    targetId: input.id,
  })

  revalidatePath("/account/admin/partners")
}

function rublesOrThrow(value: string, label: string) {
  const amount = Number(value.trim())

  if (!Number.isInteger(amount) || amount < 1 || amount > 1_000_000) {
    throw new Error(`${label}: нужно целое число рублей`)
  }

  return String(amount)
}

/**
 * Цены Pro. Хранятся в рублях без копеек; в платёж уходят как `N.00`.
 * Энтерпрайз отдельно не задаётся — он всегда вдвое дороже Pro.
 */
export async function setPlanPrices(input: {
  monthly: string
  yearly: string
  promoPercent?: string
  commissionPercent?: string
}) {
  const admin = await requireAdmin()
  const monthly = rublesOrThrow(input.monthly, "Месяц")
  const yearly = rublesOrThrow(input.yearly, "Год")
  const promoPercent = Number(input.promoPercent?.trim())
  const commissionPercent = Number(input.commissionPercent?.trim())

  if (input.promoPercent !== undefined && !isPromoPercent(promoPercent)) {
    throw new Error("Скидка по промокоду: целое число процентов от 1 до 90")
  }

  if (
    input.commissionPercent !== undefined &&
    !isPromoPercent(commissionPercent)
  ) {
    throw new Error("Комиссия блогера: целое число процентов от 1 до 90")
  }

  const entries: (readonly [string, string])[] = [
    [PRICE_KEYS.monthly, monthly],
    [PRICE_KEYS.yearly, yearly],
  ]

  if (input.promoPercent !== undefined) {
    entries.push([PROMO_PERCENT_KEY, String(promoPercent)])
  }

  if (input.commissionPercent !== undefined) {
    entries.push([COMMISSION_PERCENT_KEY, String(commissionPercent)])
  }

  for (const [key, value] of entries) {
    await db
      .insert(setting)
      .values({ key, value })
      .onConflictDoUpdate({
        target: setting.key,
        set: { value, updatedAt: new Date() },
      })
  }

  await logAdminAction({
    adminEmail: admin.email,
    action: "setting.prices",
    targetType: "setting",
    targetId: "prices",
    details: {
      monthly,
      yearly,
      promoPercent: input.promoPercent,
      commissionPercent: input.commissionPercent,
    },
  })

  for (const path of ["/", "/en", "/pricing", "/en/pricing", "/account/admin/payments"]) {
    revalidatePath(path)
  }
}
