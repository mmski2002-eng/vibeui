import type { CatalogItem } from "@/registry/meta"

function section(title: string, lines: string[]): string[] {
  return lines.length > 0
    ? [title, ...lines.map((line) => `- ${line}`), ""]
    : []
}

/**
 * Первая версия инструкции для агента. Собирается только из metadata блока,
 * вручную ничего не дописывается. Phase 3 заменит функцию шаблонным движком
 * с профилями агентов — контракт (CatalogItem -> строка) останется прежним.
 */
export function buildCopyForAiPrompt(
  item: CatalogItem,
  installCommand: string | null,
): string {
  const ai = item.meta?.ai
  const title = item.title ?? item.name

  const lines: string[] = [
    `Use the VibeUI component "${item.name}" (${title}) in this project.`,
    "",
  ]

  if (installCommand) {
    lines.push("Install it with this exact command:", installCommand, "")
  } else {
    lines.push(
      "Install command is unavailable: the VibeUI registry URL is not configured.",
      "",
    )
  }

  if (item.description) {
    lines.push("What it is:", item.description, "")
  }

  if (ai?.summary) {
    lines.push("How it looks and behaves:", ai.summary, "")
  }

  if (item.dependencies?.length) {
    lines.push(`npm dependencies: ${item.dependencies.join(", ")}`, "")
  } else {
    lines.push("npm dependencies: none.", "")
  }

  if (item.registryDependencies?.length) {
    lines.push(
      `Registry dependencies: ${item.registryDependencies.join(", ")}`,
      "",
    )
  }

  lines.push(
    ...section("Preserve exactly as installed:", ai?.preserve ?? []),
    ...section("You may adapt:", ai?.adapt ?? []),
    ...section("Rules:", ai?.notes ?? []),
  )

  lines.push(
    "Do not recreate this component from the description: install it from the registry and edit only the parts listed as adaptable.",
  )

  return lines.join("\n")
}
