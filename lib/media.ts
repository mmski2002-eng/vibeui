import type { Locale } from "@/lib/i18n"
import media from "@/registry/generated/media.json"

const items: Record<string, string[]> = media.items
const sources: Record<string, string[]> = media.sources

export function itemMedia(names: string[]): string[] {
  return [...new Set(names.flatMap((name) => items[name] ?? []))].sort()
}

export function sourceMedia(source: string): string[] {
  return sources[source] ?? []
}

/**
 * Демо-медиа не входят в registry-пакет: shadcn переносит только код. Без
 * этих команд блок в чужом проекте ссылается на файлы, которых там нет.
 */
export function mediaLines(paths: string[], siteUrl: string, locale: Locale): string[] {
  if (paths.length === 0) return []

  return [
    "",
    locale === "ru"
      ? `Медиа (${paths.length}): скачай в те же пути, иначе картинок и видео не будет. Свои потом клади поверх с теми же именами.`
      : `Media (${paths.length}): download into the same paths, otherwise images and videos are missing. Later replace them with yours under the same names.`,
    ...paths.map((file) => `curl --create-dirs -o public${file} ${siteUrl}${file}`),
  ]
}
