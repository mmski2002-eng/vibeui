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

/**
 * Строка подключения. На сборке её нет и быть не должно: runner собирает
 * релиз, база живёт на сервере и слушает только localhost. Клиент postgres.js
 * ничего не открывает до первого запроса, поэтому на этом этапе достаточно
 * любой строки — а вот в рантайме отсутствие переменной должно быть громкой
 * ошибкой, а не невнятным отказом соединения.
 */
function connectionString() {
  const url = process.env.DATABASE_URL

  if (url) {
    return url
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "postgresql://build@127.0.0.1:5432/build"
  }

  throw new Error("DATABASE_URL не задан: без него база недоступна")
}

function connect() {
  return drizzle(
    postgres(connectionString(), {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    }),
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
