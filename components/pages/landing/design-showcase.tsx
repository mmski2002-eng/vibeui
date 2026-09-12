import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { ShowcasePreview } from "@/components/pages/landing/showcase-preview"
import { localePath, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Витрина красится фирменным оранжевым из BREND.jfif: в каталоге те же
 * блоки чернильные, чтобы не навязывать бренд чужому проекту. */
const BRAND_ACCENT = "#ff5900"

const PICKS = [
  {
    slug: "hero-001",
    width: 1280,
    ru: "Первый экран с сиянием",
    en: "A hero with a glow",
    note: "Лендинг · мягкое свечение",
    noteEn: "Landing page · ambient glow",
    wide: true,
  },
  {
    slug: "hero-011",
    width: 1280,
    ru: "Первый экран на сетке",
    en: "A hero on a glowing grid",
    note: "Лендинг · сетка и свечение",
    noteEn: "Landing page · grid and glow",
    wide: true,
  },
  {
    slug: "stack-001",
    width: 480,
    ru: "Фотографии веером",
    en: "Photos in motion",
    note: "Галерея · анимация",
    noteEn: "Gallery · animation",
  },
  {
    slug: "errorpage-001",
    width: 900,
    ru: "Страница 404 с поиском",
    en: "A 404 page with search",
    note: "Страница ошибки · поиск",
    noteEn: "Error page · search",
  },
  {
    slug: "video-001",
    width: 900,
    ru: "Видео с постером",
    en: "Video with a poster",
    note: "Медиа · плеер",
    noteEn: "Media · player",
  },
]

export function DesignShowcase({ locale }: { locale: Locale }) {
  const en = locale === "en"
  return (
    <section
      id="designs"
      aria-labelledby="designs-title"
      className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 pb-8 lg:px-6"
    >
      {/* Заголовок держим в одну строку с подписью: на телефоне каждая
          лишняя строка здесь отодвигает первый пример за край экрана. */}
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="designs-title"
          className="type-h2 text-shell-fg"
        >
          {en ? "What will your site look like?" : "Каким будет твой сайт?"}
        </h2>
        <p className="type-caption text-shell-muted max-w-sm sm:max-w-md">
          {en
            ? "Pick one to see it live and take it to your AI."
            : "Нажми на дизайн — посмотри вживую и забери для ИИ."}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {PICKS.map((pick) => {
          const source = getCatalogItem(pick.slug)
          const kind = getItemKind(pick.slug)
          if (!source || !kind || !source.categories?.[0]) return null
          const item = localizeItem(source, locale)
          return (
            <article
              key={pick.slug}
              className={`group border-shell-border bg-shell-panel hover:border-shell-accent-line relative min-w-0 overflow-hidden rounded-2xl border transition-colors ${
                pick.wide ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              <div
                // Подложку красит CSS по теме сайта: витрина на главной
                // живёт в той же теме, что и всё вокруг, иначе на светлой
                // странице половина примеров стоит тёмными плашками.
                data-preview-theme="auto"
                className={`bg-preview-surface pointer-events-none overflow-hidden ${
                  pick.wide
                    ? "h-[250px] sm:h-[280px] lg:h-[340px]"
                    : "h-[300px] p-5"
                }`}
              >
                <ShowcasePreview
                  slug={pick.slug}
                  kind={kind}
                  category={source.categories[0]}
                  width={pick.width}
                  props={{
                    ...item.meta?.preview?.props,
                    ...(pick.slug === "stack-001" ? { open: true } : {}),
                    accent: BRAND_ACCENT,
                  }}
                />
              </div>
              <div className="border-shell-border flex items-center justify-between gap-4 border-t px-5 py-4">
                <div className="min-w-0">
                  <p className="type-label text-shell-muted mb-1.5">
                    {en ? pick.noteEn : pick.note}
                  </p>
                  <h3 className="text-shell-fg text-sm font-medium sm:text-base">
                    <Link
                      href={localePath(
                        locale,
                        `${itemBasePath(kind)}/${pick.slug}`,
                      )}
                      prefetch={false}
                      className="focus-visible:after:ring-shell-ring after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset"
                    >
                      {en ? pick.en : pick.ru}
                    </Link>
                  </h3>
                </div>
                <span className="border-shell-border text-shell-muted group-hover:bg-shell-accent group-hover:text-shell-accent-fg flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
