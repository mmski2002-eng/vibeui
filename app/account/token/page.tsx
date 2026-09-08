import { desc, eq } from "drizzle-orm"

import { TokenPanel } from "@/components/account/token-panel"
import { db } from "@/lib/db"
import { registryToken } from "@/lib/db/schema"
import { isPro } from "@/lib/entitlements"
import { requireUser } from "@/lib/session"

export default async function TokenPage() {
  const user = await requireUser()
  const [pro, tokens] = await Promise.all([
    isPro(user.id),
    db
      .select()
      .from(registryToken)
      .where(eq(registryToken.userId, user.id))
      .orderBy(desc(registryToken.createdAt))
      .limit(5),
  ])

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Ключ установки
      </h1>
      <p className="text-shell-muted mt-2 max-w-2xl text-sm leading-relaxed">
        Ключ нужен, чтобы shadcn CLI мог поставить закрытые компоненты: он ходит
        по адресу и не знает про вашу сессию в браузере.
      </p>

      <TokenPanel
        pro={pro}
        tokens={tokens.map((token) => ({
          id: token.id,
          prefix: token.prefix,
          createdAt: token.createdAt.toLocaleDateString("ru-RU"),
          lastUsedAt: token.lastUsedAt?.toLocaleDateString("ru-RU") ?? null,
          revoked: Boolean(token.revokedAt),
        }))}
      />
    </>
  )
}
