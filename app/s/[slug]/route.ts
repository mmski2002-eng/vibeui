import { isPro } from "@/lib/entitlements"
import { isLocale, type Locale } from "@/lib/i18n"
import { signRegistryLink, verifyRegistryLink } from "@/lib/registry-link"
import { getScenario, scenarioSignName } from "@/lib/scenario"
import { buildScenarioBrief } from "@/lib/scenario.server"
import { getSession } from "@/lib/session"
import { getSiteBaseUrl } from "@/lib/site"

/**
 * Бриф сценария для агента по короткой ссылке `/s/<slug>`.
 *
 * Как `/c/<name>` для одного блока, только на целую страницу: команды
 * установки всех блоков с подписанными адресами на сутки и исходник
 * демо-страницы. Открывается по подписи (её выдаёт кнопка на странице
 * сценария подписчику) или по сессии с Pro: все блоки сценария закрытые.
 */
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const scenario = getScenario(slug)

  if (!scenario) {
    return new Response("Not found\n", { status: 404 })
  }

  const search = new URL(request.url).searchParams
  const lang = search.get("lang") ?? undefined
  const locale: Locale = isLocale(lang) ? lang : "ru"
  const signed = verifyRegistryLink(
    scenarioSignName(slug),
    Number(search.get("exp")),
    search.get("sig"),
  )

  if (!signed) {
    const session = await getSession()

    if (!session || !(await isPro(session.user.id))) {
      return new Response(
        locale === "ru"
          ? "Сценарий целиком доступен в Pro.\nОформить: https://vibeui.ru/pricing\n"
          : "The full scenario is available in Pro.\nSubscribe: https://vibeui.ru/en/pricing\n",
        { status: 401 },
      )
    }
  }

  const siteUrl = getSiteBaseUrl() ?? new URL(request.url).origin

  // Каждому блоку — своя подпись на сутки: агент ставит их без ключа.
  const commands = Object.fromEntries(
    scenario.sections.map((section) => {
      const link = signRegistryLink(section.item)

      return [
        section.item,
        `npx shadcn@latest add ${siteUrl}/r/pro/${section.item}.json?exp=${link.exp}&sig=${link.sig}`,
      ]
    }),
  )

  const brief = await buildScenarioBrief({ scenario, locale, siteUrl, commands })

  return new Response(`${brief}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "private, no-store",
    },
  })
}
