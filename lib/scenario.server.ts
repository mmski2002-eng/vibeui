import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

import type { Locale } from "@/lib/i18n"
import { scenarioSections, scenarioText } from "@/lib/scenario"
import type { Scenario } from "@/registry/scenarios"

/**
 * Файловая половина сценариев. Источник правды — файл демо-страницы: из него
 * вырезаются примеры использования для рецепта и он же целиком уходит
 * агенту в брифе. Читается с диска при запросе: файл лежит в репозитории,
 * relative к корню, и в standalone-релиз попадает трейсингом.
 */

export async function readScenarioSource(scenario: Scenario): Promise<string> {
  return readFile(path.join(process.cwd(), scenario.source), "utf8")
}

/**
 * Исходник в том виде, в каком он нужен в чужом проекте: импорты из нашего
 * реестра становятся импортами установленных файлов, наши демо-картинки —
 * плейсхолдерами, которые человек заменит своими.
 */
export function agentSource(source: string): string {
  return source
    .replace(
      /@\/registry\/(?:animations|blocks|components)\/[\w-]+\/([\w-]+)\/\1"/g,
      '@/components/vibeui/$1"',
    )
    .replace(/\/demo\/[\w-]+(?=["/])/g, "/photos")
    .replace(/^export const metadata = \{[\s\S]*?\n\}\n\n/m, "")
}

/**
 * Первое использование компонента в исходнике: открывающий тег с пропсами.
 * Скобки и кавычки считаются, чтобы `>` внутри выражения не оборвал тег.
 */
export function extractUsage(source: string, exportName: string): string | null {
  const start = source.indexOf(`<${exportName}`)

  if (start === -1) return null

  let depth = 0
  let quote: string | null = null

  for (let index = start; index < source.length; index += 1) {
    const char = source[index]

    if (quote) {
      if (char === quote && source[index - 1] !== "\\") quote = null
      continue
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char
      continue
    }

    if (char === "{") depth += 1
    if (char === "}") depth -= 1

    if (char === ">" && depth === 0) {
      const tag = source.slice(start, index + 1)
      const lines = tag.split("\n")
      const indent = lines.length > 1 ? (lines[lines.length - 1].match(/^\s*/)?.[0].length ?? 0) : 0

      return lines.map((line, number) => (number === 0 ? line : line.slice(Math.min(indent, line.match(/^\s*/)?.[0].length ?? 0)))).join("\n")
    }
  }

  return null
}

export type ScenarioImage = { file: string; format: string; prompt: string }

/** Таблица картинок из IMAGES.md: файл, формат, промпт. */
export async function readScenarioImages(scenario: Scenario): Promise<{ style: string; images: ScenarioImage[] }> {
  if (!scenario.images) return { style: "", images: [] }

  const text = await readFile(path.join(process.cwd(), scenario.images), "utf8")
  const style = text.match(/```\n([\s\S]*?)```/)?.[1].replace(/\s+/g, " ").trim() ?? ""
  const images = text
    .split("\n")
    .filter((line) => /^\| `/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .map((cells) => ({ file: cells[1].replace(/`/g, ""), format: cells[2], prompt: cells[3] }))

  return { style, images }
}

/**
 * Бриф агенту: правила, команды установки всех блоков и исходник страницы.
 * Композиция — это код, поэтому инструкция «как собрать такую страницу» и
 * есть сама страница; агенту остаётся поставить блоки и заменить контент.
 */
export async function buildScenarioBrief({
  scenario,
  locale,
  siteUrl,
  commands,
}: {
  scenario: Scenario
  locale: Locale
  siteUrl: string
  /** Команда установки для каждого item'а — с подписанным адресом. */
  commands: Record<string, string>
}): Promise<string> {
  const ru = locale === "ru"
  const text = scenarioText(scenario, locale)
  const sections = scenarioSections(scenario, locale)
  const source = agentSource(await readScenarioSource(scenario))
  const { images } = await readScenarioImages(scenario)
  const files = images.map((image) => image.file).join(", ")

  const lines = [
    `VibeUI · ${ru ? "сценарий" : "scenario"} «${text.label}»`,
    text.summary,
    "",
    ru ? "Правила:" : "Rules:",
    ru
      ? "- Установи все блоки командами ниже. Не пиши их код сам и не пересоздавай по описанию."
      : "- Install every block with the commands below. Do not write their code yourself and do not recreate them from the description.",
    ru
      ? "- Собери страницу ровно по исходнику ниже: он и есть инструкция. Меняй только тексты, ссылки и фото; порядок секций, обёртку и пропсы темы оставь."
      : "- Assemble the page exactly as in the source below: it is the instruction. Change only texts, links and photos; keep the section order, the wrapper and the theme props.",
    ru
      ? `- Тема одна на всю страницу: tone="${scenario.theme.tone}", accent="${scenario.theme.accent}", ink="${scenario.theme.ink}". Шрифты (${scenario.theme.font}) блоки подключают сами.`
      : `- One theme for the whole page: tone="${scenario.theme.tone}", accent="${scenario.theme.accent}", ink="${scenario.theme.ink}". The blocks load their fonts (${scenario.theme.font}) themselves.`,
    files
      ? ru
        ? `- Картинки: положи свои в public/photos/ с этими именами: ${files}. Пока их нет, на их месте будут подложки.`
        : `- Images: put yours into public/photos/ with these names: ${files}. Until then placeholders show.`
      : "",
    "",
    ru ? `Установка (${sections.length} ${ru ? "блоков" : "blocks"}), по одной команде на блок:` : `Install (${sections.length} blocks), one command per block:`,
    ...sections.map((section) => commands[section.name] ?? `# ${section.name}: ${ru ? "команда недоступна" : "command unavailable"}`),
    "",
    ru ? "Роли блоков на странице:" : "Block roles on the page:",
    ...sections.map((section) => `- ${section.name} — ${section.role}${section.note ? `: ${section.note}` : ""}`),
    "",
    ru ? "Страница (например, app/page.tsx):" : "The page (for example app/page.tsx):",
    "```tsx",
    source.trimEnd(),
    "```",
    "",
    `${ru ? "Демо" : "Demo"}: ${siteUrl}${scenario.demo}`,
  ]

  return lines.filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n")
}
