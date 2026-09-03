import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import prettier from "prettier"

/**
 * Генерация индексов каталога из файловой системы.
 *
 * Раньше рядом с каждым `registry.json` руками велись параллельные карты:
 * `components.ts` в категории, `previews.ts`, `previews.lazy.ts` и `SOURCES`
 * в `registry/index.ts`, плюс `include[]` в корневом реестре. Пять мест на
 * одну новую категорию и три на один item — это блокировало параллельную
 * работу над разными item'ами: агенты дрались за одни и те же файлы.
 *
 * Теперь единственный ручной источник — сами `registry.json`. Всё остальное
 * выводится отсюда.
 *
 * Запуск: `npm run indexes`. Проверка на устаревание: `npm run indexes -- --check`.
 */

const ROOT = process.cwd()
const CHECK = process.argv.includes("--check")

/** Где живут реестры и какой `kind` объявляет каждая из этих директорий. */
const TREES = [
  { root: "registry/blocks", kind: "block" },
  { root: "registry/components", kind: "component" },
  { root: "registry/animations", kind: "animation" },
]

const GENERATED_HEADER = `// Сгенерировано \`npm run indexes\` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.
`

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

/** Порядок категорий в каталоге задаётся `registry/categories.ts`. */
function categoryOrder() {
  const source = readFileSync(path.join(ROOT, "registry/categories.ts"), "utf8")
  const categories = source.slice(source.indexOf("export const CATEGORIES"))

  return [...categories.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1])
}

function pascalCase(name) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function camelCase(name) {
  const pascal = pascalCase(name)

  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function readRegistries() {
  const order = categoryOrder()
  const registries = []

  for (const tree of TREES) {
    const root = path.join(ROOT, tree.root)

    if (!existsSync(root)) {
      continue
    }

    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue
      }

      const directory = `${tree.root}/${entry.name}`
      const manifest = path.join(root, entry.name, "registry.json")

      if (!existsSync(manifest)) {
        fail(`${directory}: нет registry.json`)
      }

      const parsed = JSON.parse(readFileSync(manifest, "utf8"))
      const position = order.indexOf(entry.name)

      if (position === -1) {
        fail(
          `${directory}: категория "${entry.name}" не объявлена в registry/categories.ts`,
        )
      }

      registries.push({
        directory,
        category: entry.name,
        kind: tree.kind,
        position,
        items: parsed.items ?? [],
      })
    }
  }

  // Сначала блоки, потом компоненты; внутри типа — порядок categories.ts.
  registries.sort(
    (a, b) =>
      TREES.findIndex((tree) => tree.kind === a.kind) -
        TREES.findIndex((tree) => tree.kind === b.kind) ||
      a.position - b.position,
  )

  return registries
}

/**
 * Превью item'а: единственный `.tsx` из его `files[]` и имя экспорта.
 * Экспорт выводится из имени (`button-001` → `Button001`); `meta.ai.export`
 * только подтверждает вывод, поэтому расхождение — ошибка, а не мнение.
 */
function previewOf(registry, item) {
  const file = item.files?.find((entry) => entry.path?.endsWith(".tsx"))

  if (!file) {
    fail(`${registry.directory} → ${item.name}: среди files[] нет .tsx`)
  }

  const modulePath = `@/${registry.directory}/${file.path.replace(/\.tsx$/, "")}`
  const symbol = pascalCase(item.name)
  const declared = item.meta?.ai?.export

  if (declared && declared !== symbol) {
    fail(
      `${registry.directory} → ${item.name}: meta.ai.export "${declared}" не совпадает с ожидаемым "${symbol}"`,
    )
  }

  const category = item.categories?.[0]

  if (category !== registry.category) {
    fail(
      `${registry.directory} → ${item.name}: categories[0] = "${category}", а реестр объявляет "${registry.category}"`,
    )
  }

  return {
    slug: item.name,
    modulePath,
    symbol,
    kind: registry.kind,
    category: registry.category,
  }
}

