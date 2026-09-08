import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/lib/db/schema"

/**
 * Подключение к базе. Пул маленький намеренно: приложение живёт одним
 * процессом Next standalone, а Postgres стоит на общем VPS рядом с чужими
 * сайтами — держать там несколько десятков простаивающих соединений не за что.
 *
 * Клиент один на процесс: в dev-режиме Next перезагружает модули на каждом
 * изменении, и без кэша на globalThis соединения копились бы до отказа базы.
 */
const globalForDb = globalThis as unknown as {
  vibeuiSql?: ReturnType<typeof postgres>
}

function connect() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL не задан: без него база недоступна")
  }

  return postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })
}

const sql = globalForDb.vibeuiSql ?? connect()

if (process.env.NODE_ENV !== "production") {
  globalForDb.vibeuiSql = sql
}

export const db = drizzle(sql, { schema })
