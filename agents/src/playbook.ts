import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { Config } from "./config.js";
import type { Database } from "./database.js";

export interface Playbook { id: string; locked: string; experience: string; author: string; reason: string | null; created_at: Date }

const marker = "<!-- опыт -->";

export function splitPlaybook(text: string): { locked: string; experience: string } {
  const [locked = "", experience = ""] = text.split(marker);
  return { locked: locked.trim(), experience: experience.trim() };
}

export function playbookText(playbook: Pick<Playbook, "locked" | "experience">): string {
  return `${playbook.locked}\n\n${playbook.experience}`;
}

// The file in the repository is only the seed: once the table has a version, the database is the source.
export async function currentPlaybook(database: Database, config: Config): Promise<Playbook> {
  const latest = (await database<Playbook[]>`SELECT * FROM playbook_versions ORDER BY created_at DESC LIMIT 1`)[0];
  if (latest) return latest;
  const seed = splitPlaybook(await readFile(join(dirname(config.policyPath), "playbook.md"), "utf8").catch(() => ""));
  return savePlaybook(database, { ...seed, author: "seed", reason: "Начальная версия из policy/playbook.md" });
}

export async function savePlaybook(database: Database, input: { locked: string; experience: string; author: string; reason: string | null }): Promise<Playbook> {
  const rows = await database<Playbook[]>`
    INSERT INTO playbook_versions (id, locked, experience, author, reason)
    VALUES (${randomUUID()}, ${input.locked}, ${input.experience}, ${input.author}, ${input.reason}) RETURNING *
  `;
  return rows[0]!;
}

// Learning may reword experience but must not bring in money, percentages or links the owner never wrote.
export function unknownFacts(locked: string, experience: string): string[] {
  const tokens = experience.match(/https?:\/\/\S+|\$\s?\d[\d.,]*|\d[\d.,]*\s?(?:%|\$|₽|USDC|руб)/gi) ?? [];
  const known = locked.replace(/\s+/g, "");
  return [...new Set(tokens.map((token) => token.replace(/[).,;:]+$/, "")))].filter((token) => !known.includes(token.replace(/\s+/g, "")));
}
