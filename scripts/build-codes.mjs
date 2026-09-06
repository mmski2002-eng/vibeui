// Двухбуквенные коды префиксов каталога: avatar-001 → AV001.
// Коды нужны людям, а не машинам: по ним item называют в разговоре и ищут
// в каталоге. Раз выданный код закреплён навсегда — файл читается перед
// генерацией, и уже назначенные коды не пересматриваются.

import fs from "node:fs"
import path from "node:path"

const OUT = "registry/item-codes.ts"

function prefixes() {
  const found = new Set()

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        walk(full)
        continue
      }

      if (entry.name !== "registry.json") continue

      const registry = JSON.parse(fs.readFileSync(full, "utf8"))

      for (const item of registry.items ?? []) {
        const match = /^(.*?)-\d+$/.exec(item.name)
        found.add(match ? match[1] : item.name)
      }
    }
  }

  walk("registry")

  return [...found].sort()
}

function existing() {
  if (!fs.existsSync(OUT)) return {}

  const source = fs.readFileSync(OUT, "utf8")
  const codes = {}

  // Ключи после Prettier бывают и в кавычках, и без них.
  for (const [, prefix, code] of source.matchAll(
    /"?([a-z0-9-]+)"?: "([A-Z0-9]{2})"/g,
  )) {
    codes[prefix] = code
  }

  return codes
}

/** Кандидаты в код: сначала осмысленные пары, потом что осталось. */
function candidates(prefix) {
  const words = prefix.split("-").filter(Boolean)
  const letters = prefix.replace(/[^a-z]/g, "").toUpperCase()
  const list = []

  if (words.length > 1) {
    list.push((words[0][0] + words[1][0]).toUpperCase())
  }

  for (let index = 1; index < letters.length; index += 1) {
    list.push(letters[0] + letters[index])
  }

  for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    list.push(letters[0] + letter)
  }

  for (const first of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    for (const second of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      list.push(first + second)
    }
  }

  return list
}

const codes = existing()
const taken = new Set(Object.values(codes))
const added = []

for (const prefix of prefixes()) {
  if (codes[prefix]) continue

  const code = candidates(prefix).find((option) => !taken.has(option))

  codes[prefix] = code
  taken.add(code)
  added.push(`${prefix} → ${code}`)
}

const body = Object.keys(codes)
  .sort()
  .map((prefix) => `  "${prefix}": "${codes[prefix]}",`)
  .join("\n")

fs.writeFileSync(
  OUT,
  `// Сгенерировано \`npm run codes\` — руками не править.
// Код закреплён за префиксом навсегда: по нему item называют в переписке.

export const ITEM_CODES: Record<string, string> = {
${body}
}
`,
)

console.log(
  `коды: ${Object.keys(codes).length} префиксов${added.length ? `, новых ${added.length}: ${added.join(", ")}` : ""}`,
)
