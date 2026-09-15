import { and, eq, lt } from "drizzle-orm"

import { db } from "@/lib/db"
import { subscription } from "@/lib/db/schema"
import { pruneSearchLog } from "@/lib/search-log"

/**
 * Ночное обслуживание подписок. Дёргается systemd-таймером сервера
 * (deploy/vibeui-renew.timer), не изнутри приложения.
 *
 * Автосписаний нет: оплата разовая, за месяц или за год. Права Pro и так
 * вычисляются по дате при каждом запросе (lib/subscription-state), поэтому
 * здесь только приводится в порядок статус в базе — чтобы админка и выборки
 * не считали истёкшие подписки активными — и чистится лог поиска.
 */
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const key = request.headers.get("x-cron-key")

  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return new Response("forbidden\n", { status: 403 })
  }

  const now = new Date()
  const closed = await db
    .update(subscription)
    .set({ status: "expired", updatedAt: now })
    .where(
      and(
        eq(subscription.status, "active"),
        lt(subscription.currentPeriodEnd, now),
      ),
    )
    .returning({ id: subscription.id })

  await pruneSearchLog()

  return Response.json({ closed: closed.length })
}
