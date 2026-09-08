import { denialText, resolveAccess } from "@/lib/access"
import { getBlockSource } from "@/registry/source.server"

/**
 * Исходник item'а по прямой ссылке `/f/<name>.tsx`.
 *
 * Запасной путь установки для проектов без shadcn CLI: скачивание файла
 * (`curl -o`) переносит его побайтово, в отличие от чтения кода агентом и
 * перепечатывания его руками. Основной путь остаётся registry — только он
 * знает про зависимости и алиасы проекта (см. docs/DELIVERY.md).
 */
/**
 * Маршрут динамический: ответ зависит от того, кто спросил. Закрытые
 * item'ы отдаются только по подписке, а бесплатные тратят месячный лимит —
 * если оставить его статикой, лимит обходится этой дверью.
 */
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params
  const slug = file.replace(/\.tsx$/, "")
  const source = await getBlockSource(slug)

  if (!source) {
    return new Response("Not found\n", { status: 404 })
  }

  const access = await resolveAccess(slug)

  if (!access.allowed) {
    return new Response(denialText(access.reason), { status: 401 })
  }

  return new Response(source, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "private, no-store",
    },
  })
}
