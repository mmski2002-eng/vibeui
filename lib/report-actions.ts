"use server"

import { randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { and, desc, eq, gte } from "drizzle-orm"

import { logAdminAction, requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { report, reportMessage } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { sendMail } from "@/lib/mail"
import type {
  CreateReportResult,
  ReportKind,
  ReportStatus,
} from "@/lib/report-types"
import { SITE_URL } from "@/lib/seo"
import { getSession } from "@/lib/session"
import { hashToken } from "@/lib/token"

/**
 * Обращения: приём от людей и разбор администратором.
 *
 * Один поток на три вида (проблема с компонентом, поддержка, права): у них
 * общий жизненный цикл, а различает их `kind`. Переписка хранится у нас, а
 * не только в почтовом ящике заявителя.
 */

/** Сколько обращений принимаем с одного адреса за десять минут. */
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT = 3

function clean(value: string, max: number) {
  return value.trim().slice(0, max)
}

async function ipFingerprint() {
  const requestHeaders = await headers()
  const forwarded = requestHeaders.get("x-forwarded-for") ?? ""
  const ip = forwarded.split(",")[0]?.trim()

  // Храним отпечаток, а не адрес: для ограничения частоты этого достаточно,
  // а держать IP заявителя дольше нужного незачем.
  return ip ? hashToken(ip) : null
}

export async function createReport(input: {
  kind: ReportKind
  subject: string
  message: string
  email?: string
  itemName?: string
  locale?: Locale
}): Promise<CreateReportResult> {
  const session = await getSession()
  const subject = clean(input.subject, 200)
  const message = clean(input.message, 4000)
  const email = clean(input.email ?? session?.user.email ?? "", 200)

  if (subject.length < 3 || message.length < 20 || !email.includes("@")) {
    return { ok: false, reason: "invalid" }
  }

  const ipHash = await ipFingerprint()
  const since = new Date(Date.now() - RATE_WINDOW_MS)

  // Ограничение частоты: по аккаунту, а для анонимной формы — по отпечатку
  // адреса. Капчу не ставим, пока не увидим настоящий поток спама.
  const recent = await db
    .select({ id: report.id })
    .from(report)
    .where(
      session?.user.id
        ? and(eq(report.userId, session.user.id), gte(report.createdAt, since))
        : ipHash
          ? and(eq(report.ipHash, ipHash), gte(report.createdAt, since))
          : gte(report.createdAt, since),
    )
    .limit(RATE_LIMIT)

  if (recent.length >= RATE_LIMIT) {
    return { ok: false, reason: "rate" }
  }

  const id = randomUUID()

  await db.insert(report).values({
    id,
    kind: input.kind,
    subject,
    message,
    itemName: input.itemName ? clean(input.itemName, 100) : null,
    userId: session?.user.id ?? null,
    email,
    locale: input.locale ?? "ru",
    ipHash,
  })

  await db.insert(reportMessage).values({
    id: randomUUID(),
    reportId: id,
    authorType: "user",
    authorEmail: email,
    body: message,
  })

  await notifyAdmins({ id, kind: input.kind, subject, email })

  revalidatePath("/account/admin/reports")

  return { ok: true }
}

/**
 * Письмо администраторам о новом обращении. Без него очередь надо смотреть
 * глазами, а «пришло вчера, увидели через неделю» — самый частый способ
 * потерять человека.
 */
async function notifyAdmins(input: {
  id: string
  kind: ReportKind
  subject: string
  email: string
}) {
  const recipients = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  if (recipients.length === 0) return

  const kinds: Record<ReportKind, string> = {
    component: "компонент",
    support: "поддержка",
    legal: "права",
  }

  await sendMail({
    to: recipients.join(", "),
    subject: `Новое обращение (${kinds[input.kind]}): ${input.subject}`,
    text: [
      `Вид: ${kinds[input.kind]}`,
      `От: ${input.email}`,
      `Тема: ${input.subject}`,
      "",
      `${SITE_URL}/account/admin/reports/${input.id}`,
    ].join("\n"),
  })
}

function refreshReport(id: string) {
  revalidatePath("/account/admin/reports")
  revalidatePath(`/account/admin/reports/${id}`)
  revalidatePath("/account/admin/log")
}

/** Ответ заявителю: уходит письмом и остаётся в переписке. */
export async function replyToReport(input: { id: string; body: string }) {
  const admin = await requireAdmin()
  const body = clean(input.body, 4000)

  if (body.length < 2) {
    throw new Error("Пустой ответ")
  }

  const [row] = await db
    .select()
    .from(report)
    .where(eq(report.id, input.id))
    .limit(1)

  if (!row) {
    throw new Error("Обращение не найдено")
  }

  let delivered = false

  try {
    await sendMail({
      to: row.email,
      subject: `Ответ на обращение: ${row.subject}`,
      text: `${body}\n\n—\nVibeUI · ${SITE_URL}`,
    })
    delivered = true
  } catch {
    // Письмо не ушло — ответ всё равно сохраняем: иначе администратор не
    // поймёт, отвечал он уже или нет.
  }

  await db.insert(reportMessage).values({
    id: randomUUID(),
    reportId: row.id,
    authorType: "admin",
    authorEmail: admin.email,
    body,
    deliveredByEmail: delivered,
  })

  await db
    .update(report)
    .set({ status: "answered", updatedAt: new Date() })
    .where(eq(report.id, row.id))

  await logAdminAction({
    adminEmail: admin.email,
    action: "report.reply",
    targetType: "report",
    targetId: row.id,
    details: { delivered },
  })

  refreshReport(row.id)

  return delivered
}

/** Внутренняя заметка: заявителю не видна и письмом не уходит. */
export async function addReportNote(input: { id: string; body: string }) {
  const admin = await requireAdmin()
  const body = clean(input.body, 2000)

  if (body.length < 2) {
    throw new Error("Пустая заметка")
  }

  await db.insert(reportMessage).values({
    id: randomUUID(),
    reportId: input.id,
    authorType: "note",
    authorEmail: admin.email,
    body,
  })

  await logAdminAction({
    adminEmail: admin.email,
    action: "report.note",
    targetType: "report",
    targetId: input.id,
  })

  refreshReport(input.id)
}

export async function setReportStatus(input: {
  id: string
  status: ReportStatus
}) {
  const admin = await requireAdmin()

  await db
    .update(report)
    .set({
      status: input.status,
      updatedAt: new Date(),
      closedAt:
        input.status === "closed" || input.status === "spam"
          ? new Date()
          : null,
    })
    .where(eq(report.id, input.id))

  await logAdminAction({
    adminEmail: admin.email,
    action: "report.status",
    targetType: "report",
    targetId: input.id,
    details: { status: input.status },
  })

  refreshReport(input.id)
}

/** Взять обращение себе: чтобы двое не отвечали одному человеку сразу. */
export async function assignReport(input: { id: string }) {
  const admin = await requireAdmin()

  await db
    .update(report)
    .set({
      assigneeEmail: admin.email,
      status: "in_progress",
      updatedAt: new Date(),
    })
    .where(eq(report.id, input.id))

  await logAdminAction({
    adminEmail: admin.email,
    action: "report.assign",
    targetType: "report",
    targetId: input.id,
  })

  refreshReport(input.id)
}

/** Переписка обращения: нужна карточке. */
export async function reportThread(id: string) {
  await requireAdmin()

  return db
    .select()
    .from(reportMessage)
    .where(eq(reportMessage.reportId, id))
    .orderBy(desc(reportMessage.createdAt))
    .limit(100)
}
