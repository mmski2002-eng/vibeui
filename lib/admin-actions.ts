"use server"

import { revalidatePath } from "next/cache"
import { and, eq, isNull } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { logAdminAction, requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import {
  payment,
  registryToken,
  session,
  subscription,
  usage,
  user,
} from "@/lib/db/schema"
import { currentPeriod } from "@/lib/entitlements"
import { createInvite, deleteInvite } from "@/lib/partners"
import { applyPaymentEvent, grantDays } from "@/lib/payment-apply"
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

export async function setRenewal(input: {
  userId: string
  cancel: boolean
  reason: string
}) {
  const admin = await requireAdmin()
  const reason = requireReason(input.reason)

  await db
    .update(subscription)
    .set({ cancelAtPeriodEnd: input.cancel, updatedAt: new Date() })
    .where(eq(subscription.userId, input.userId))

  await logAdminAction({
    adminEmail: admin.email,
    action: input.cancel ? "user.cancel_renewal" : "user.resume_renewal",
    targetType: "user",
    targetId: input.userId,
    details: { reason },
  })

  refresh(input.userId)
}

/**
 * Блокировка аккаунта: закрывает вход и выдачу исходников, гасит сессии.
 * Разблокировка причину тоже требует — «вернули доступ, потому что» важнее
 * самого факта.
 */
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

/** Ссылка для блогера. Имя — единственное, что о нём известно до регистрации. */
export async function createPartnerInvite(input: { name: string }) {
  const admin = await requireAdmin()
  const name = input.name.trim().slice(0, 120)

  if (name.length < 2) {
    throw new Error("Имя обязательно")
  }

  const invite = await createInvite(name, admin.email)

  await logAdminAction({
    adminEmail: admin.email,
    action: "partner.create",
    targetType: "partner",
    targetId: invite.id,
    details: { name, code: invite.code },
  })

  revalidatePath("/account/admin/partners")

  return invite
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
