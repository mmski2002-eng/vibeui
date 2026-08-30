import { getCatalogItems } from "@/registry/index"
import { getBlockSource } from "@/registry/source.server"

/**
 * Исходник item'а по прямой ссылке `/f/<name>.tsx`.
 *
 * Запасной путь установки для проектов без shadcn CLI: скачивание файла
 * (`curl -o`) переносит его побайтово, в отличие от чтения кода агентом и
 * перепечатывания его руками. Основной путь остаётся registry — только он
 * знает про зависимости и алиасы проекта (см. docs/DELIVERY.md).
 */
export const dynamicParams = false

export function generateStaticParams() {
  return getCatalogItems().map((item) => ({ file: `${item.name}.tsx` }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params
  const source = await getBlockSource(file.replace(/\.tsx$/, ""))

  if (!source) {
    return new Response("Not found\n", { status: 404 })
  }

  return new Response(source, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}
