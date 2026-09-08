import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

/**
 * Применение миграций при деплое: запускается на сервере до переключения
 * симлинка, чтобы новая версия приложения не увидела старую схему.
 *
 * Один коннект и он же закрывается: скрипт живёт секунды, пул здесь не нужен.
 */
const url = process.env.DATABASE_URL

if (!url) {
  console.error("DATABASE_URL не задан — миграции пропущены")
  process.exit(1)
}

const sql = postgres(url, { max: 1 })

await migrate(drizzle(sql), { migrationsFolder: "./drizzle" })
await sql.end()

console.log("✓ миграции применены")
