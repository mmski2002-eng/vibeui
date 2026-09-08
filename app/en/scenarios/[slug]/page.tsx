import { ScenarioPage } from "@/components/pages/scenario-page"
import { getScenario, getScenarios } from "@/lib/scenario"
import { pageMetadata } from "@/lib/seo"

export const dynamicParams = false

export function generateStaticParams() {
  return getScenarios().map((scenario) => ({ slug: scenario.slug }))
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const scenario = getScenario(slug)

  if (!scenario) {
    return {}
  }

  // Комбинации выбора закрыты в robots.txt, и послушный краулер сюда не
  // придёт вовсе. Тег — для тех, кто robots.txt игнорирует: содержание то же,
  // что на чистом адресе, а идти по ссылкам дальше незачем.
  const picked = Object.keys(await searchParams).length > 0

  return {
    ...pageMetadata({
      locale: "en",
      path: `/scenarios/${scenario.slug}`,
      title: scenario.en,
      description: scenario.summaryEn,
    }),
    ...(picked ? { robots: { index: false, follow: false } } : null),
  }
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
