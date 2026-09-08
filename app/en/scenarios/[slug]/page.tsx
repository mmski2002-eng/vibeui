import { ScenarioPage } from "@/components/pages/scenario-page"
import { getScenario, getScenarios } from "@/lib/scenario"
import { pageMetadata } from "@/lib/seo"

export const dynamicParams = false

export function generateStaticParams() {
  return getScenarios().map((scenario) => ({ slug: scenario.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const scenario = getScenario(slug)

  return scenario
    ? pageMetadata({
        locale: "en",
        path: `/scenarios/${scenario.slug}`,
        title: scenario.en,
        description: scenario.summaryEn,
      })
    : {}
}

export default async function Scenario({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params

  return <ScenarioPage locale="en" slug={slug} query={await searchParams} />
}
