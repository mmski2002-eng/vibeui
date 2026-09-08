import "server-only"

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/lib/db/schema"

/**
 * Подключение к базе. Соединение открывается при первом запросе, а не при
 * импорте модуля: сборка идёт в GitHub Actions, где базы нет и быть не
 * должно, и падать там из-за отсутствующего DATABASE_URL нечему.
 *
 * Пул маленький намеренно: приложение живёт одним процессом Next standalone,
 * а Postgres стоит на общем VPS рядом с чужими сайтами.
 *
 * Клиент один на процесс: в dev-режиме Next перезагружает модули на каждом
 * изменении, и без кэша на globalThis соединения копились бы до отказа базы.
 */
const globalForDb = globalThis as unknown as {
  vibeuiDb?: PostgresJsDatabase<typeof schema>
}

function connect() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL не задан: без него база недоступна")
  }

  return drizzle(
    postgres(url, { max: 10, idle_timeout: 20, connect_timeout: 10 }),
    { schema },
  )
}

function getDb() {
  globalForDb.vibeuiDb ??= connect()

  return globalForDb.vibeuiDb
}

/**
 * Обращение к базе выглядит как обычный объект drizzle, но настоящий клиент
 * создаётся на первом же вызове.
 */
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, property) {
    return Reflect.get(getDb(), property)
  },
})
