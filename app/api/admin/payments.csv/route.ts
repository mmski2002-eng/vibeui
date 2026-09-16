import { and, desc, eq, ilike, or } from "drizzle-orm"

import { isAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { payment, user } from "@/lib/db/schema"

/**
 * Выгрузка платежей за период — для сверки с бухгалтерией.
 *
 * Точка входа отдельная, а не кнопка на странице: файл должен скачиваться
 * обычной ссылкой, без клиентского кода, который собирает строки в память.
 */
function escape(value: string) {
  return `"${value.replace(/"/g, '""')}"`
}

/** Выгрузка считает по живой базе, кешировать её нечего. */
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  // В маршруте отвечаем сами, а не через notFound(): у обработчика запроса
  // нет страницы, на которую можно было бы отрендерить 404.
  if (!(await isAdmin())) {
    return new Response("not found\n", { status: 404 })
  }

  const params = new URL(request.url).searchParams
  const needle = params.get("q")?.trim()
  const status = params.get("status")

  const filters = [
    status && status !== "all" ? eq(payment.status, status) : undefined,
    needle
      ? or(
          ilike(user.email, `%${needle}%`),
          ilike(payment.yookassaId, `%${needle}%`),
          ilike(payment.promoCode, `%${needle}%`),
        )
      : undefined,
  ].filter(Boolean)

  const rows = await db
    .select({
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
      email: user.email,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      yookassaId: payment.yookassaId,
      promoCode: payment.promoCode,
      promoPercent: payment.promoPercent,
      listAmount: payment.listAmount,
    })
    .from(payment)
    .leftJoin(user, eq(user.id, payment.userId))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(payment.createdAt))
    // Верхняя граница осознанная: выгрузка за всю историю на общем сервере
    // читается минутами, а бухгалтерии нужен период.
    .limit(5000)

  const header =
    "created_at,paid_at,email,amount,currency,status,yookassa_id,promo_code,promo_percent,list_amount"
  const body = rows
    .map((row) =>
      [
        row.createdAt.toISOString(),
        row.paidAt?.toISOString() ?? "",
        row.email ?? "",
        row.amount,
        row.currency,
        row.status,
        row.yookassaId,
        row.promoCode ?? "",
        row.promoPercent ?? "",
        row.listAmount ?? "",
      ]
        .map((value) => escape(String(value)))
        .join(","),
    )
    .join("\n")

  return new Response(`${header}\n${body}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="payments-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
