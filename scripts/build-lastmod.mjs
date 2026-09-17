import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"

/**
 * Карта «страница → дата последнего изменения» для sitemap.
 *
 * Раньше sitemap ставил `lastModified: new Date()` на все URL при каждой
 * сборке — Google получал сигнал «изменилось всё» и тратил бюджет обхода на
 * переобход неизменного (88% запросов — «Обновление»), вместо новых страниц.
 * Дата берётся из git: последний коммит, тронувший файлы item'а. Между
 * деплоями она стабильна, поэтому неизменные страницы Google перестаёт
 * перепроверять.
 *
 * Требует полной истории git (в CI — `fetch-depth: 0`). Без git карта пустая,
 * sitemap откатывается на дату сборки — то есть на прежнее поведение.
 *
 * Запуск: `npm run lastmod`. Гоняется в `build` перед `next build`.
 */

const ROOT = process.cwd()
const OUT = "registry/generated/lastmod.json"

/** Те же деревья, что у build-indexes: директория и объявляемый ею kind. */
const TREES = [
  { root: "registry/blocks", kind: "block" },
  { root: "registry/components", kind: "component" },
  { root: "registry/animations", kind: "animation" },
]

/** Item'ы из файловой системы: имя, kind, категория и своя директория. */
function readItems() {
  const items = []

  for (const tree of TREES) {
    const root = path.join(ROOT, tree.root)

    if (!existsSync(root)) {
      continue
    }

    for (const category of readdirSync(root, { withFileTypes: true })) {
      if (!category.isDirectory()) {
        continue
      }

      const manifest = path.join(root, category.name, "registry.json")

      if (!existsSync(manifest)) {
        continue
      }

      const parsed = JSON.parse(readFileSync(manifest, "utf8"))

      for (const item of parsed.items ?? []) {
        if (!item.name) {
          continue
        }

        items.push({
          name: item.name,
          kind: tree.kind,
          category: category.name,
          // Путь всегда в forward slash: с ним сравниваются пути из git.
          dir: `${tree.root}/${category.name}/${item.name}`,
        })
      }
    }
  }

  return items
}

/**
 * Дата последнего коммита по каждому файлу. `git log` идёт от свежих к старым,
 * поэтому первая встреча файла — его последнее изменение.
 */
function fileDates() {
  const out = execFileSync(
    "git",
    ["log", "--no-renames", "--pretty=format:\x01%cI", "--name-only"],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 512 * 1024 * 1024 },
  )

  const dates = new Map()
  let current = null

  for (const line of out.split(/\r?\n/)) {
    if (line.startsWith("\x01")) {
      current = line.slice(1)
      continue
    }

    if (!line || !current || dates.has(line)) {
      continue
    }

    dates.set(line, current)
  }

  return dates
}

/** Самая свежая из двух ISO-дат. Сравнение по времени, не лексикографически. */
function newer(a, b) {
  if (!a) return b
  if (!b) return a

  return Date.parse(a) >= Date.parse(b) ? a : b
}

function sortKeys(record) {
  return Object.fromEntries(
    Object.keys(record)
      .sort()
      .map((key) => [key, record[key]]),
  )
}

function build() {
  let dates
  let site

  try {
    dates = fileDates()
    site = execFileSync("git", ["log", "-1", "--pretty=format:%cI"], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim()
  } catch (error) {
    console.warn(`⚠ lastmod: git недоступен, sitemap откатится на дату сборки (${error.message})`)

    return { generatedAt: null, site: null, roots: {}, categories: {}, items: {} }
  }

  const items = readItems()
  const itemDate = {}
  const categoryDate = {}
  const rootDate = {}

  // Файл принадлежит item'у, если его первые четыре сегмента пути — директория
  // item'а (`registry/<tree>/<category>/<name>`). Общий registry.json категории
  // лежит на сегмент выше и ни одному item'у не приписывается.
  const dirs = new Map(items.map((item) => [item.dir, item]))

  for (const [file, date] of dates) {
    const key = file.split("/").slice(0, 4).join("/")
    const item = dirs.get(key)

    if (!item) {
      continue
    }

    itemDate[item.name] = newer(itemDate[item.name], date)
  }

  for (const item of items) {
    const date = itemDate[item.name] ?? site
    itemDate[item.name] = date

    const categoryKey = `${item.kind}/${item.category}`
    categoryDate[categoryKey] = newer(categoryDate[categoryKey], date)
    rootDate[item.kind] = newer(rootDate[item.kind], date)
  }

  return {
    generatedAt: site,
    site,
    roots: sortKeys(rootDate),
    categories: sortKeys(categoryDate),
    items: sortKeys(itemDate),
  }
}

const result = build()
const target = path.join(ROOT, OUT)
mkdirSync(path.dirname(target), { recursive: true })
writeFileSync(target, `${JSON.stringify(result, null, 2)}\n`)

console.log(
  `✓ lastmod: ${Object.keys(result.items).length} items, site ${result.site ?? "—"}`,
)
