import type { CatalogItem } from "@/registry/meta"

/**
 * Правила «сохрани как установлено» там, где их не вырежет пересказ.
 *
 * Фетчер агента (Claude Code и подобные) пропускает бриф `/c` через
 * маленькую модель и оставляет команды и факты, а правила-прозу теряет.
 * Поэтому те же три правила едут ещё двумя путями, которые не пересказывают:
 * полем `docs` registry item (shadcn CLI печатает его после установки) и
 * комментарием в шапке самого файла (он ставится побайтово).
 */
export function preserveRules(item: CatalogItem, limit = 3): string[] {
  return (item.meta?.ai?.preserve ?? []).slice(0, limit)
}

export function buildRegistryDocs(item: CatalogItem): string | undefined {
  const rules = preserveRules(item)
  const parts: string[] = []

  if (rules.length > 0) {
    parts.push(
      ["Сохрани как установлено:", ...rules.map((rule) => `- ${rule}`)].join(
        "\n",
      ),
    )
  }

  if (item.docs) {
    parts.push(item.docs)
  }

  return parts.length > 0 ? parts.join("\n\n") : undefined
}

export function withPreserveHeader(source: string, item: CatalogItem): string {
  const rules = preserveRules(item)

  if (rules.length === 0) {
    return source
  }

  const header = [
    `// VibeUI ${item.name}. Сохрани как установлено:`,
    ...rules.map((rule) => `// - ${rule.replace(/\s*\n\s*/g, " ")}`),
    "",
    "",
  ].join("\n")

  return header + source
}
