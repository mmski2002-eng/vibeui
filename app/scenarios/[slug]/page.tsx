import { ScenarioPage } from "@/components/pages/scenario-page"
import { getScenario, getScenarios } from "@/lib/scenario"
import { pageMetadata } from "@/lib/seo"

// Страница читает сессию (рецепт целиком — только в Pro), поэтому
// рендерится на запрос; список слагов всё равно статичен.
export const dynamic = "force-dynamic"
export const dynamicParams = false

export function generateStaticParams() {
  return getScenarios().map((scenario) => ({ slug: scenario.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const scenario = getScenario(slug)

  if (!scenario) {
    return {}
  }

  return pageMetadata({
    locale: "ru",
    path: `/scenarios/${scenario.slug}`,
    title: scenario.label,
    description: scenario.summary,
  })
}

export default async function Scenario({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <ScenarioPage locale="ru" slug={slug} />
}