function collectPreviews(registries) {
  return registries.flatMap((registry) =>
    registry.items
      .filter((item) => !item.meta?.internal)
      .map((item) => previewOf(registry, item)),
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderPreviews(previews) {
  const imports = previews
    .map(
      (preview) => `import { ${preview.symbol} } from "${preview.modulePath}"`,
    )
    .join("\n")

  const entries = previews
    .map((preview) => `  "${preview.slug}": ${preview.symbol},`)
    .join("\n")

  return `${GENERATED_HEADER}
import type { ComponentType } from "react"

${imports}

/**
 * Карта slug -> React-компонент. Из неё рендерятся и миниатюра каталога,
 * и \`/preview/[slug]\` — тот же файл, который получает пользователь.
 *
 * Файл называется previews.ts, а не components.ts, чтобы не конфликтовать
 * с директорией registry/components/ (мелкие компоненты).
 */
export const CATALOG_PREVIEWS: Record<string, ComponentType> = {
${entries}
}
`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function renderLazyPreviews(previews) {
  const entries = previews
    .map(
      (preview) => `  "${preview.slug}": dynamic(() =>
    import("${preview.modulePath}").then((module) => module.${preview.symbol}),
  ),`,
    )
    .join("\n")

  return `${GENERATED_HEADER}
import dynamic from "next/dynamic"
import type { ComponentType } from "react"

/**
 * Ленивая карта превью для конфигуратора. Отличается от \`previews.ts\` двумя
 * вещами: компоненты грузятся отдельными чанками по требованию и принимают
 * произвольные пропсы.
 *
 * Зачем отдельная карта: статическая нужна серверному рендеру миниатюр и
 * не должна тащить \`next/dynamic\`, а эта грузится только когда пользователь
 * действительно открыл настройку — витрина остаётся без клиентского JS
 * компонентов (см. docs/CONTROLS.md).
 *
 * Пропсы типизированы как \`Record<string, unknown>\`: значения приходят из
 * контролов самого item'а, то есть по построению совпадают с его API.
 * Проверить это статически нельзя — карта индексируется по slug.
 */
export type PreviewProps = Record<string, unknown>

export const LAZY_PREVIEWS = {
${entries}
} as unknown as Record<string, ComponentType<PreviewProps>>
`
}

function renderPreviewTypes() {
  return `${GENERATED_HEADER}
import type { ComponentType } from "react"

export type PreviewProps = Record<string, unknown>
export type PreviewMap = Record<string, ComponentType<PreviewProps>>
export type PreviewMapModule = {
  PREVIEWS: PreviewMap
}
`
}

function renderCategoryPreviews(registry) {
  const previews = registry.items
    .filter((item) => !item.meta?.internal)
    .map((item) => previewOf(registry, item))

  const imports = previews
    .map(
      (preview) => `import { ${preview.symbol} } from "${preview.modulePath}"`,
    )
    .join("\n")

  const entries = previews
    .map((preview) => `  "${preview.slug}": ${preview.symbol},`)
    .join("\n")

  return `${GENERATED_HEADER}
import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

${imports}

export const PREVIEWS = {
${entries}
} satisfies Record<string, ComponentType<PreviewProps>>
`
}

function renderLazyCategoryPreviews(registry) {
  const previews = registry.items
    .filter((item) => !item.meta?.internal)
    .map((item) => previewOf(registry, item))

  const entries = previews
    .map(
      (preview) => `  "${preview.slug}": dynamic(() =>
    import("${preview.modulePath}").then((module) => module.${preview.symbol}),
  ),`,
    )
    .join("\n")

  return `${GENERATED_HEADER}
import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
${entries}
} satisfies PreviewMap
`
}

function renderPreviewLoaders(registries, lazy) {
  const cases = registries
    .filter((registry) => registry.items.some((item) => !item.meta?.internal))
    .map((registry) => {
      const pathPrefix = lazy ? "previews-lazy" : "previews"
      return `    case "${registry.kind}/${registry.category}":
      return (await import("@/registry/${pathPrefix}/${registry.kind}/${registry.category}")).PREVIEWS`
    })
    .join("\n")

  const functionName = lazy ? "loadLazyPreviewMap" : "loadPreviewMap"

  return `${GENERATED_HEADER}
import type { ItemKind } from "@/registry/categories"
import type { PreviewMap } from "@/registry/preview-types"

export async function ${functionName}(
  kind: ItemKind,
  category: string,
): Promise<PreviewMap | null> {
  switch (\`\${kind}/\${category}\`) {
${cases}
    default:
      return null
  }
}
`
}

function renderLegacyPreviews(lazy) {
  const exported = lazy ? "loadLazyPreviewMap" : "loadPreviewMap"
  const targetModule = lazy
    ? "@/registry/preview-loaders-lazy"
    : "@/registry/preview-loaders"

  return `${GENERATED_HEADER}
export { ${exported} } from "${targetModule}"
`
}

function renderSources(registries) {
  const used = new Map()

  for (const registry of registries) {
    let alias = `${camelCase(registry.category)}Registry`

    if (used.has(alias)) {
      alias = `${camelCase(registry.category)}${pascalCase(registry.kind)}Registry`
    }

    used.set(alias, registry)
    registry.alias = alias
  }

  const imports = registries
    .map(
      (registry) =>
        `import ${registry.alias} from "@/${registry.directory}/registry.json"`,
    )
    .join("\n")

  const entries = registries
    .map(
      (registry) => `  {
    directory: "${registry.directory}",
    kind: "${registry.kind}",
    items: ${registry.alias}.items,
  },`,
    )
    .join("\n")

  return `${GENERATED_HEADER}
import type { ItemKind } from "@/registry/categories"

${imports}

/**
 * Реестры, попадающие на сайт. Это и есть файловая база каталога: другого
 * источника данных нет.
 *
 * Порядок списка задаёт порядок items в каталоге: сначала блоки, потом
 * компоненты, внутри типа — порядок категорий из \`registry/categories.ts\`.
 * \`kind\` объявляется на уровне реестра, а не у каждого item'а: все items
 * одного реестра — одного типа.
 */
export const SOURCES = [
${entries}
] as const satisfies readonly {
  directory: string
  kind: ItemKind
  items: unknown[]
}[]
`
}

function renderRootRegistry(registries) {
  const current = JSON.parse(
    readFileSync(path.join(ROOT, "registry.json"), "utf8"),
  )

  return `${JSON.stringify(
    {
      ...current,
      include: registries.map(
        (registry) => `${registry.directory}/registry.json`,
      ),
    },
    null,
    2,
  )}\n`
}

async function emit(relativePath, contents) {
  const target = path.join(ROOT, relativePath)
  mkdirSync(path.dirname(target), { recursive: true })
  const options = await prettier.resolveConfig(target)
  const formatted = await prettier.format(contents, {
    ...options,
    filepath: target,
  })
  const existing = existsSync(target) ? readFileSync(target, "utf8") : null

  if (existing === formatted) {
    return false
  }

  if (CHECK) {
    fail(`${relativePath} устарел — запусти npm run indexes`)
  }

  writeFileSync(target, formatted)
  console.log(`  обновлён ${relativePath}`)

  return true
}

const registries = readRegistries()
const previews = collectPreviews(registries)

const changed = [
  await emit("registry/sources.ts", renderSources(registries)),
  await emit("registry/preview-types.ts", renderPreviewTypes()),
  await emit("registry/preview-loaders.ts", renderPreviewLoaders(registries)),
  await emit(
    "registry/preview-loaders-lazy.ts",
    renderPreviewLoaders(registries, true),
  ),
  await emit("registry/previews.ts", renderLegacyPreviews()),
  await emit("registry/previews.lazy.ts", renderLegacyPreviews(true)),
  ...(await Promise.all(
    registries.map((registry) =>
      emit(
        `registry/previews/${registry.kind}/${registry.category}.ts`,
        renderCategoryPreviews(registry),
      ),
    ),
  )),
  ...(await Promise.all(
    registries.map((registry) =>
      emit(
        `registry/previews-lazy/${registry.kind}/${registry.category}.ts`,
        renderLazyCategoryPreviews(registry),
      ),
    ),
  )),
  await emit("registry.json", renderRootRegistry(registries)),
].some(Boolean)

const summary = `${registries.length} реестров, ${previews.length} items`

console.log(
  CHECK
    ? `✓ индексы актуальны (${summary})`
    : changed
      ? `✓ индексы пересобраны (${summary})`
      : `✓ индексы без изменений (${summary})`,
)
