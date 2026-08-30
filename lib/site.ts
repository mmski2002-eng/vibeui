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

/** Origin сайта. Выводится из базового URL реестра: он и есть `<origin>/r`. */
export function getSiteBaseUrl(): string | null {
  const baseUrl = getRegistryBaseUrl()

  return baseUrl ? baseUrl.replace(/\/r$/, "") : null
}

/**
 * Короткая ссылка на инструкцию для агента. Это главный артефакт доставки:
 * пользователь вставляет её в свою фразу, агент открывает и выполняет.
 * Исходника по этой ссылке нет намеренно — единственный способ выполнить
 * инструкцию это запустить install-команду.
 */
export function getItemDocUrl(name: string): string | null {
  const baseUrl = getSiteBaseUrl()

  return baseUrl ? `${baseUrl}/c/${name}` : null
}

/**
 * Прямая ссылка на исходник. Нужна там, где shadcn CLI в проекте нет:
 * скачивание файла так же побайтово, как установка, в отличие от чтения
 * кода агентом и перепечатывания его руками.
 */
export function getItemFileUrl(name: string): string | null {
  const baseUrl = getSiteBaseUrl()

  return baseUrl ? `${baseUrl}/f/${name}.tsx` : null
}
