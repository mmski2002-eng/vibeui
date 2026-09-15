import { isPro } from "@/lib/entitlements"
import { signRegistryLink } from "@/lib/registry-link"
import { getScenario, scenarioSignName } from "@/lib/scenario"
import { getSession } from "@/lib/session"
import { getSiteBaseUrl } from "@/lib/site"

/**
 * Подписанная ссылка на бриф сценария для кнопки «Копировать сценарий для
 * ИИ». Право проверяется здесь один раз: сценарий целиком — только в Pro,
 * дальше ссылка живёт сутки без повторной авторизации.
 */
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get("slug") ?? ""
  const lang = url.searchParams.get("lang")
  const scenario = getScenario(slug)

  if (!scenario) {
    return new Response("Not found\n", { status: 404 })
  }

  const session = await getSession()

  if (!session) {
    return Response.json({ reason: "signin" }, { status: 401 })
  }

  if (!(await isPro(session.user.id))) {
    return Response.json({ reason: "pro" }, { status: 401 })
  }

  const { exp, sig } = signRegistryLink(scenarioSignName(slug))
  const base = getSiteBaseUrl() ?? url.origin
  const query = `exp=${exp}&sig=${sig}${lang === "en" ? "&lang=en" : ""}`

  return Response.json(
    { docUrl: `${base}/s/${slug}?${query}`, expiresAt: exp },
    { headers: { "cache-control": "private, no-store" } },
  )
}
