const DEVELOPMENT_REGISTRY_BASE_URL = "http://localhost:3000/r"

/**
 * Базовый URL публичного registry. В production берётся только из
 * REGISTRY_BASE_URL: выдумывать домен, которым мы не управляем, нельзя.
 */
export function getRegistryBaseUrl(): string | null {
  const configured = process.env.REGISTRY_BASE_URL?.trim().replace(/\/+$/, "")

  if (configured) {
    return configured
  }

  return process.env.NODE_ENV === "development"
    ? DEVELOPMENT_REGISTRY_BASE_URL
    : null
}

/** Публичный URL registry item'а — то, что вставляют в CLI или в промпт агента. */
export function getRegistryItemUrl(name: string): string | null {
  const baseUrl = getRegistryBaseUrl()

  return baseUrl ? `${baseUrl}/${name}.json` : null
}

export function getInstallCommand(name: string): string | null {
  const url = getRegistryItemUrl(name)

  return url ? `npx shadcn@latest add ${url}` : null
}
