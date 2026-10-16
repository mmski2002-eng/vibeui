import { ScenarioPage } from "@/components/pages/scenario-page"
import { scenarioCopy } from "@/lib/landing-copy"
import { getScenario, getScenarios } from "@/lib/scenario"
import { pageMetadata } from "@/lib/seo"

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

  const copy = scenarioCopy(scenario.slug, "en")

  return pageMetadata({
    locale: "en",
    path: `/scenarios/${scenario.slug}`,
    title: copy?.title ?? scenario.en,
    description: copy?.description ?? scenario.summaryEn,
  })
}

export default async function Scenario({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <ScenarioPage locale="en" slug={slug} />
}
