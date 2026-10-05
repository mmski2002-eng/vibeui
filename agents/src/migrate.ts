import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Database } from "./database.js";

export async function migrate(database: Database): Promise<void> {
  await database`CREATE TABLE IF NOT EXISTS agent_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
  const directory = resolve(process.cwd(), "migrations");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    const applied = await database<{ exists: boolean }[]>`SELECT EXISTS(SELECT 1 FROM agent_migrations WHERE name = ${file}) AS exists`;
    if (applied[0]?.exists) continue;
    const sql = await readFile(resolve(directory, file), "utf8");
    await database.begin(async (transaction) => {
      await transaction.unsafe(sql);
      await transaction`INSERT INTO agent_migrations (name) VALUES (${file})`;
    });
    console.log(`Applied ${file}`);
  }
}
