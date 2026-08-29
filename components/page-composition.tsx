import { BlockThumbnail } from "@/components/block-thumbnail"
import { getBlockByCategory } from "@/registry/index"

// Порядок секций типовой страницы. Это продуктовая витрина, а не метаданные:
// сами блоки и их описания по-прежнему живут только в registry.
const PAGE_ORDER = ["hero", "features", "pricing"]

/**
 * Композиция «страница, собранная из блоков»: настоящие миниатюры блоков,
 * подрезанные по высоте и составленные в одну колонку. Декоративная —
 * кликабельные ссылки на те же блоки живут в секции ниже.
 */
export function PageComposition() {
  const slugs = PAGE_ORDER.map((category) => getBlockByCategory(category)?.name)

  return (
    <div
      aria-hidden="true"
      className="bg-card overflow-hidden rounded-xl border shadow-sm"
    >
      {slugs.map((slug, index) =>
        slug ? (
          <div key={slug} className={index > 0 ? "border-t" : undefined}>
            {/* Подрезаем миниатюру пропорцией, а не фиксированной высотой:
                так на любой ширине видно одну и ту же долю секции и обрез не
                попадает в середину заголовка. У последней добавляем затухание —
                обрез читается как «страница продолжается», а не как ошибка. */}
            <div
              className="aspect-[16/6] overflow-hidden"
              style={
                index === slugs.length - 1
                  ? {
                      maskImage:
                        "linear-gradient(to bottom, black 55%, transparent)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 55%, transparent)",
                    }
                  : undefined
              }
            >
              <BlockThumbnail slug={slug} />
            </div>
          </div>
        ) : null,
      )}
    </div>
  )
}
