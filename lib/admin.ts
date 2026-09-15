import "server-only"

import { randomUUID } from "node:crypto"
import { notFound } from "next/navigation"

import { db } from "@/lib/db"
import { adminAction } from "@/lib/db/schema"
import { getSession } from "@/lib/session"

/**
 * Кто здесь администратор.
 *
 * Список почт живёт в переменной окружения, а не в базе: администраторов
 * один-два, и роль в таблице пользователей потребовала бы миграции, экрана
 * управления ролями и ответа на вопрос «кто может назначить админа». Цена
 * выбора — нового администратора добавляют правкой /etc/vibeui.env и
 * перезапуском сервиса.
 */
function allowedEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false

  return allowedEmails().includes(email.trim().toLowerCase())
}

/** Есть ли право у текущей сессии. Нужен навигации: она решает, показывать
 *  ли вкладку. Отсутствие вкладки правом не является — см. requireAdmin. */
export async function isAdmin() {
  const session = await getSession()

  return isAdminEmail(session?.user.email)
}

/**
 * Сессия администратора или 404.
 *
 * Именно 404, а не переход на вход: посторонний не должен узнать, что раздел
 * существует. Вызывается в каждой странице админки и в каждом её серверном
 * действии: серверное действие доступно по имени, и «мы не показали кнопку»
 * защитой не является.
 */
export async function requireAdmin() {
  const session = await getSession()

  if (!session || !isAdminEmail(session.user.email)) {
    notFound()
  }

  return session.user
}

export type AdminTarget =
  | "user"
  | "payment"
  | "report"
  | "token"
  | "partner"
  | "setting"

/**
 * Запись в журнал. Пишется после успешного действия: журнал отвечает на
 * вопрос «что случилось», а не «что пытались сделать».
 */
export async function logAdminAction(input: {
  adminEmail: string
  action: string
  targetType: AdminTarget
  targetId: string
  details?: Record<string, unknown>
}) {
  await db.insert(adminAction).values({
    id: randomUUID(),
    adminEmail: input.adminEmail,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    details: input.details ?? null,
  })
}
