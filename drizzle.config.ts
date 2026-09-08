import type { Config } from "drizzle-kit"

/**
 * Миграции лежат файлами в `drizzle/` и применяются шагом деплоя до
 * переключения симлинка релиза: приложение новой версии не должно увидеть
 * старую схему.
 */
export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
} satisfies Config
