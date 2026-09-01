// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

/**
 * Ленивая карта превью для конфигуратора. Отличается от `previews.ts` двумя
 * вещами: компоненты грузятся отдельными чанками по требованию и принимают
 * произвольные пропсы.
 *
 * Зачем отдельная карта: статическая нужна серверному рендеру миниатюр и
 * не должна тащить `next/dynamic`, а эта грузится только когда пользователь
 * действительно открыл настройку — витрина остаётся без клиентского JS
 * компонентов (см. docs/CONTROLS.md).
 *
 * Пропсы типизированы как `Record<string, unknown>`: значения приходят из
 * контролов самого item'а, то есть по построению совпадают с его API.
 * Проверить это статически нельзя — карта индексируется по slug.
 */
export type PreviewProps = Record<string, unknown>

export const LAZY_PREVIEWS = {
  "hero-001": dynamic(() =>
    import("@/registry/blocks/hero/hero-001/hero-001").then(
      (module) => module.Hero001,
    ),
  ),
  "hero-002": dynamic(() =>
    import("@/registry/blocks/hero/hero-002/hero-002").then(
      (module) => module.Hero002,
    ),
  ),
  "hero-003": dynamic(() =>
    import("@/registry/blocks/hero/hero-003/hero-003").then(
      (module) => module.Hero003,
    ),
  ),
  "hero-004": dynamic(() =>
    import("@/registry/blocks/hero/hero-004/hero-004").then(
      (module) => module.Hero004,
    ),
  ),
  "hero-005": dynamic(() =>
    import("@/registry/blocks/hero/hero-005/hero-005").then(
      (module) => module.Hero005,
    ),
  ),
  "hero-006": dynamic(() =>
    import("@/registry/blocks/hero/hero-006/hero-006").then(
      (module) => module.Hero006,
    ),
  ),
  "hero-007": dynamic(() =>
    import("@/registry/blocks/hero/hero-007/hero-007").then(
      (module) => module.Hero007,
    ),
  ),
  "hero-008": dynamic(() =>
    import("@/registry/blocks/hero/hero-008/hero-008").then(
      (module) => module.Hero008,
    ),
  ),
  "hero-009": dynamic(() =>
    import("@/registry/blocks/hero/hero-009/hero-009").then(
      (module) => module.Hero009,
    ),
  ),
  "hero-010": dynamic(() =>
    import("@/registry/blocks/hero/hero-010/hero-010").then(
      (module) => module.Hero010,
    ),
  ),
  "hero-011": dynamic(() =>
    import("@/registry/blocks/hero/hero-011/hero-011").then(
      (module) => module.Hero011,
    ),
  ),
  "hero-012": dynamic(() =>
    import("@/registry/blocks/hero/hero-012/hero-012").then(
      (module) => module.Hero012,
    ),
  ),
  "hero-013": dynamic(() =>
    import("@/registry/blocks/hero/hero-013/hero-013").then(
      (module) => module.Hero013,
    ),
  ),
  "hero-014": dynamic(() =>
    import("@/registry/blocks/hero/hero-014/hero-014").then(
      (module) => module.Hero014,
    ),
  ),
  "hero-015": dynamic(() =>
    import("@/registry/blocks/hero/hero-015/hero-015").then(
      (module) => module.Hero015,
    ),
  ),
  "hero-016": dynamic(() =>
    import("@/registry/blocks/hero/hero-016/hero-016").then(
      (module) => module.Hero016,
    ),
  ),
  "navbar-001": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-001/navbar-001").then(
      (module) => module.Navbar001,
    ),
  ),
  "navbar-002": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-002/navbar-002").then(
      (module) => module.Navbar002,
    ),
  ),
  "navbar-003": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-003/navbar-003").then(
      (module) => module.Navbar003,
    ),
  ),
  "navbar-004": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-004/navbar-004").then(
      (module) => module.Navbar004,
    ),
  ),
  "navbar-005": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-005/navbar-005").then(
      (module) => module.Navbar005,
    ),
  ),
  "navbar-006": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-006/navbar-006").then(
      (module) => module.Navbar006,
    ),
  ),
  "navbar-007": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-007/navbar-007").then(
      (module) => module.Navbar007,
    ),
  ),
  "navbar-008": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-008/navbar-008").then(
      (module) => module.Navbar008,
    ),
  ),
  "navbar-009": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-009/navbar-009").then(
      (module) => module.Navbar009,
    ),
  ),
  "navbar-010": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-010/navbar-010").then(
      (module) => module.Navbar010,
    ),
  ),
  "navbar-011": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-011/navbar-011").then(
      (module) => module.Navbar011,
    ),
  ),
  "navbar-012": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-012/navbar-012").then(
      (module) => module.Navbar012,
    ),
  ),
  "navbar-013": dynamic(() =>
    import("@/registry/blocks/navbar/navbar-013/navbar-013").then(
      (module) => module.Navbar013,
    ),
  ),
  "features-001": dynamic(() =>
    import("@/registry/blocks/features/features-001/features-001").then(
      (module) => module.Features001,
    ),
  ),
  "features-002": dynamic(() =>
    import("@/registry/blocks/features/features-002/features-002").then(
      (module) => module.Features002,
    ),
  ),
  "features-003": dynamic(() =>
    import("@/registry/blocks/features/features-003/features-003").then(
      (module) => module.Features003,
    ),
  ),
  "features-004": dynamic(() =>
    import("@/registry/blocks/features/features-004/features-004").then(
      (module) => module.Features004,
    ),
  ),
  "features-005": dynamic(() =>
    import("@/registry/blocks/features/features-005/features-005").then(
      (module) => module.Features005,
    ),
  ),
  "features-006": dynamic(() =>
    import("@/registry/blocks/features/features-006/features-006").then(
      (module) => module.Features006,
    ),
  ),
  "features-007": dynamic(() =>
    import("@/registry/blocks/features/features-007/features-007").then(
      (module) => module.Features007,
    ),
  ),
  "features-008": dynamic(() =>
    import("@/registry/blocks/features/features-008/features-008").then(
      (module) => module.Features008,
    ),
  ),
  "features-009": dynamic(() =>
    import("@/registry/blocks/features/features-009/features-009").then(
      (module) => module.Features009,
    ),
  ),
  "features-010": dynamic(() =>
    import("@/registry/blocks/features/features-010/features-010").then(
      (module) => module.Features010,
    ),
  ),
  "features-011": dynamic(() =>
    import("@/registry/blocks/features/features-011/features-011").then(
      (module) => module.Features011,
    ),
  ),
  "features-012": dynamic(() =>
    import("@/registry/blocks/features/features-012/features-012").then(
      (module) => module.Features012,
    ),
  ),
  "features-013": dynamic(() =>
    import("@/registry/blocks/features/features-013/features-013").then(
      (module) => module.Features013,
    ),
  ),
  "features-014": dynamic(() =>
    import("@/registry/blocks/features/features-014/features-014").then(
      (module) => module.Features014,
    ),
  ),
  "features-015": dynamic(() =>
    import("@/registry/blocks/features/features-015/features-015").then(
      (module) => module.Features015,
    ),
  ),
  "pricing-001": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-001/pricing-001").then(
      (module) => module.Pricing001,
    ),
  ),
  "pricing-002": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-002/pricing-002").then(
      (module) => module.Pricing002,
    ),
  ),
  "pricing-003": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-003/pricing-003").then(
      (module) => module.Pricing003,
    ),
  ),
  "pricing-004": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-004/pricing-004").then(
      (module) => module.Pricing004,
    ),
  ),
  "pricing-005": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-005/pricing-005").then(
      (module) => module.Pricing005,
    ),
  ),
  "pricing-006": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-006/pricing-006").then(
      (module) => module.Pricing006,
    ),
  ),
  "pricing-007": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-007/pricing-007").then(
      (module) => module.Pricing007,
    ),
  ),
  "pricing-008": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-008/pricing-008").then(
      (module) => module.Pricing008,
    ),
  ),
  "pricing-009": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-009/pricing-009").then(
      (module) => module.Pricing009,
    ),
  ),
  "pricing-010": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-010/pricing-010").then(
      (module) => module.Pricing010,
    ),
  ),
  "pricing-011": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-011/pricing-011").then(
      (module) => module.Pricing011,
    ),
  ),
  "pricing-012": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-012/pricing-012").then(
      (module) => module.Pricing012,
    ),
  ),
  "pricing-013": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-013/pricing-013").then(
      (module) => module.Pricing013,
    ),
  ),
  "pricing-014": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-014/pricing-014").then(
      (module) => module.Pricing014,
    ),
  ),
  "pricing-015": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-015/pricing-015").then(
      (module) => module.Pricing015,
    ),
  ),
  "pricing-016": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-016/pricing-016").then(
      (module) => module.Pricing016,
    ),
  ),
  "pricing-017": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-017/pricing-017").then(
      (module) => module.Pricing017,
    ),
  ),
  "pricing-018": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-018/pricing-018").then(
      (module) => module.Pricing018,
    ),
  ),
  "pricing-019": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-019/pricing-019").then(
      (module) => module.Pricing019,
    ),
  ),
  "testimonials-001": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-001/testimonials-001").then(
      (module) => module.Testimonials001,
    ),
  ),
  "testimonials-002": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-002/testimonials-002").then(
      (module) => module.Testimonials002,
    ),
  ),
  "testimonials-003": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-003/testimonials-003").then(
      (module) => module.Testimonials003,
    ),
  ),
  "testimonials-004": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-004/testimonials-004").then(
      (module) => module.Testimonials004,
    ),
  ),
  "testimonials-005": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-005/testimonials-005").then(
      (module) => module.Testimonials005,
    ),
  ),
  "testimonials-006": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-006/testimonials-006").then(
      (module) => module.Testimonials006,
    ),
  ),
  "faq-001": dynamic(() =>
    import("@/registry/blocks/faq/faq-001/faq-001").then(
      (module) => module.Faq001,
    ),
  ),
  "faq-002": dynamic(() =>
    import("@/registry/blocks/faq/faq-002/faq-002").then(
      (module) => module.Faq002,
    ),
  ),
  "faq-003": dynamic(() =>
    import("@/registry/blocks/faq/faq-003/faq-003").then(
      (module) => module.Faq003,
    ),
  ),
  "faq-004": dynamic(() =>
    import("@/registry/blocks/faq/faq-004/faq-004").then(
      (module) => module.Faq004,
    ),
  ),
  "faq-005": dynamic(() =>
    import("@/registry/blocks/faq/faq-005/faq-005").then(
      (module) => module.Faq005,
    ),
  ),
  "faq-006": dynamic(() =>
    import("@/registry/blocks/faq/faq-006/faq-006").then(
      (module) => module.Faq006,
    ),
  ),
  "cta-001": dynamic(() =>
    import("@/registry/blocks/cta/cta-001/cta-001").then(
      (module) => module.Cta001,
    ),
  ),
  "cta-002": dynamic(() =>
    import("@/registry/blocks/cta/cta-002/cta-002").then(
      (module) => module.Cta002,
    ),
  ),
  "cta-003": dynamic(() =>
    import("@/registry/blocks/cta/cta-003/cta-003").then(
      (module) => module.Cta003,
    ),
  ),
  "cta-004": dynamic(() =>
    import("@/registry/blocks/cta/cta-004/cta-004").then(
      (module) => module.Cta004,
    ),
  ),
  "cta-005": dynamic(() =>
    import("@/registry/blocks/cta/cta-005/cta-005").then(
      (module) => module.Cta005,
    ),
  ),
  "cta-006": dynamic(() =>
    import("@/registry/blocks/cta/cta-006/cta-006").then(
      (module) => module.Cta006,
    ),
  ),
  "footer-001": dynamic(() =>
    import("@/registry/blocks/footer/footer-001/footer-001").then(
      (module) => module.Footer001,
    ),
  ),
  "footer-002": dynamic(() =>
    import("@/registry/blocks/footer/footer-002/footer-002").then(
      (module) => module.Footer002,
    ),
  ),
  "footer-003": dynamic(() =>
    import("@/registry/blocks/footer/footer-003/footer-003").then(
      (module) => module.Footer003,
    ),
  ),
  "footer-004": dynamic(() =>
    import("@/registry/blocks/footer/footer-004/footer-004").then(
      (module) => module.Footer004,
    ),
  ),
  "footer-005": dynamic(() =>
    import("@/registry/blocks/footer/footer-005/footer-005").then(
      (module) => module.Footer005,
    ),
  ),
  "footer-006": dynamic(() =>
    import("@/registry/blocks/footer/footer-006/footer-006").then(
      (module) => module.Footer006,
    ),
  ),
  "footer-007": dynamic(() =>
    import("@/registry/blocks/footer/footer-007/footer-007").then(
      (module) => module.Footer007,
    ),
  ),
  "footer-008": dynamic(() =>
    import("@/registry/blocks/footer/footer-008/footer-008").then(
      (module) => module.Footer008,
    ),
  ),
  "ai-001": dynamic(() =>
    import("@/registry/blocks/ai/ai-001/ai-001").then((module) => module.Ai001),
  ),
  "ai-002": dynamic(() =>
    import("@/registry/blocks/ai/ai-002/ai-002").then((module) => module.Ai002),
  ),
  "ai-003": dynamic(() =>
    import("@/registry/blocks/ai/ai-003/ai-003").then((module) => module.Ai003),
  ),
  "ai-004": dynamic(() =>
    import("@/registry/blocks/ai/ai-004/ai-004").then((module) => module.Ai004),
  ),
  "ai-005": dynamic(() =>
    import("@/registry/blocks/ai/ai-005/ai-005").then((module) => module.Ai005),
  ),
  "ai-006": dynamic(() =>
    import("@/registry/blocks/ai/ai-006/ai-006").then((module) => module.Ai006),
  ),
  "ai-007": dynamic(() =>
    import("@/registry/blocks/ai/ai-007/ai-007").then((module) => module.Ai007),
  ),
  "ai-008": dynamic(() =>
    import("@/registry/blocks/ai/ai-008/ai-008").then((module) => module.Ai008),
  ),
  "ai-009": dynamic(() =>
    import("@/registry/blocks/ai/ai-009/ai-009").then((module) => module.Ai009),
  ),
  "ai-010": dynamic(() =>
    import("@/registry/blocks/ai/ai-010/ai-010").then((module) => module.Ai010),
  ),
  "ai-011": dynamic(() =>
    import("@/registry/blocks/ai/ai-011/ai-011").then((module) => module.Ai011),
  ),
  "ai-012": dynamic(() =>
    import("@/registry/blocks/ai/ai-012/ai-012").then((module) => module.Ai012),
  ),
  "ai-013": dynamic(() =>
    import("@/registry/blocks/ai/ai-013/ai-013").then((module) => module.Ai013),
  ),
  "ai-014": dynamic(() =>
    import("@/registry/blocks/ai/ai-014/ai-014").then((module) => module.Ai014),
  ),
  "ai-015": dynamic(() =>
    import("@/registry/blocks/ai/ai-015/ai-015").then((module) => module.Ai015),
  ),
  "ai-016": dynamic(() =>
    import("@/registry/blocks/ai/ai-016/ai-016").then((module) => module.Ai016),
  ),
  "ai-017": dynamic(() =>
    import("@/registry/blocks/ai/ai-017/ai-017").then((module) => module.Ai017),
  ),
  "ai-018": dynamic(() =>
    import("@/registry/blocks/ai/ai-018/ai-018").then((module) => module.Ai018),
  ),
  "ai-019": dynamic(() =>
    import("@/registry/blocks/ai/ai-019/ai-019").then((module) => module.Ai019),
  ),
  "dashboard-001": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-001/dashboard-001").then(
      (module) => module.Dashboard001,
    ),
  ),
  "dashboard-002": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-002/dashboard-002").then(
      (module) => module.Dashboard002,
    ),
  ),
  "dashboard-003": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-003/dashboard-003").then(
      (module) => module.Dashboard003,
    ),
  ),
  "dashboard-004": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-004/dashboard-004").then(
      (module) => module.Dashboard004,
    ),
  ),
  "dashboard-005": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-005/dashboard-005").then(
      (module) => module.Dashboard005,
    ),
  ),
  "dashboard-006": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-006/dashboard-006").then(
      (module) => module.Dashboard006,
    ),
  ),
  "dashboard-007": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-007/dashboard-007").then(
      (module) => module.Dashboard007,
    ),
  ),
  "dashboard-008": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-008/dashboard-008").then(
      (module) => module.Dashboard008,
    ),
  ),
  "dashboard-009": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-009/dashboard-009").then(
      (module) => module.Dashboard009,
    ),
  ),
  "dashboard-010": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-010/dashboard-010").then(
      (module) => module.Dashboard010,
    ),
  ),
  "dashboard-011": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-011/dashboard-011").then(
      (module) => module.Dashboard011,
    ),
  ),
  "dashboard-012": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-012/dashboard-012").then(
      (module) => module.Dashboard012,
    ),
  ),
  "dashboard-013": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-013/dashboard-013").then(
      (module) => module.Dashboard013,
    ),
  ),
  "dashboard-014": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-014/dashboard-014").then(
      (module) => module.Dashboard014,
    ),
  ),
  "dashboard-015": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-015/dashboard-015").then(
      (module) => module.Dashboard015,
    ),
  ),
  "dashboard-016": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-016/dashboard-016").then(
      (module) => module.Dashboard016,
    ),
  ),
  "dashboard-017": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-017/dashboard-017").then(
      (module) => module.Dashboard017,
    ),
  ),
  "dashboard-018": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-018/dashboard-018").then(
      (module) => module.Dashboard018,
    ),
  ),
  "dashboard-019": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-019/dashboard-019").then(
      (module) => module.Dashboard019,
    ),
  ),
  "dashboard-020": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-020/dashboard-020").then(
      (module) => module.Dashboard020,
    ),
  ),
  "dashboard-021": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-021/dashboard-021").then(
      (module) => module.Dashboard021,
    ),
  ),
  "dashboard-022": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-022/dashboard-022").then(
      (module) => module.Dashboard022,
    ),
  ),
  "dashboard-023": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-023/dashboard-023").then(
      (module) => module.Dashboard023,
    ),
  ),
  "dashboard-024": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-024/dashboard-024").then(
      (module) => module.Dashboard024,
    ),
  ),
  "dashboard-025": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-025/dashboard-025").then(
      (module) => module.Dashboard025,
    ),
  ),
  "dashboard-026": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-026/dashboard-026").then(
      (module) => module.Dashboard026,
    ),
  ),
  "dashboard-027": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-027/dashboard-027").then(
      (module) => module.Dashboard027,
    ),
  ),
  "dashboard-028": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-028/dashboard-028").then(
      (module) => module.Dashboard028,
    ),
  ),
  "dashboard-029": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-029/dashboard-029").then(
      (module) => module.Dashboard029,
    ),
  ),
  "dashboard-030": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-030/dashboard-030").then(
      (module) => module.Dashboard030,
    ),
  ),
  "dashboard-031": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-031/dashboard-031").then(
      (module) => module.Dashboard031,
    ),
  ),
  "dashboard-032": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-032/dashboard-032").then(
      (module) => module.Dashboard032,
    ),
  ),
  "dashboard-033": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-033/dashboard-033").then(
      (module) => module.Dashboard033,
    ),
  ),
  "dashboard-034": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-034/dashboard-034").then(
      (module) => module.Dashboard034,
    ),
  ),
  "dashboard-035": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-035/dashboard-035").then(
      (module) => module.Dashboard035,
    ),
  ),
  "dashboard-036": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-036/dashboard-036").then(
      (module) => module.Dashboard036,
    ),
  ),
  "dashboard-037": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-037/dashboard-037").then(
      (module) => module.Dashboard037,
    ),
  ),
  "dashboard-038": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-038/dashboard-038").then(
      (module) => module.Dashboard038,
    ),
  ),
  "dashboard-039": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-039/dashboard-039").then(
      (module) => module.Dashboard039,
    ),
  ),
  "dashboard-040": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-040/dashboard-040").then(
      (module) => module.Dashboard040,
    ),
  ),
  "dashboard-041": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-041/dashboard-041").then(
      (module) => module.Dashboard041,
    ),
  ),
  "dashboard-042": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-042/dashboard-042").then(
      (module) => module.Dashboard042,
    ),
  ),
  "dashboard-043": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-043/dashboard-043").then(
      (module) => module.Dashboard043,
    ),
  ),
  "dashboard-044": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-044/dashboard-044").then(
      (module) => module.Dashboard044,
    ),
  ),
  "dashboard-045": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-045/dashboard-045").then(
      (module) => module.Dashboard045,
    ),
  ),
  "dashboard-046": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-046/dashboard-046").then(
      (module) => module.Dashboard046,
    ),
  ),
  "dashboard-047": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-047/dashboard-047").then(
      (module) => module.Dashboard047,
    ),
  ),
  "dashboard-048": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-048/dashboard-048").then(
      (module) => module.Dashboard048,
    ),
  ),
  "dashboard-049": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-049/dashboard-049").then(
      (module) => module.Dashboard049,
    ),
  ),
  "dashboard-050": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-050/dashboard-050").then(
      (module) => module.Dashboard050,
    ),
  ),
  "dashboard-051": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-051/dashboard-051").then(
      (module) => module.Dashboard051,
    ),
  ),
  "dashboard-052": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-052/dashboard-052").then(
      (module) => module.Dashboard052,
    ),
  ),
  "dashboard-053": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-053/dashboard-053").then(
      (module) => module.Dashboard053,
    ),
  ),
  "dashboard-054": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-054/dashboard-054").then(
      (module) => module.Dashboard054,
    ),
  ),
  "dashboard-055": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-055/dashboard-055").then(
      (module) => module.Dashboard055,
    ),
  ),
  "dashboard-056": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-056/dashboard-056").then(
      (module) => module.Dashboard056,
    ),
  ),
  "dashboard-057": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-057/dashboard-057").then(
      (module) => module.Dashboard057,
    ),
  ),
  "dashboard-058": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-058/dashboard-058").then(
      (module) => module.Dashboard058,
    ),
  ),
  "dashboard-059": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-059/dashboard-059").then(
      (module) => module.Dashboard059,
    ),
  ),
  "dashboard-060": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-060/dashboard-060").then(
      (module) => module.Dashboard060,
    ),
  ),
  "dashboard-061": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-061/dashboard-061").then(
      (module) => module.Dashboard061,
    ),
  ),
  "dashboard-062": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-062/dashboard-062").then(
      (module) => module.Dashboard062,
    ),
  ),
  "dashboard-063": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-063/dashboard-063").then(
      (module) => module.Dashboard063,
    ),
  ),
  "dashboard-064": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-064/dashboard-064").then(
      (module) => module.Dashboard064,
    ),
  ),
  "dashboard-065": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-065/dashboard-065").then(
      (module) => module.Dashboard065,
    ),
  ),
  "dashboard-066": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-066/dashboard-066").then(
      (module) => module.Dashboard066,
    ),
  ),
  "dashboard-067": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-067/dashboard-067").then(
      (module) => module.Dashboard067,
    ),
  ),
  "dashboard-068": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-068/dashboard-068").then(
      (module) => module.Dashboard068,
    ),
  ),
  "dashboard-069": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-069/dashboard-069").then(
      (module) => module.Dashboard069,
    ),
  ),
  "dashboard-070": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-070/dashboard-070").then(
      (module) => module.Dashboard070,
    ),
  ),
  "dashboard-071": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-071/dashboard-071").then(
      (module) => module.Dashboard071,
    ),
  ),
  "dashboard-072": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-072/dashboard-072").then(
      (module) => module.Dashboard072,
    ),
  ),
  "dashboard-073": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-073/dashboard-073").then(
      (module) => module.Dashboard073,
    ),
  ),
  "dashboard-074": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-074/dashboard-074").then(
      (module) => module.Dashboard074,
    ),
  ),
  "dashboard-075": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-075/dashboard-075").then(
      (module) => module.Dashboard075,
    ),
  ),
  "dashboard-076": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-076/dashboard-076").then(
      (module) => module.Dashboard076,
    ),
  ),
  "dashboard-077": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-077/dashboard-077").then(
      (module) => module.Dashboard077,
    ),
  ),
  "dashboard-078": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-078/dashboard-078").then(
      (module) => module.Dashboard078,
    ),
  ),
  "dashboard-079": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-079/dashboard-079").then(
      (module) => module.Dashboard079,
    ),
  ),
  "dashboard-080": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-080/dashboard-080").then(
      (module) => module.Dashboard080,
    ),
  ),
  "dashboard-081": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-081/dashboard-081").then(
      (module) => module.Dashboard081,
    ),
  ),
  "dashboard-082": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-082/dashboard-082").then(
      (module) => module.Dashboard082,
    ),
  ),
  "dashboard-083": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-083/dashboard-083").then(
      (module) => module.Dashboard083,
    ),
  ),
  "dashboard-084": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-084/dashboard-084").then(
      (module) => module.Dashboard084,
    ),
  ),
  "dashboard-085": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-085/dashboard-085").then(
      (module) => module.Dashboard085,
    ),
  ),
  "dashboard-086": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-086/dashboard-086").then(
      (module) => module.Dashboard086,
    ),
  ),
  "dashboard-087": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-087/dashboard-087").then(
      (module) => module.Dashboard087,
    ),
  ),
  "dashboard-088": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-088/dashboard-088").then(
      (module) => module.Dashboard088,
    ),
  ),
  "dashboard-089": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-089/dashboard-089").then(
      (module) => module.Dashboard089,
    ),
  ),
  "dashboard-090": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-090/dashboard-090").then(
      (module) => module.Dashboard090,
    ),
  ),
  "dashboard-091": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-091/dashboard-091").then(
      (module) => module.Dashboard091,
    ),
  ),
  "dashboard-092": dynamic(() =>
    import("@/registry/blocks/dashboard/dashboard-092/dashboard-092").then(
      (module) => module.Dashboard092,
    ),
  ),
  "commerce-001": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-001/commerce-001").then(
      (module) => module.Commerce001,
    ),
  ),
  "commerce-002": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-002/commerce-002").then(
      (module) => module.Commerce002,
    ),
  ),
  "commerce-003": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-003/commerce-003").then(
      (module) => module.Commerce003,
    ),
  ),
  "commerce-004": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-004/commerce-004").then(
      (module) => module.Commerce004,
    ),
  ),
  "commerce-005": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-005/commerce-005").then(
      (module) => module.Commerce005,
    ),
  ),
  "commerce-006": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-006/commerce-006").then(
      (module) => module.Commerce006,
    ),
  ),
  "commerce-007": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-007/commerce-007").then(
      (module) => module.Commerce007,
    ),
  ),
  "commerce-008": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-008/commerce-008").then(
      (module) => module.Commerce008,
    ),
  ),
  "commerce-009": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-009/commerce-009").then(
      (module) => module.Commerce009,
    ),
  ),
  "commerce-010": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-010/commerce-010").then(
      (module) => module.Commerce010,
    ),
  ),
  "commerce-011": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-011/commerce-011").then(
      (module) => module.Commerce011,
    ),
  ),
  "commerce-012": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-012/commerce-012").then(
      (module) => module.Commerce012,
    ),
  ),
  "commerce-013": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-013/commerce-013").then(
      (module) => module.Commerce013,
    ),
  ),
  "commerce-014": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-014/commerce-014").then(
      (module) => module.Commerce014,
    ),
  ),
  "commerce-015": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-015/commerce-015").then(
      (module) => module.Commerce015,
    ),
  ),
  "commerce-016": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-016/commerce-016").then(
      (module) => module.Commerce016,
    ),
  ),
  "commerce-017": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-017/commerce-017").then(
      (module) => module.Commerce017,
    ),
  ),
  "commerce-018": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-018/commerce-018").then(
      (module) => module.Commerce018,
    ),
  ),
  "commerce-019": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-019/commerce-019").then(
      (module) => module.Commerce019,
    ),
  ),
  "commerce-020": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-020/commerce-020").then(
      (module) => module.Commerce020,
    ),
  ),
  "commerce-021": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-021/commerce-021").then(
      (module) => module.Commerce021,
    ),
  ),
  "commerce-022": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-022/commerce-022").then(
      (module) => module.Commerce022,
    ),
  ),
  "commerce-023": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-023/commerce-023").then(
      (module) => module.Commerce023,
    ),
  ),
  "commerce-024": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-024/commerce-024").then(
      (module) => module.Commerce024,
    ),
  ),
  "commerce-025": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-025/commerce-025").then(
      (module) => module.Commerce025,
    ),
  ),
  "commerce-026": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-026/commerce-026").then(
      (module) => module.Commerce026,
    ),
  ),
  "commerce-027": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-027/commerce-027").then(
      (module) => module.Commerce027,
    ),
  ),
  "commerce-028": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-028/commerce-028").then(
      (module) => module.Commerce028,
    ),
  ),
  "commerce-029": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-029/commerce-029").then(
      (module) => module.Commerce029,
    ),
  ),
  "commerce-030": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-030/commerce-030").then(
      (module) => module.Commerce030,
    ),
  ),
  "commerce-031": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-031/commerce-031").then(
      (module) => module.Commerce031,
    ),
  ),
  "commerce-032": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-032/commerce-032").then(
      (module) => module.Commerce032,
    ),
  ),
  "commerce-033": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-033/commerce-033").then(
      (module) => module.Commerce033,
    ),
  ),
  "commerce-034": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-034/commerce-034").then(
      (module) => module.Commerce034,
    ),
  ),
  "commerce-035": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-035/commerce-035").then(
      (module) => module.Commerce035,
    ),
  ),
  "commerce-036": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-036/commerce-036").then(
      (module) => module.Commerce036,
    ),
  ),
  "commerce-037": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-037/commerce-037").then(
      (module) => module.Commerce037,
    ),
  ),
  "commerce-038": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-038/commerce-038").then(
      (module) => module.Commerce038,
    ),
  ),
  "commerce-039": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-039/commerce-039").then(
      (module) => module.Commerce039,
    ),
  ),
  "commerce-040": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-040/commerce-040").then(
      (module) => module.Commerce040,
    ),
  ),
  "commerce-041": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-041/commerce-041").then(
      (module) => module.Commerce041,
    ),
  ),
  "commerce-042": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-042/commerce-042").then(
      (module) => module.Commerce042,
    ),
  ),
  "commerce-043": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-043/commerce-043").then(
      (module) => module.Commerce043,
    ),
  ),
  "commerce-044": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-044/commerce-044").then(
      (module) => module.Commerce044,
    ),
  ),
  "commerce-045": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-045/commerce-045").then(
      (module) => module.Commerce045,
    ),
  ),
  "commerce-046": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-046/commerce-046").then(
      (module) => module.Commerce046,
    ),
  ),
  "commerce-047": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-047/commerce-047").then(
      (module) => module.Commerce047,
    ),
  ),
  "commerce-048": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-048/commerce-048").then(
      (module) => module.Commerce048,
    ),
  ),
  "commerce-049": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-049/commerce-049").then(
      (module) => module.Commerce049,
    ),
  ),
  "commerce-050": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-050/commerce-050").then(
      (module) => module.Commerce050,
    ),
  ),
  "commerce-051": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-051/commerce-051").then(
      (module) => module.Commerce051,
    ),
  ),
  "commerce-052": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-052/commerce-052").then(
      (module) => module.Commerce052,
    ),
  ),
  "commerce-053": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-053/commerce-053").then(
      (module) => module.Commerce053,
    ),
  ),
  "commerce-054": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-054/commerce-054").then(
      (module) => module.Commerce054,
    ),
  ),
  "commerce-055": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-055/commerce-055").then(
      (module) => module.Commerce055,
    ),
  ),
  "commerce-056": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-056/commerce-056").then(
      (module) => module.Commerce056,
    ),
  ),
  "commerce-057": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-057/commerce-057").then(
      (module) => module.Commerce057,
    ),
  ),
  "commerce-058": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-058/commerce-058").then(
      (module) => module.Commerce058,
    ),
  ),
  "commerce-059": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-059/commerce-059").then(
      (module) => module.Commerce059,
    ),
  ),
  "commerce-060": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-060/commerce-060").then(
      (module) => module.Commerce060,
    ),
  ),
  "commerce-061": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-061/commerce-061").then(
      (module) => module.Commerce061,
    ),
  ),
  "commerce-062": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-062/commerce-062").then(
      (module) => module.Commerce062,
    ),
  ),
  "commerce-063": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-063/commerce-063").then(
      (module) => module.Commerce063,
    ),
  ),
  "commerce-064": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-064/commerce-064").then(
      (module) => module.Commerce064,
    ),
  ),
  "commerce-065": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-065/commerce-065").then(
      (module) => module.Commerce065,
    ),
  ),
  "commerce-066": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-066/commerce-066").then(
      (module) => module.Commerce066,
    ),
  ),
  "commerce-067": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-067/commerce-067").then(
      (module) => module.Commerce067,
    ),
  ),
  "commerce-068": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-068/commerce-068").then(
      (module) => module.Commerce068,
    ),
  ),
  "commerce-069": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-069/commerce-069").then(
      (module) => module.Commerce069,
    ),
  ),
  "commerce-070": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-070/commerce-070").then(
      (module) => module.Commerce070,
    ),
  ),
  "commerce-071": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-071/commerce-071").then(
      (module) => module.Commerce071,
    ),
  ),
  "commerce-072": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-072/commerce-072").then(
      (module) => module.Commerce072,
    ),
  ),
  "commerce-073": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-073/commerce-073").then(
      (module) => module.Commerce073,
    ),
  ),
  "commerce-074": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-074/commerce-074").then(
      (module) => module.Commerce074,
    ),
  ),
  "commerce-075": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-075/commerce-075").then(
      (module) => module.Commerce075,
    ),
  ),
  "commerce-076": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-076/commerce-076").then(
      (module) => module.Commerce076,
    ),
  ),
  "commerce-077": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-077/commerce-077").then(
      (module) => module.Commerce077,
    ),
  ),
  "commerce-078": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-078/commerce-078").then(
      (module) => module.Commerce078,
    ),
  ),
  "commerce-079": dynamic(() =>
    import("@/registry/blocks/commerce/commerce-079/commerce-079").then(
      (module) => module.Commerce079,
    ),
  ),
  "auth-001": dynamic(() =>
    import("@/registry/blocks/auth/auth-001/auth-001").then(
      (module) => module.Auth001,
    ),
  ),
  "auth-002": dynamic(() =>
    import("@/registry/blocks/auth/auth-002/auth-002").then(
      (module) => module.Auth002,
    ),
  ),
  "auth-003": dynamic(() =>
    import("@/registry/blocks/auth/auth-003/auth-003").then(
      (module) => module.Auth003,
    ),
  ),
  "auth-004": dynamic(() =>
    import("@/registry/blocks/auth/auth-004/auth-004").then(
      (module) => module.Auth004,
    ),
  ),
  "auth-005": dynamic(() =>
    import("@/registry/blocks/auth/auth-005/auth-005").then(
      (module) => module.Auth005,
    ),
  ),
  "auth-006": dynamic(() =>
    import("@/registry/blocks/auth/auth-006/auth-006").then(
      (module) => module.Auth006,
    ),
  ),
  "auth-007": dynamic(() =>
    import("@/registry/blocks/auth/auth-007/auth-007").then(
      (module) => module.Auth007,
    ),
  ),
  "auth-008": dynamic(() =>
    import("@/registry/blocks/auth/auth-008/auth-008").then(
      (module) => module.Auth008,
    ),
  ),
  "auth-009": dynamic(() =>
    import("@/registry/blocks/auth/auth-009/auth-009").then(
      (module) => module.Auth009,
    ),
  ),
  "auth-010": dynamic(() =>
    import("@/registry/blocks/auth/auth-010/auth-010").then(
      (module) => module.Auth010,
    ),
  ),
  "auth-011": dynamic(() =>
    import("@/registry/blocks/auth/auth-011/auth-011").then(
      (module) => module.Auth011,
    ),
  ),
  "auth-012": dynamic(() =>
    import("@/registry/blocks/auth/auth-012/auth-012").then(
      (module) => module.Auth012,
    ),
  ),
  "auth-013": dynamic(() =>
    import("@/registry/blocks/auth/auth-013/auth-013").then(
      (module) => module.Auth013,
    ),
  ),
  "auth-014": dynamic(() =>
    import("@/registry/blocks/auth/auth-014/auth-014").then(
      (module) => module.Auth014,
    ),
  ),
  "auth-015": dynamic(() =>
    import("@/registry/blocks/auth/auth-015/auth-015").then(
      (module) => module.Auth015,
    ),
  ),
  "auth-016": dynamic(() =>
    import("@/registry/blocks/auth/auth-016/auth-016").then(
      (module) => module.Auth016,
    ),
  ),
  "auth-017": dynamic(() =>
    import("@/registry/blocks/auth/auth-017/auth-017").then(
      (module) => module.Auth017,
    ),
  ),
  "auth-018": dynamic(() =>
    import("@/registry/blocks/auth/auth-018/auth-018").then(
      (module) => module.Auth018,
    ),
  ),
  "auth-019": dynamic(() =>
    import("@/registry/blocks/auth/auth-019/auth-019").then(
      (module) => module.Auth019,
    ),
  ),
  "auth-020": dynamic(() =>
    import("@/registry/blocks/auth/auth-020/auth-020").then(
      (module) => module.Auth020,
    ),
  ),
  "auth-021": dynamic(() =>
    import("@/registry/blocks/auth/auth-021/auth-021").then(
      (module) => module.Auth021,
    ),
  ),
  "auth-022": dynamic(() =>
    import("@/registry/blocks/auth/auth-022/auth-022").then(
      (module) => module.Auth022,
    ),
  ),
  "auth-023": dynamic(() =>
    import("@/registry/blocks/auth/auth-023/auth-023").then(
      (module) => module.Auth023,
    ),
  ),
  "auth-024": dynamic(() =>
    import("@/registry/blocks/auth/auth-024/auth-024").then(
      (module) => module.Auth024,
    ),
  ),
  "auth-025": dynamic(() =>
    import("@/registry/blocks/auth/auth-025/auth-025").then(
      (module) => module.Auth025,
    ),
  ),
  "auth-026": dynamic(() =>
    import("@/registry/blocks/auth/auth-026/auth-026").then(
      (module) => module.Auth026,
    ),
  ),
  "auth-027": dynamic(() =>
    import("@/registry/blocks/auth/auth-027/auth-027").then(
      (module) => module.Auth027,
    ),
  ),
  "auth-028": dynamic(() =>
    import("@/registry/blocks/auth/auth-028/auth-028").then(
      (module) => module.Auth028,
    ),
  ),
  "auth-029": dynamic(() =>
    import("@/registry/blocks/auth/auth-029/auth-029").then(
      (module) => module.Auth029,
    ),
  ),
  "solutions-001": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-001/solutions-001").then(
      (module) => module.Solutions001,
    ),
  ),
  "solutions-002": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-002/solutions-002").then(
      (module) => module.Solutions002,
    ),
  ),
  "solutions-003": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-003/solutions-003").then(
      (module) => module.Solutions003,
    ),
  ),
  "solutions-004": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-004/solutions-004").then(
      (module) => module.Solutions004,
    ),
  ),
  "solutions-005": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-005/solutions-005").then(
      (module) => module.Solutions005,
    ),
  ),
  "solutions-006": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-006/solutions-006").then(
      (module) => module.Solutions006,
    ),
  ),
  "solutions-007": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-007/solutions-007").then(
      (module) => module.Solutions007,
    ),
  ),
  "solutions-008": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-008/solutions-008").then(
      (module) => module.Solutions008,
    ),
  ),
  "solutions-009": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-009/solutions-009").then(
      (module) => module.Solutions009,
    ),
  ),
  "solutions-010": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-010/solutions-010").then(
      (module) => module.Solutions010,
    ),
  ),
  "solutions-011": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-011/solutions-011").then(
      (module) => module.Solutions011,
    ),
  ),
  "solutions-012": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-012/solutions-012").then(
      (module) => module.Solutions012,
    ),
  ),
  "solutions-013": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-013/solutions-013").then(
      (module) => module.Solutions013,
    ),
  ),
  "solutions-014": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-014/solutions-014").then(
      (module) => module.Solutions014,
    ),
  ),
  "solutions-015": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-015/solutions-015").then(
      (module) => module.Solutions015,
    ),
  ),
  "solutions-016": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-016/solutions-016").then(
      (module) => module.Solutions016,
    ),
  ),
  "solutions-017": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-017/solutions-017").then(
      (module) => module.Solutions017,
    ),
  ),
  "solutions-018": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-018/solutions-018").then(
      (module) => module.Solutions018,
    ),
  ),
  "solutions-019": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-019/solutions-019").then(
      (module) => module.Solutions019,
    ),
  ),
  "solutions-020": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-020/solutions-020").then(
      (module) => module.Solutions020,
    ),
  ),
  "solutions-021": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-021/solutions-021").then(
      (module) => module.Solutions021,
    ),
  ),
  "solutions-022": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-022/solutions-022").then(
      (module) => module.Solutions022,
    ),
  ),
  "solutions-023": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-023/solutions-023").then(
      (module) => module.Solutions023,
    ),
  ),
  "solutions-024": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-024/solutions-024").then(
      (module) => module.Solutions024,
    ),
  ),
  "solutions-025": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-025/solutions-025").then(
      (module) => module.Solutions025,
    ),
  ),
  "solutions-026": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-026/solutions-026").then(
      (module) => module.Solutions026,
    ),
  ),
  "solutions-027": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-027/solutions-027").then(
      (module) => module.Solutions027,
    ),
  ),
  "solutions-028": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-028/solutions-028").then(
      (module) => module.Solutions028,
    ),
  ),
  "solutions-029": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-029/solutions-029").then(
      (module) => module.Solutions029,
    ),
  ),
  "solutions-030": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-030/solutions-030").then(
      (module) => module.Solutions030,
    ),
  ),
  "solutions-031": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-031/solutions-031").then(
      (module) => module.Solutions031,
    ),
  ),
  "solutions-032": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-032/solutions-032").then(
      (module) => module.Solutions032,
    ),
  ),
  "solutions-033": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-033/solutions-033").then(
      (module) => module.Solutions033,
    ),
  ),
  "solutions-034": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-034/solutions-034").then(
      (module) => module.Solutions034,
    ),
  ),
  "solutions-035": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-035/solutions-035").then(
      (module) => module.Solutions035,
    ),
  ),
  "solutions-036": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-036/solutions-036").then(
      (module) => module.Solutions036,
    ),
  ),
  "solutions-037": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-037/solutions-037").then(
      (module) => module.Solutions037,
    ),
  ),
  "solutions-038": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-038/solutions-038").then(
      (module) => module.Solutions038,
    ),
  ),
  "solutions-039": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-039/solutions-039").then(
      (module) => module.Solutions039,
    ),
  ),
  "solutions-040": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-040/solutions-040").then(
      (module) => module.Solutions040,
    ),
  ),
  "solutions-041": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-041/solutions-041").then(
      (module) => module.Solutions041,
    ),
  ),
  "solutions-042": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-042/solutions-042").then(
      (module) => module.Solutions042,
    ),
  ),
  "solutions-043": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-043/solutions-043").then(
      (module) => module.Solutions043,
    ),
  ),
  "solutions-044": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-044/solutions-044").then(
      (module) => module.Solutions044,
    ),
  ),
  "solutions-045": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-045/solutions-045").then(
      (module) => module.Solutions045,
    ),
  ),
  "solutions-046": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-046/solutions-046").then(
      (module) => module.Solutions046,
    ),
  ),
  "solutions-047": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-047/solutions-047").then(
      (module) => module.Solutions047,
    ),
  ),
  "solutions-048": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-048/solutions-048").then(
      (module) => module.Solutions048,
    ),
  ),
  "solutions-049": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-049/solutions-049").then(
      (module) => module.Solutions049,
    ),
  ),
  "solutions-050": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-050/solutions-050").then(
      (module) => module.Solutions050,
    ),
  ),
  "solutions-051": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-051/solutions-051").then(
      (module) => module.Solutions051,
    ),
  ),
  "solutions-052": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-052/solutions-052").then(
      (module) => module.Solutions052,
    ),
  ),
  "solutions-053": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-053/solutions-053").then(
      (module) => module.Solutions053,
    ),
  ),
  "solutions-054": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-054/solutions-054").then(
      (module) => module.Solutions054,
    ),
  ),
  "solutions-055": dynamic(() =>
    import("@/registry/blocks/solutions/solutions-055/solutions-055").then(
      (module) => module.Solutions055,
    ),
  ),
  "blog-001": dynamic(() =>
    import("@/registry/blocks/blog/blog-001/blog-001").then(
      (module) => module.Blog001,
    ),
  ),
  "blog-002": dynamic(() =>
    import("@/registry/blocks/blog/blog-002/blog-002").then(
      (module) => module.Blog002,
    ),
  ),
  "blog-003": dynamic(() =>
    import("@/registry/blocks/blog/blog-003/blog-003").then(
      (module) => module.Blog003,
    ),
  ),
  "blog-004": dynamic(() =>
    import("@/registry/blocks/blog/blog-004/blog-004").then(
      (module) => module.Blog004,
    ),
  ),
  "blog-005": dynamic(() =>
    import("@/registry/blocks/blog/blog-005/blog-005").then(
      (module) => module.Blog005,
    ),
  ),
  "blog-006": dynamic(() =>
    import("@/registry/blocks/blog/blog-006/blog-006").then(
      (module) => module.Blog006,
    ),
  ),
  "contact-001": dynamic(() =>
    import("@/registry/blocks/contact/contact-001/contact-001").then(
      (module) => module.Contact001,
    ),
  ),
  "contact-002": dynamic(() =>
    import("@/registry/blocks/contact/contact-002/contact-002").then(
      (module) => module.Contact002,
    ),
  ),
  "contact-003": dynamic(() =>
    import("@/registry/blocks/contact/contact-003/contact-003").then(
      (module) => module.Contact003,
    ),
  ),
  "contact-004": dynamic(() =>
    import("@/registry/blocks/contact/contact-004/contact-004").then(
      (module) => module.Contact004,
    ),
  ),
  "contact-005": dynamic(() =>
    import("@/registry/blocks/contact/contact-005/contact-005").then(
      (module) => module.Contact005,
    ),
  ),
  "contact-006": dynamic(() =>
    import("@/registry/blocks/contact/contact-006/contact-006").then(
      (module) => module.Contact006,
    ),
  ),
  "accordion-001": dynamic(() =>
    import("@/registry/components/accordion/accordion-001/accordion-001").then(
      (module) => module.Accordion001,
    ),
  ),
  "accordion-002": dynamic(() =>
    import("@/registry/components/accordion/accordion-002/accordion-002").then(
      (module) => module.Accordion002,
    ),
  ),
  "accordion-003": dynamic(() =>
    import("@/registry/components/accordion/accordion-003/accordion-003").then(
      (module) => module.Accordion003,
    ),
  ),
  "accordion-004": dynamic(() =>
    import("@/registry/components/accordion/accordion-004/accordion-004").then(
      (module) => module.Accordion004,
    ),
  ),
  "accordion-005": dynamic(() =>
    import("@/registry/components/accordion/accordion-005/accordion-005").then(
      (module) => module.Accordion005,
    ),
  ),
  "accordion-006": dynamic(() =>
    import("@/registry/components/accordion/accordion-006/accordion-006").then(
      (module) => module.Accordion006,
    ),
  ),
  "accordion-007": dynamic(() =>
    import("@/registry/components/accordion/accordion-007/accordion-007").then(
      (module) => module.Accordion007,
    ),
  ),
  "accordion-008": dynamic(() =>
    import("@/registry/components/accordion/accordion-008/accordion-008").then(
      (module) => module.Accordion008,
    ),
  ),
  "accordion-009": dynamic(() =>
    import("@/registry/components/accordion/accordion-009/accordion-009").then(
      (module) => module.Accordion009,
    ),
  ),
  "accordion-010": dynamic(() =>
    import("@/registry/components/accordion/accordion-010/accordion-010").then(
      (module) => module.Accordion010,
    ),
  ),
  "accordion-011": dynamic(() =>
    import("@/registry/components/accordion/accordion-011/accordion-011").then(
      (module) => module.Accordion011,
    ),
  ),
  "alert-001": dynamic(() =>
    import("@/registry/components/alert/alert-001/alert-001").then(
      (module) => module.Alert001,
    ),
  ),
  "alert-002": dynamic(() =>
    import("@/registry/components/alert/alert-002/alert-002").then(
      (module) => module.Alert002,
    ),
  ),
  "alert-003": dynamic(() =>
    import("@/registry/components/alert/alert-003/alert-003").then(
      (module) => module.Alert003,
    ),
  ),
  "alert-004": dynamic(() =>
    import("@/registry/components/alert/alert-004/alert-004").then(
      (module) => module.Alert004,
    ),
  ),
  "alert-005": dynamic(() =>
    import("@/registry/components/alert/alert-005/alert-005").then(
      (module) => module.Alert005,
    ),
  ),
  "alert-006": dynamic(() =>
    import("@/registry/components/alert/alert-006/alert-006").then(
      (module) => module.Alert006,
    ),
  ),
  "alert-007": dynamic(() =>
    import("@/registry/components/alert/alert-007/alert-007").then(
      (module) => module.Alert007,
    ),
  ),
  "alert-008": dynamic(() =>
    import("@/registry/components/alert/alert-008/alert-008").then(
      (module) => module.Alert008,
    ),
  ),
  "alert-009": dynamic(() =>
    import("@/registry/components/alert/alert-009/alert-009").then(
      (module) => module.Alert009,
    ),
  ),
  "alert-010": dynamic(() =>
    import("@/registry/components/alert/alert-010/alert-010").then(
      (module) => module.Alert010,
    ),
  ),
  "alert-011": dynamic(() =>
    import("@/registry/components/alert/alert-011/alert-011").then(
      (module) => module.Alert011,
    ),
  ),
  "alert-012": dynamic(() =>
    import("@/registry/components/alert/alert-012/alert-012").then(
      (module) => module.Alert012,
    ),
  ),
  "alert-013": dynamic(() =>
    import("@/registry/components/alert/alert-013/alert-013").then(
      (module) => module.Alert013,
    ),
  ),
  "alert-014": dynamic(() =>
    import("@/registry/components/alert/alert-014/alert-014").then(
      (module) => module.Alert014,
    ),
  ),
  "alert-015": dynamic(() =>
    import("@/registry/components/alert/alert-015/alert-015").then(
      (module) => module.Alert015,
    ),
  ),
  "alert-016": dynamic(() =>
    import("@/registry/components/alert/alert-016/alert-016").then(
      (module) => module.Alert016,
    ),
  ),
  "alert-017": dynamic(() =>
    import("@/registry/components/alert/alert-017/alert-017").then(
      (module) => module.Alert017,
    ),
  ),
  "alert-018": dynamic(() =>
    import("@/registry/components/alert/alert-018/alert-018").then(
      (module) => module.Alert018,
    ),
  ),
  "alert-019": dynamic(() =>
    import("@/registry/components/alert/alert-019/alert-019").then(
      (module) => module.Alert019,
    ),
  ),
  "alert-020": dynamic(() =>
    import("@/registry/components/alert/alert-020/alert-020").then(
      (module) => module.Alert020,
    ),
  ),
  "alertdialog-001": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-001/alertdialog-001").then(
      (module) => module.Alertdialog001,
    ),
  ),
  "alertdialog-002": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-002/alertdialog-002").then(
      (module) => module.Alertdialog002,
    ),
  ),
  "alertdialog-003": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-003/alertdialog-003").then(
      (module) => module.Alertdialog003,
    ),
  ),
  "alertdialog-004": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-004/alertdialog-004").then(
      (module) => module.Alertdialog004,
    ),
  ),
  "alertdialog-005": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-005/alertdialog-005").then(
      (module) => module.Alertdialog005,
    ),
  ),
  "alertdialog-006": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-006/alertdialog-006").then(
      (module) => module.Alertdialog006,
    ),
  ),
  "alertdialog-007": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-007/alertdialog-007").then(
      (module) => module.Alertdialog007,
    ),
  ),
  "alertdialog-008": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-008/alertdialog-008").then(
      (module) => module.Alertdialog008,
    ),
  ),
  "alertdialog-009": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-009/alertdialog-009").then(
      (module) => module.Alertdialog009,
    ),
  ),
  "alertdialog-010": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-010/alertdialog-010").then(
      (module) => module.Alertdialog010,
    ),
  ),
  "alertdialog-011": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-011/alertdialog-011").then(
      (module) => module.Alertdialog011,
    ),
  ),
  "alertdialog-012": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-012/alertdialog-012").then(
      (module) => module.Alertdialog012,
    ),
  ),
  "alertdialog-013": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-013/alertdialog-013").then(
      (module) => module.Alertdialog013,
    ),
  ),
  "alertdialog-014": dynamic(() =>
    import("@/registry/components/alert-dialog/alertdialog-014/alertdialog-014").then(
      (module) => module.Alertdialog014,
    ),
  ),
  "aspect-001": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-001/aspect-001").then(
      (module) => module.Aspect001,
    ),
  ),
  "aspect-002": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-002/aspect-002").then(
      (module) => module.Aspect002,
    ),
  ),
  "aspect-003": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-003/aspect-003").then(
      (module) => module.Aspect003,
    ),
  ),
  "aspect-004": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-004/aspect-004").then(
      (module) => module.Aspect004,
    ),
  ),
  "aspect-005": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-005/aspect-005").then(
      (module) => module.Aspect005,
    ),
  ),
  "aspect-006": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-006/aspect-006").then(
      (module) => module.Aspect006,
    ),
  ),
  "aspect-007": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-007/aspect-007").then(
      (module) => module.Aspect007,
    ),
  ),
  "aspect-008": dynamic(() =>
    import("@/registry/components/aspect-ratio/aspect-008/aspect-008").then(
      (module) => module.Aspect008,
    ),
  ),
  "autocomplete-001": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-001/autocomplete-001").then(
      (module) => module.Autocomplete001,
    ),
  ),
  "autocomplete-002": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-002/autocomplete-002").then(
      (module) => module.Autocomplete002,
    ),
  ),
  "autocomplete-003": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-003/autocomplete-003").then(
      (module) => module.Autocomplete003,
    ),
  ),
  "autocomplete-004": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-004/autocomplete-004").then(
      (module) => module.Autocomplete004,
    ),
  ),
  "autocomplete-005": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-005/autocomplete-005").then(
      (module) => module.Autocomplete005,
    ),
  ),
  "autocomplete-006": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-006/autocomplete-006").then(
      (module) => module.Autocomplete006,
    ),
  ),
  "autocomplete-007": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-007/autocomplete-007").then(
      (module) => module.Autocomplete007,
    ),
  ),
  "autocomplete-008": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-008/autocomplete-008").then(
      (module) => module.Autocomplete008,
    ),
  ),
  "autocomplete-009": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-009/autocomplete-009").then(
      (module) => module.Autocomplete009,
    ),
  ),
  "autocomplete-010": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-010/autocomplete-010").then(
      (module) => module.Autocomplete010,
    ),
  ),
  "autocomplete-011": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-011/autocomplete-011").then(
      (module) => module.Autocomplete011,
    ),
  ),
  "autocomplete-012": dynamic(() =>
    import("@/registry/components/autocomplete/autocomplete-012/autocomplete-012").then(
      (module) => module.Autocomplete012,
    ),
  ),
  "avatar-001": dynamic(() =>
    import("@/registry/components/avatar/avatar-001/avatar-001").then(
      (module) => module.Avatar001,
    ),
  ),
  "avatar-002": dynamic(() =>
    import("@/registry/components/avatar/avatar-002/avatar-002").then(
      (module) => module.Avatar002,
    ),
  ),
  "avatar-003": dynamic(() =>
    import("@/registry/components/avatar/avatar-003/avatar-003").then(
      (module) => module.Avatar003,
    ),
  ),
  "avatar-004": dynamic(() =>
    import("@/registry/components/avatar/avatar-004/avatar-004").then(
      (module) => module.Avatar004,
    ),
  ),
  "avatar-005": dynamic(() =>
    import("@/registry/components/avatar/avatar-005/avatar-005").then(
      (module) => module.Avatar005,
    ),
  ),
  "avatar-006": dynamic(() =>
    import("@/registry/components/avatar/avatar-006/avatar-006").then(
      (module) => module.Avatar006,
    ),
  ),
  "avatar-007": dynamic(() =>
    import("@/registry/components/avatar/avatar-007/avatar-007").then(
      (module) => module.Avatar007,
    ),
  ),
  "avatar-008": dynamic(() =>
    import("@/registry/components/avatar/avatar-008/avatar-008").then(
      (module) => module.Avatar008,
    ),
  ),
  "avatar-009": dynamic(() =>
    import("@/registry/components/avatar/avatar-009/avatar-009").then(
      (module) => module.Avatar009,
    ),
  ),
  "avatar-010": dynamic(() =>
    import("@/registry/components/avatar/avatar-010/avatar-010").then(
      (module) => module.Avatar010,
    ),
  ),
  "avatar-011": dynamic(() =>
    import("@/registry/components/avatar/avatar-011/avatar-011").then(
      (module) => module.Avatar011,
    ),
  ),
  "avatar-012": dynamic(() =>
    import("@/registry/components/avatar/avatar-012/avatar-012").then(
      (module) => module.Avatar012,
    ),
  ),
  "avatar-013": dynamic(() =>
    import("@/registry/components/avatar/avatar-013/avatar-013").then(
      (module) => module.Avatar013,
    ),
  ),
  "avatar-014": dynamic(() =>
    import("@/registry/components/avatar/avatar-014/avatar-014").then(
      (module) => module.Avatar014,
    ),
  ),
  "avatar-015": dynamic(() =>
    import("@/registry/components/avatar/avatar-015/avatar-015").then(
      (module) => module.Avatar015,
    ),
  ),
  "avatar-016": dynamic(() =>
    import("@/registry/components/avatar/avatar-016/avatar-016").then(
      (module) => module.Avatar016,
    ),
  ),
  "avatar-017": dynamic(() =>
    import("@/registry/components/avatar/avatar-017/avatar-017").then(
      (module) => module.Avatar017,
    ),
  ),
  "avatar-018": dynamic(() =>
    import("@/registry/components/avatar/avatar-018/avatar-018").then(
      (module) => module.Avatar018,
    ),
  ),
  "avatar-019": dynamic(() =>
    import("@/registry/components/avatar/avatar-019/avatar-019").then(
      (module) => module.Avatar019,
    ),
  ),
  "avatar-020": dynamic(() =>
    import("@/registry/components/avatar/avatar-020/avatar-020").then(
      (module) => module.Avatar020,
    ),
  ),
  "avatar-021": dynamic(() =>
    import("@/registry/components/avatar/avatar-021/avatar-021").then(
      (module) => module.Avatar021,
    ),
  ),
  "avatar-022": dynamic(() =>
    import("@/registry/components/avatar/avatar-022/avatar-022").then(
      (module) => module.Avatar022,
    ),
  ),
  "avatar-023": dynamic(() =>
    import("@/registry/components/avatar/avatar-023/avatar-023").then(
      (module) => module.Avatar023,
    ),
  ),
  "avatar-024": dynamic(() =>
    import("@/registry/components/avatar/avatar-024/avatar-024").then(
      (module) => module.Avatar024,
    ),
  ),
  "avatar-025": dynamic(() =>
    import("@/registry/components/avatar/avatar-025/avatar-025").then(
      (module) => module.Avatar025,
    ),
  ),
  "avatar-026": dynamic(() =>
    import("@/registry/components/avatar/avatar-026/avatar-026").then(
      (module) => module.Avatar026,
    ),
  ),
  "avatar-027": dynamic(() =>
    import("@/registry/components/avatar/avatar-027/avatar-027").then(
      (module) => module.Avatar027,
    ),
  ),
  "avatar-028": dynamic(() =>
    import("@/registry/components/avatar/avatar-028/avatar-028").then(
      (module) => module.Avatar028,
    ),
  ),
  "avatar-029": dynamic(() =>
    import("@/registry/components/avatar/avatar-029/avatar-029").then(
      (module) => module.Avatar029,
    ),
  ),
  "avatar-030": dynamic(() =>
    import("@/registry/components/avatar/avatar-030/avatar-030").then(
      (module) => module.Avatar030,
    ),
  ),
  "avatar-031": dynamic(() =>
    import("@/registry/components/avatar/avatar-031/avatar-031").then(
      (module) => module.Avatar031,
    ),
  ),
  "avatar-032": dynamic(() =>
    import("@/registry/components/avatar/avatar-032/avatar-032").then(
      (module) => module.Avatar032,
    ),
  ),
  "avatar-033": dynamic(() =>
    import("@/registry/components/avatar/avatar-033/avatar-033").then(
      (module) => module.Avatar033,
    ),
  ),
  "avatar-034": dynamic(() =>
    import("@/registry/components/avatar/avatar-034/avatar-034").then(
      (module) => module.Avatar034,
    ),
  ),
  "avatar-035": dynamic(() =>
    import("@/registry/components/avatar/avatar-035/avatar-035").then(
      (module) => module.Avatar035,
    ),
  ),
  "badge-001": dynamic(() =>
    import("@/registry/components/badge/badge-001/badge-001").then(
      (module) => module.Badge001,
    ),
  ),
  "badge-002": dynamic(() =>
    import("@/registry/components/badge/badge-002/badge-002").then(
      (module) => module.Badge002,
    ),
  ),
  "badge-003": dynamic(() =>
    import("@/registry/components/badge/badge-003/badge-003").then(
      (module) => module.Badge003,
    ),
  ),
  "badge-004": dynamic(() =>
    import("@/registry/components/badge/badge-004/badge-004").then(
      (module) => module.Badge004,
    ),
  ),
  "badge-005": dynamic(() =>
    import("@/registry/components/badge/badge-005/badge-005").then(
      (module) => module.Badge005,
    ),
  ),
  "badge-006": dynamic(() =>
    import("@/registry/components/badge/badge-006/badge-006").then(
      (module) => module.Badge006,
    ),
  ),
  "badge-007": dynamic(() =>
    import("@/registry/components/badge/badge-007/badge-007").then(
      (module) => module.Badge007,
    ),
  ),
  "badge-008": dynamic(() =>
    import("@/registry/components/badge/badge-008/badge-008").then(
      (module) => module.Badge008,
    ),
  ),
  "badge-009": dynamic(() =>
    import("@/registry/components/badge/badge-009/badge-009").then(
      (module) => module.Badge009,
    ),
  ),
  "badge-010": dynamic(() =>
    import("@/registry/components/badge/badge-010/badge-010").then(
      (module) => module.Badge010,
    ),
  ),
  "badge-011": dynamic(() =>
    import("@/registry/components/badge/badge-011/badge-011").then(
      (module) => module.Badge011,
    ),
  ),
  "badge-012": dynamic(() =>
    import("@/registry/components/badge/badge-012/badge-012").then(
      (module) => module.Badge012,
    ),
  ),
  "badge-013": dynamic(() =>
    import("@/registry/components/badge/badge-013/badge-013").then(
      (module) => module.Badge013,
    ),
  ),
  "badge-014": dynamic(() =>
    import("@/registry/components/badge/badge-014/badge-014").then(
      (module) => module.Badge014,
    ),
  ),
  "badge-015": dynamic(() =>
    import("@/registry/components/badge/badge-015/badge-015").then(
      (module) => module.Badge015,
    ),
  ),
  "badge-016": dynamic(() =>
    import("@/registry/components/badge/badge-016/badge-016").then(
      (module) => module.Badge016,
    ),
  ),
  "badge-017": dynamic(() =>
    import("@/registry/components/badge/badge-017/badge-017").then(
      (module) => module.Badge017,
    ),
  ),
  "badge-018": dynamic(() =>
    import("@/registry/components/badge/badge-018/badge-018").then(
      (module) => module.Badge018,
    ),
  ),
  "badge-019": dynamic(() =>
    import("@/registry/components/badge/badge-019/badge-019").then(
      (module) => module.Badge019,
    ),
  ),
  "badge-020": dynamic(() =>
    import("@/registry/components/badge/badge-020/badge-020").then(
      (module) => module.Badge020,
    ),
  ),
  "badge-021": dynamic(() =>
    import("@/registry/components/badge/badge-021/badge-021").then(
      (module) => module.Badge021,
    ),
  ),
  "badge-022": dynamic(() =>
    import("@/registry/components/badge/badge-022/badge-022").then(
      (module) => module.Badge022,
    ),
  ),
  "badge-023": dynamic(() =>
    import("@/registry/components/badge/badge-023/badge-023").then(
      (module) => module.Badge023,
    ),
  ),
  "badge-024": dynamic(() =>
    import("@/registry/components/badge/badge-024/badge-024").then(
      (module) => module.Badge024,
    ),
  ),
  "badge-025": dynamic(() =>
    import("@/registry/components/badge/badge-025/badge-025").then(
      (module) => module.Badge025,
    ),
  ),
  "banner-001": dynamic(() =>
    import("@/registry/components/banner/banner-001/banner-001").then(
      (module) => module.Banner001,
    ),
  ),
  "banner-002": dynamic(() =>
    import("@/registry/components/banner/banner-002/banner-002").then(
      (module) => module.Banner002,
    ),
  ),
  "banner-003": dynamic(() =>
    import("@/registry/components/banner/banner-003/banner-003").then(
      (module) => module.Banner003,
    ),
  ),
  "banner-004": dynamic(() =>
    import("@/registry/components/banner/banner-004/banner-004").then(
      (module) => module.Banner004,
    ),
  ),
  "banner-005": dynamic(() =>
    import("@/registry/components/banner/banner-005/banner-005").then(
      (module) => module.Banner005,
    ),
  ),
  "banner-006": dynamic(() =>
    import("@/registry/components/banner/banner-006/banner-006").then(
      (module) => module.Banner006,
    ),
  ),
  "banner-007": dynamic(() =>
    import("@/registry/components/banner/banner-007/banner-007").then(
      (module) => module.Banner007,
    ),
  ),
  "banner-008": dynamic(() =>
    import("@/registry/components/banner/banner-008/banner-008").then(
      (module) => module.Banner008,
    ),
  ),
  "breadcrumb-001": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-001/breadcrumb-001").then(
      (module) => module.Breadcrumb001,
    ),
  ),
  "breadcrumb-002": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-002/breadcrumb-002").then(
      (module) => module.Breadcrumb002,
    ),
  ),
  "breadcrumb-003": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-003/breadcrumb-003").then(
      (module) => module.Breadcrumb003,
    ),
  ),
  "breadcrumb-004": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-004/breadcrumb-004").then(
      (module) => module.Breadcrumb004,
    ),
  ),
  "breadcrumb-005": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-005/breadcrumb-005").then(
      (module) => module.Breadcrumb005,
    ),
  ),
  "breadcrumb-006": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-006/breadcrumb-006").then(
      (module) => module.Breadcrumb006,
    ),
  ),
  "breadcrumb-007": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-007/breadcrumb-007").then(
      (module) => module.Breadcrumb007,
    ),
  ),
  "breadcrumb-008": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-008/breadcrumb-008").then(
      (module) => module.Breadcrumb008,
    ),
  ),
  "breadcrumb-009": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-009/breadcrumb-009").then(
      (module) => module.Breadcrumb009,
    ),
  ),
  "breadcrumb-010": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-010/breadcrumb-010").then(
      (module) => module.Breadcrumb010,
    ),
  ),
  "breadcrumb-011": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-011/breadcrumb-011").then(
      (module) => module.Breadcrumb011,
    ),
  ),
  "breadcrumb-012": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-012/breadcrumb-012").then(
      (module) => module.Breadcrumb012,
    ),
  ),
  "breadcrumb-013": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-013/breadcrumb-013").then(
      (module) => module.Breadcrumb013,
    ),
  ),
  "breadcrumb-014": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-014/breadcrumb-014").then(
      (module) => module.Breadcrumb014,
    ),
  ),
  "breadcrumb-015": dynamic(() =>
    import("@/registry/components/breadcrumb/breadcrumb-015/breadcrumb-015").then(
      (module) => module.Breadcrumb015,
    ),
  ),
  "button-001": dynamic(() =>
    import("@/registry/components/button/button-001/button-001").then(
      (module) => module.Button001,
    ),
  ),
  "button-002": dynamic(() =>
    import("@/registry/components/button/button-002/button-002").then(
      (module) => module.Button002,
    ),
  ),
  "button-003": dynamic(() =>
    import("@/registry/components/button/button-003/button-003").then(
      (module) => module.Button003,
    ),
  ),
  "button-004": dynamic(() =>
    import("@/registry/components/button/button-004/button-004").then(
      (module) => module.Button004,
    ),
  ),
  "button-005": dynamic(() =>
    import("@/registry/components/button/button-005/button-005").then(
      (module) => module.Button005,
    ),
  ),
  "button-006": dynamic(() =>
    import("@/registry/components/button/button-006/button-006").then(
      (module) => module.Button006,
    ),
  ),
  "button-007": dynamic(() =>
    import("@/registry/components/button/button-007/button-007").then(
      (module) => module.Button007,
    ),
  ),
  "button-008": dynamic(() =>
    import("@/registry/components/button/button-008/button-008").then(
      (module) => module.Button008,
    ),
  ),
  "button-009": dynamic(() =>
    import("@/registry/components/button/button-009/button-009").then(
      (module) => module.Button009,
    ),
  ),
  "button-010": dynamic(() =>
    import("@/registry/components/button/button-010/button-010").then(
      (module) => module.Button010,
    ),
  ),
  "button-011": dynamic(() =>
    import("@/registry/components/button/button-011/button-011").then(
      (module) => module.Button011,
    ),
  ),
  "button-012": dynamic(() =>
    import("@/registry/components/button/button-012/button-012").then(
      (module) => module.Button012,
    ),
  ),
  "button-013": dynamic(() =>
    import("@/registry/components/button/button-013/button-013").then(
      (module) => module.Button013,
    ),
  ),
  "button-014": dynamic(() =>
    import("@/registry/components/button/button-014/button-014").then(
      (module) => module.Button014,
    ),
  ),
  "button-015": dynamic(() =>
    import("@/registry/components/button/button-015/button-015").then(
      (module) => module.Button015,
    ),
  ),
  "button-016": dynamic(() =>
    import("@/registry/components/button/button-016/button-016").then(
      (module) => module.Button016,
    ),
  ),
  "button-017": dynamic(() =>
    import("@/registry/components/button/button-017/button-017").then(
      (module) => module.Button017,
    ),
  ),
  "button-018": dynamic(() =>
    import("@/registry/components/button/button-018/button-018").then(
      (module) => module.Button018,
    ),
  ),
  "button-019": dynamic(() =>
    import("@/registry/components/button/button-019/button-019").then(
      (module) => module.Button019,
    ),
  ),
  "button-020": dynamic(() =>
    import("@/registry/components/button/button-020/button-020").then(
      (module) => module.Button020,
    ),
  ),
  "button-021": dynamic(() =>
    import("@/registry/components/button/button-021/button-021").then(
      (module) => module.Button021,
    ),
  ),
  "button-022": dynamic(() =>
    import("@/registry/components/button/button-022/button-022").then(
      (module) => module.Button022,
    ),
  ),
  "button-023": dynamic(() =>
    import("@/registry/components/button/button-023/button-023").then(
      (module) => module.Button023,
    ),
  ),
  "button-024": dynamic(() =>
    import("@/registry/components/button/button-024/button-024").then(
      (module) => module.Button024,
    ),
  ),
  "button-025": dynamic(() =>
    import("@/registry/components/button/button-025/button-025").then(
      (module) => module.Button025,
    ),
  ),
  "button-026": dynamic(() =>
    import("@/registry/components/button/button-026/button-026").then(
      (module) => module.Button026,
    ),
  ),
  "button-027": dynamic(() =>
    import("@/registry/components/button/button-027/button-027").then(
      (module) => module.Button027,
    ),
  ),
  "button-028": dynamic(() =>
    import("@/registry/components/button/button-028/button-028").then(
      (module) => module.Button028,
    ),
  ),
  "button-029": dynamic(() =>
    import("@/registry/components/button/button-029/button-029").then(
      (module) => module.Button029,
    ),
  ),
  "button-030": dynamic(() =>
    import("@/registry/components/button/button-030/button-030").then(
      (module) => module.Button030,
    ),
  ),
  "button-031": dynamic(() =>
    import("@/registry/components/button/button-031/button-031").then(
      (module) => module.Button031,
    ),
  ),
  "button-032": dynamic(() =>
    import("@/registry/components/button/button-032/button-032").then(
      (module) => module.Button032,
    ),
  ),
  "button-033": dynamic(() =>
    import("@/registry/components/button/button-033/button-033").then(
      (module) => module.Button033,
    ),
  ),
  "button-034": dynamic(() =>
    import("@/registry/components/button/button-034/button-034").then(
      (module) => module.Button034,
    ),
  ),
  "button-035": dynamic(() =>
    import("@/registry/components/button/button-035/button-035").then(
      (module) => module.Button035,
    ),
  ),
  "button-036": dynamic(() =>
    import("@/registry/components/button/button-036/button-036").then(
      (module) => module.Button036,
    ),
  ),
  "button-037": dynamic(() =>
    import("@/registry/components/button/button-037/button-037").then(
      (module) => module.Button037,
    ),
  ),
  "button-038": dynamic(() =>
    import("@/registry/components/button/button-038/button-038").then(
      (module) => module.Button038,
    ),
  ),
  "button-039": dynamic(() =>
    import("@/registry/components/button/button-039/button-039").then(
      (module) => module.Button039,
    ),
  ),
  "button-040": dynamic(() =>
    import("@/registry/components/button/button-040/button-040").then(
      (module) => module.Button040,
    ),
  ),
  "button-041": dynamic(() =>
    import("@/registry/components/button/button-041/button-041").then(
      (module) => module.Button041,
    ),
  ),
  "button-042": dynamic(() =>
    import("@/registry/components/button/button-042/button-042").then(
      (module) => module.Button042,
    ),
  ),
  "button-043": dynamic(() =>
    import("@/registry/components/button/button-043/button-043").then(
      (module) => module.Button043,
    ),
  ),
  "button-044": dynamic(() =>
    import("@/registry/components/button/button-044/button-044").then(
      (module) => module.Button044,
    ),
  ),
  "button-045": dynamic(() =>
    import("@/registry/components/button/button-045/button-045").then(
      (module) => module.Button045,
    ),
  ),
  "button-046": dynamic(() =>
    import("@/registry/components/button/button-046/button-046").then(
      (module) => module.Button046,
    ),
  ),
  "button-047": dynamic(() =>
    import("@/registry/components/button/button-047/button-047").then(
      (module) => module.Button047,
    ),
  ),
  "button-048": dynamic(() =>
    import("@/registry/components/button/button-048/button-048").then(
      (module) => module.Button048,
    ),
  ),
  "button-049": dynamic(() =>
    import("@/registry/components/button/button-049/button-049").then(
      (module) => module.Button049,
    ),
  ),
  "button-050": dynamic(() =>
    import("@/registry/components/button/button-050/button-050").then(
      (module) => module.Button050,
    ),
  ),
  "button-051": dynamic(() =>
    import("@/registry/components/button/button-051/button-051").then(
      (module) => module.Button051,
    ),
  ),
  "button-052": dynamic(() =>
    import("@/registry/components/button/button-052/button-052").then(
      (module) => module.Button052,
    ),
  ),
  "button-053": dynamic(() =>
    import("@/registry/components/button/button-053/button-053").then(
      (module) => module.Button053,
    ),
  ),
  "button-054": dynamic(() =>
    import("@/registry/components/button/button-054/button-054").then(
      (module) => module.Button054,
    ),
  ),
  "button-055": dynamic(() =>
    import("@/registry/components/button/button-055/button-055").then(
      (module) => module.Button055,
    ),
  ),
  "button-056": dynamic(() =>
    import("@/registry/components/button/button-056/button-056").then(
      (module) => module.Button056,
    ),
  ),
  "button-057": dynamic(() =>
    import("@/registry/components/button/button-057/button-057").then(
      (module) => module.Button057,
    ),
  ),
  "button-058": dynamic(() =>
    import("@/registry/components/button/button-058/button-058").then(
      (module) => module.Button058,
    ),
  ),
  "button-059": dynamic(() =>
    import("@/registry/components/button/button-059/button-059").then(
      (module) => module.Button059,
    ),
  ),
  "button-060": dynamic(() =>
    import("@/registry/components/button/button-060/button-060").then(
      (module) => module.Button060,
    ),
  ),
  "button-061": dynamic(() =>
    import("@/registry/components/button/button-061/button-061").then(
      (module) => module.Button061,
    ),
  ),
  "buttongroup-001": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-001/buttongroup-001").then(
      (module) => module.Buttongroup001,
    ),
  ),
  "buttongroup-002": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-002/buttongroup-002").then(
      (module) => module.Buttongroup002,
    ),
  ),
  "buttongroup-003": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-003/buttongroup-003").then(
      (module) => module.Buttongroup003,
    ),
  ),
  "buttongroup-004": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-004/buttongroup-004").then(
      (module) => module.Buttongroup004,
    ),
  ),
  "buttongroup-005": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-005/buttongroup-005").then(
      (module) => module.Buttongroup005,
    ),
  ),
  "buttongroup-006": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-006/buttongroup-006").then(
      (module) => module.Buttongroup006,
    ),
  ),
  "buttongroup-007": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-007/buttongroup-007").then(
      (module) => module.Buttongroup007,
    ),
  ),
  "buttongroup-008": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-008/buttongroup-008").then(
      (module) => module.Buttongroup008,
    ),
  ),
  "buttongroup-009": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-009/buttongroup-009").then(
      (module) => module.Buttongroup009,
    ),
  ),
  "buttongroup-010": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-010/buttongroup-010").then(
      (module) => module.Buttongroup010,
    ),
  ),
  "buttongroup-011": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-011/buttongroup-011").then(
      (module) => module.Buttongroup011,
    ),
  ),
  "buttongroup-012": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-012/buttongroup-012").then(
      (module) => module.Buttongroup012,
    ),
  ),
  "buttongroup-013": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-013/buttongroup-013").then(
      (module) => module.Buttongroup013,
    ),
  ),
  "buttongroup-014": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-014/buttongroup-014").then(
      (module) => module.Buttongroup014,
    ),
  ),
  "buttongroup-015": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-015/buttongroup-015").then(
      (module) => module.Buttongroup015,
    ),
  ),
  "buttongroup-016": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-016/buttongroup-016").then(
      (module) => module.Buttongroup016,
    ),
  ),
  "buttongroup-017": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-017/buttongroup-017").then(
      (module) => module.Buttongroup017,
    ),
  ),
  "buttongroup-018": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-018/buttongroup-018").then(
      (module) => module.Buttongroup018,
    ),
  ),
  "buttongroup-019": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-019/buttongroup-019").then(
      (module) => module.Buttongroup019,
    ),
  ),
  "buttongroup-020": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-020/buttongroup-020").then(
      (module) => module.Buttongroup020,
    ),
  ),
  "buttongroup-021": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-021/buttongroup-021").then(
      (module) => module.Buttongroup021,
    ),
  ),
  "buttongroup-022": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-022/buttongroup-022").then(
      (module) => module.Buttongroup022,
    ),
  ),
  "buttongroup-023": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-023/buttongroup-023").then(
      (module) => module.Buttongroup023,
    ),
  ),
  "buttongroup-024": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-024/buttongroup-024").then(
      (module) => module.Buttongroup024,
    ),
  ),
  "buttongroup-025": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-025/buttongroup-025").then(
      (module) => module.Buttongroup025,
    ),
  ),
  "buttongroup-026": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-026/buttongroup-026").then(
      (module) => module.Buttongroup026,
    ),
  ),
  "buttongroup-027": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-027/buttongroup-027").then(
      (module) => module.Buttongroup027,
    ),
  ),
  "buttongroup-028": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-028/buttongroup-028").then(
      (module) => module.Buttongroup028,
    ),
  ),
  "buttongroup-029": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-029/buttongroup-029").then(
      (module) => module.Buttongroup029,
    ),
  ),
  "buttongroup-030": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-030/buttongroup-030").then(
      (module) => module.Buttongroup030,
    ),
  ),
  "buttongroup-031": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-031/buttongroup-031").then(
      (module) => module.Buttongroup031,
    ),
  ),
  "buttongroup-032": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-032/buttongroup-032").then(
      (module) => module.Buttongroup032,
    ),
  ),
  "buttongroup-033": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-033/buttongroup-033").then(
      (module) => module.Buttongroup033,
    ),
  ),
  "buttongroup-034": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-034/buttongroup-034").then(
      (module) => module.Buttongroup034,
    ),
  ),
  "buttongroup-035": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-035/buttongroup-035").then(
      (module) => module.Buttongroup035,
    ),
  ),
  "buttongroup-036": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-036/buttongroup-036").then(
      (module) => module.Buttongroup036,
    ),
  ),
  "buttongroup-037": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-037/buttongroup-037").then(
      (module) => module.Buttongroup037,
    ),
  ),
  "buttongroup-038": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-038/buttongroup-038").then(
      (module) => module.Buttongroup038,
    ),
  ),
  "buttongroup-039": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-039/buttongroup-039").then(
      (module) => module.Buttongroup039,
    ),
  ),
  "buttongroup-040": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-040/buttongroup-040").then(
      (module) => module.Buttongroup040,
    ),
  ),
  "buttongroup-041": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-041/buttongroup-041").then(
      (module) => module.Buttongroup041,
    ),
  ),
  "buttongroup-042": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-042/buttongroup-042").then(
      (module) => module.Buttongroup042,
    ),
  ),
  "buttongroup-043": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-043/buttongroup-043").then(
      (module) => module.Buttongroup043,
    ),
  ),
  "buttongroup-044": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-044/buttongroup-044").then(
      (module) => module.Buttongroup044,
    ),
  ),
  "buttongroup-045": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-045/buttongroup-045").then(
      (module) => module.Buttongroup045,
    ),
  ),
  "buttongroup-046": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-046/buttongroup-046").then(
      (module) => module.Buttongroup046,
    ),
  ),
  "buttongroup-047": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-047/buttongroup-047").then(
      (module) => module.Buttongroup047,
    ),
  ),
  "buttongroup-048": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-048/buttongroup-048").then(
      (module) => module.Buttongroup048,
    ),
  ),
  "buttongroup-049": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-049/buttongroup-049").then(
      (module) => module.Buttongroup049,
    ),
  ),
  "buttongroup-050": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-050/buttongroup-050").then(
      (module) => module.Buttongroup050,
    ),
  ),
  "buttongroup-051": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-051/buttongroup-051").then(
      (module) => module.Buttongroup051,
    ),
  ),
  "buttongroup-052": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-052/buttongroup-052").then(
      (module) => module.Buttongroup052,
    ),
  ),
  "buttongroup-053": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-053/buttongroup-053").then(
      (module) => module.Buttongroup053,
    ),
  ),
  "buttongroup-054": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-054/buttongroup-054").then(
      (module) => module.Buttongroup054,
    ),
  ),
  "buttongroup-055": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-055/buttongroup-055").then(
      (module) => module.Buttongroup055,
    ),
  ),
  "buttongroup-056": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-056/buttongroup-056").then(
      (module) => module.Buttongroup056,
    ),
  ),
  "buttongroup-057": dynamic(() =>
    import("@/registry/components/button-group/buttongroup-057/buttongroup-057").then(
      (module) => module.Buttongroup057,
    ),
  ),
  "calendar-001": dynamic(() =>
    import("@/registry/components/calendar/calendar-001/calendar-001").then(
      (module) => module.Calendar001,
    ),
  ),
  "calendar-002": dynamic(() =>
    import("@/registry/components/calendar/calendar-002/calendar-002").then(
      (module) => module.Calendar002,
    ),
  ),
  "calendar-003": dynamic(() =>
    import("@/registry/components/calendar/calendar-003/calendar-003").then(
      (module) => module.Calendar003,
    ),
  ),
  "calendar-004": dynamic(() =>
    import("@/registry/components/calendar/calendar-004/calendar-004").then(
      (module) => module.Calendar004,
    ),
  ),
  "calendar-005": dynamic(() =>
    import("@/registry/components/calendar/calendar-005/calendar-005").then(
      (module) => module.Calendar005,
    ),
  ),
  "calendar-006": dynamic(() =>
    import("@/registry/components/calendar/calendar-006/calendar-006").then(
      (module) => module.Calendar006,
    ),
  ),
  "calendar-007": dynamic(() =>
    import("@/registry/components/calendar/calendar-007/calendar-007").then(
      (module) => module.Calendar007,
    ),
  ),
  "calendar-008": dynamic(() =>
    import("@/registry/components/calendar/calendar-008/calendar-008").then(
      (module) => module.Calendar008,
    ),
  ),
  "calendar-009": dynamic(() =>
    import("@/registry/components/calendar/calendar-009/calendar-009").then(
      (module) => module.Calendar009,
    ),
  ),
  "calendar-010": dynamic(() =>
    import("@/registry/components/calendar/calendar-010/calendar-010").then(
      (module) => module.Calendar010,
    ),
  ),
  "calendar-011": dynamic(() =>
    import("@/registry/components/calendar/calendar-011/calendar-011").then(
      (module) => module.Calendar011,
    ),
  ),
  "calendar-012": dynamic(() =>
    import("@/registry/components/calendar/calendar-012/calendar-012").then(
      (module) => module.Calendar012,
    ),
  ),
  "calendar-013": dynamic(() =>
    import("@/registry/components/calendar/calendar-013/calendar-013").then(
      (module) => module.Calendar013,
    ),
  ),
  "calendar-014": dynamic(() =>
    import("@/registry/components/calendar/calendar-014/calendar-014").then(
      (module) => module.Calendar014,
    ),
  ),
  "calendar-015": dynamic(() =>
    import("@/registry/components/calendar/calendar-015/calendar-015").then(
      (module) => module.Calendar015,
    ),
  ),
  "calendar-016": dynamic(() =>
    import("@/registry/components/calendar/calendar-016/calendar-016").then(
      (module) => module.Calendar016,
    ),
  ),
  "calendar-017": dynamic(() =>
    import("@/registry/components/calendar/calendar-017/calendar-017").then(
      (module) => module.Calendar017,
    ),
  ),
  "calendar-018": dynamic(() =>
    import("@/registry/components/calendar/calendar-018/calendar-018").then(
      (module) => module.Calendar018,
    ),
  ),
  "calendar-019": dynamic(() =>
    import("@/registry/components/calendar/calendar-019/calendar-019").then(
      (module) => module.Calendar019,
    ),
  ),
  "calendar-020": dynamic(() =>
    import("@/registry/components/calendar/calendar-020/calendar-020").then(
      (module) => module.Calendar020,
    ),
  ),
  "calendar-021": dynamic(() =>
    import("@/registry/components/calendar/calendar-021/calendar-021").then(
      (module) => module.Calendar021,
    ),
  ),
  "calendar-022": dynamic(() =>
    import("@/registry/components/calendar/calendar-022/calendar-022").then(
      (module) => module.Calendar022,
    ),
  ),
  "calendar-023": dynamic(() =>
    import("@/registry/components/calendar/calendar-023/calendar-023").then(
      (module) => module.Calendar023,
    ),
  ),
  "calendar-024": dynamic(() =>
    import("@/registry/components/calendar/calendar-024/calendar-024").then(
      (module) => module.Calendar024,
    ),
  ),
  "calendar-025": dynamic(() =>
    import("@/registry/components/calendar/calendar-025/calendar-025").then(
      (module) => module.Calendar025,
    ),
  ),
  "calendar-026": dynamic(() =>
    import("@/registry/components/calendar/calendar-026/calendar-026").then(
      (module) => module.Calendar026,
    ),
  ),
  "calendar-027": dynamic(() =>
    import("@/registry/components/calendar/calendar-027/calendar-027").then(
      (module) => module.Calendar027,
    ),
  ),
  "calendar-028": dynamic(() =>
    import("@/registry/components/calendar/calendar-028/calendar-028").then(
      (module) => module.Calendar028,
    ),
  ),
  "calendar-029": dynamic(() =>
    import("@/registry/components/calendar/calendar-029/calendar-029").then(
      (module) => module.Calendar029,
    ),
  ),
  "calendar-030": dynamic(() =>
    import("@/registry/components/calendar/calendar-030/calendar-030").then(
      (module) => module.Calendar030,
    ),
  ),
  "card-001": dynamic(() =>
    import("@/registry/components/card/card-001/card-001").then(
      (module) => module.Card001,
    ),
  ),
  "card-002": dynamic(() =>
    import("@/registry/components/card/card-002/card-002").then(
      (module) => module.Card002,
    ),
  ),
  "card-003": dynamic(() =>
    import("@/registry/components/card/card-003/card-003").then(
      (module) => module.Card003,
    ),
  ),
  "card-004": dynamic(() =>
    import("@/registry/components/card/card-004/card-004").then(
      (module) => module.Card004,
    ),
  ),
  "card-005": dynamic(() =>
    import("@/registry/components/card/card-005/card-005").then(
      (module) => module.Card005,
    ),
  ),
  "card-006": dynamic(() =>
    import("@/registry/components/card/card-006/card-006").then(
      (module) => module.Card006,
    ),
  ),
  "card-007": dynamic(() =>
    import("@/registry/components/card/card-007/card-007").then(
      (module) => module.Card007,
    ),
  ),
  "card-008": dynamic(() =>
    import("@/registry/components/card/card-008/card-008").then(
      (module) => module.Card008,
    ),
  ),
  "card-009": dynamic(() =>
    import("@/registry/components/card/card-009/card-009").then(
      (module) => module.Card009,
    ),
  ),
  "card-010": dynamic(() =>
    import("@/registry/components/card/card-010/card-010").then(
      (module) => module.Card010,
    ),
  ),
  "card-011": dynamic(() =>
    import("@/registry/components/card/card-011/card-011").then(
      (module) => module.Card011,
    ),
  ),
  "card-012": dynamic(() =>
    import("@/registry/components/card/card-012/card-012").then(
      (module) => module.Card012,
    ),
  ),
  "card-013": dynamic(() =>
    import("@/registry/components/card/card-013/card-013").then(
      (module) => module.Card013,
    ),
  ),
  "card-014": dynamic(() =>
    import("@/registry/components/card/card-014/card-014").then(
      (module) => module.Card014,
    ),
  ),
  "card-015": dynamic(() =>
    import("@/registry/components/card/card-015/card-015").then(
      (module) => module.Card015,
    ),
  ),
  "card-016": dynamic(() =>
    import("@/registry/components/card/card-016/card-016").then(
      (module) => module.Card016,
    ),
  ),
  "card-017": dynamic(() =>
    import("@/registry/components/card/card-017/card-017").then(
      (module) => module.Card017,
    ),
  ),
  "card-018": dynamic(() =>
    import("@/registry/components/card/card-018/card-018").then(
      (module) => module.Card018,
    ),
  ),
  "card-019": dynamic(() =>
    import("@/registry/components/card/card-019/card-019").then(
      (module) => module.Card019,
    ),
  ),
  "card-020": dynamic(() =>
    import("@/registry/components/card/card-020/card-020").then(
      (module) => module.Card020,
    ),
  ),
  "card-021": dynamic(() =>
    import("@/registry/components/card/card-021/card-021").then(
      (module) => module.Card021,
    ),
  ),
  "carousel-001": dynamic(() =>
    import("@/registry/components/carousel/carousel-001/carousel-001").then(
      (module) => module.Carousel001,
    ),
  ),
  "carousel-002": dynamic(() =>
    import("@/registry/components/carousel/carousel-002/carousel-002").then(
      (module) => module.Carousel002,
    ),
  ),
  "carousel-003": dynamic(() =>
    import("@/registry/components/carousel/carousel-003/carousel-003").then(
      (module) => module.Carousel003,
    ),
  ),
  "carousel-004": dynamic(() =>
    import("@/registry/components/carousel/carousel-004/carousel-004").then(
      (module) => module.Carousel004,
    ),
  ),
  "carousel-005": dynamic(() =>
    import("@/registry/components/carousel/carousel-005/carousel-005").then(
      (module) => module.Carousel005,
    ),
  ),
  "carousel-006": dynamic(() =>
    import("@/registry/components/carousel/carousel-006/carousel-006").then(
      (module) => module.Carousel006,
    ),
  ),
  "carousel-007": dynamic(() =>
    import("@/registry/components/carousel/carousel-007/carousel-007").then(
      (module) => module.Carousel007,
    ),
  ),
  "carousel-008": dynamic(() =>
    import("@/registry/components/carousel/carousel-008/carousel-008").then(
      (module) => module.Carousel008,
    ),
  ),
  "carousel-009": dynamic(() =>
    import("@/registry/components/carousel/carousel-009/carousel-009").then(
      (module) => module.Carousel009,
    ),
  ),
  "carousel-010": dynamic(() =>
    import("@/registry/components/carousel/carousel-010/carousel-010").then(
      (module) => module.Carousel010,
    ),
  ),
  "carousel-011": dynamic(() =>
    import("@/registry/components/carousel/carousel-011/carousel-011").then(
      (module) => module.Carousel011,
    ),
  ),
  "carousel-012": dynamic(() =>
    import("@/registry/components/carousel/carousel-012/carousel-012").then(
      (module) => module.Carousel012,
    ),
  ),
  "carousel-013": dynamic(() =>
    import("@/registry/components/carousel/carousel-013/carousel-013").then(
      (module) => module.Carousel013,
    ),
  ),
  "carousel-014": dynamic(() =>
    import("@/registry/components/carousel/carousel-014/carousel-014").then(
      (module) => module.Carousel014,
    ),
  ),
  "carousel-015": dynamic(() =>
    import("@/registry/components/carousel/carousel-015/carousel-015").then(
      (module) => module.Carousel015,
    ),
  ),
  "carousel-016": dynamic(() =>
    import("@/registry/components/carousel/carousel-016/carousel-016").then(
      (module) => module.Carousel016,
    ),
  ),
  "cascader-001": dynamic(() =>
    import("@/registry/components/cascader/cascader-001/cascader-001").then(
      (module) => module.Cascader001,
    ),
  ),
  "cascader-002": dynamic(() =>
    import("@/registry/components/cascader/cascader-002/cascader-002").then(
      (module) => module.Cascader002,
    ),
  ),
  "cascader-003": dynamic(() =>
    import("@/registry/components/cascader/cascader-003/cascader-003").then(
      (module) => module.Cascader003,
    ),
  ),
  "cascader-004": dynamic(() =>
    import("@/registry/components/cascader/cascader-004/cascader-004").then(
      (module) => module.Cascader004,
    ),
  ),
  "cascader-005": dynamic(() =>
    import("@/registry/components/cascader/cascader-005/cascader-005").then(
      (module) => module.Cascader005,
    ),
  ),
  "cascader-006": dynamic(() =>
    import("@/registry/components/cascader/cascader-006/cascader-006").then(
      (module) => module.Cascader006,
    ),
  ),
  "cascader-007": dynamic(() =>
    import("@/registry/components/cascader/cascader-007/cascader-007").then(
      (module) => module.Cascader007,
    ),
  ),
  "cascader-008": dynamic(() =>
    import("@/registry/components/cascader/cascader-008/cascader-008").then(
      (module) => module.Cascader008,
    ),
  ),
  "cascader-009": dynamic(() =>
    import("@/registry/components/cascader/cascader-009/cascader-009").then(
      (module) => module.Cascader009,
    ),
  ),
  "cascader-010": dynamic(() =>
    import("@/registry/components/cascader/cascader-010/cascader-010").then(
      (module) => module.Cascader010,
    ),
  ),
  "cascader-011": dynamic(() =>
    import("@/registry/components/cascader/cascader-011/cascader-011").then(
      (module) => module.Cascader011,
    ),
  ),
  "cascader-012": dynamic(() =>
    import("@/registry/components/cascader/cascader-012/cascader-012").then(
      (module) => module.Cascader012,
    ),
  ),
  "cascader-013": dynamic(() =>
    import("@/registry/components/cascader/cascader-013/cascader-013").then(
      (module) => module.Cascader013,
    ),
  ),
  "cascader-014": dynamic(() =>
    import("@/registry/components/cascader/cascader-014/cascader-014").then(
      (module) => module.Cascader014,
    ),
  ),
  "cascader-015": dynamic(() =>
    import("@/registry/components/cascader/cascader-015/cascader-015").then(
      (module) => module.Cascader015,
    ),
  ),
  "cascader-016": dynamic(() =>
    import("@/registry/components/cascader/cascader-016/cascader-016").then(
      (module) => module.Cascader016,
    ),
  ),
  "cascader-017": dynamic(() =>
    import("@/registry/components/cascader/cascader-017/cascader-017").then(
      (module) => module.Cascader017,
    ),
  ),
  "cascader-018": dynamic(() =>
    import("@/registry/components/cascader/cascader-018/cascader-018").then(
      (module) => module.Cascader018,
    ),
  ),
  "cascader-019": dynamic(() =>
    import("@/registry/components/cascader/cascader-019/cascader-019").then(
      (module) => module.Cascader019,
    ),
  ),
  "cascader-020": dynamic(() =>
    import("@/registry/components/cascader/cascader-020/cascader-020").then(
      (module) => module.Cascader020,
    ),
  ),
  "chart-001": dynamic(() =>
    import("@/registry/components/chart/chart-001/chart-001").then(
      (module) => module.Chart001,
    ),
  ),
  "chart-002": dynamic(() =>
    import("@/registry/components/chart/chart-002/chart-002").then(
      (module) => module.Chart002,
    ),
  ),
  "chart-003": dynamic(() =>
    import("@/registry/components/chart/chart-003/chart-003").then(
      (module) => module.Chart003,
    ),
  ),
  "chart-004": dynamic(() =>
    import("@/registry/components/chart/chart-004/chart-004").then(
      (module) => module.Chart004,
    ),
  ),
  "chart-005": dynamic(() =>
    import("@/registry/components/chart/chart-005/chart-005").then(
      (module) => module.Chart005,
    ),
  ),
  "chart-006": dynamic(() =>
    import("@/registry/components/chart/chart-006/chart-006").then(
      (module) => module.Chart006,
    ),
  ),
  "chart-007": dynamic(() =>
    import("@/registry/components/chart/chart-007/chart-007").then(
      (module) => module.Chart007,
    ),
  ),
  "chart-008": dynamic(() =>
    import("@/registry/components/chart/chart-008/chart-008").then(
      (module) => module.Chart008,
    ),
  ),
  "chart-009": dynamic(() =>
    import("@/registry/components/chart/chart-009/chart-009").then(
      (module) => module.Chart009,
    ),
  ),
  "chart-010": dynamic(() =>
    import("@/registry/components/chart/chart-010/chart-010").then(
      (module) => module.Chart010,
    ),
  ),
  "chart-011": dynamic(() =>
    import("@/registry/components/chart/chart-011/chart-011").then(
      (module) => module.Chart011,
    ),
  ),
  "chart-012": dynamic(() =>
    import("@/registry/components/chart/chart-012/chart-012").then(
      (module) => module.Chart012,
    ),
  ),
  "chart-013": dynamic(() =>
    import("@/registry/components/chart/chart-013/chart-013").then(
      (module) => module.Chart013,
    ),
  ),
  "chart-014": dynamic(() =>
    import("@/registry/components/chart/chart-014/chart-014").then(
      (module) => module.Chart014,
    ),
  ),
  "chart-015": dynamic(() =>
    import("@/registry/components/chart/chart-015/chart-015").then(
      (module) => module.Chart015,
    ),
  ),
  "chart-016": dynamic(() =>
    import("@/registry/components/chart/chart-016/chart-016").then(
      (module) => module.Chart016,
    ),
  ),
  "chart-017": dynamic(() =>
    import("@/registry/components/chart/chart-017/chart-017").then(
      (module) => module.Chart017,
    ),
  ),
  "chart-018": dynamic(() =>
    import("@/registry/components/chart/chart-018/chart-018").then(
      (module) => module.Chart018,
    ),
  ),
  "chart-019": dynamic(() =>
    import("@/registry/components/chart/chart-019/chart-019").then(
      (module) => module.Chart019,
    ),
  ),
  "chart-020": dynamic(() =>
    import("@/registry/components/chart/chart-020/chart-020").then(
      (module) => module.Chart020,
    ),
  ),
  "chart-021": dynamic(() =>
    import("@/registry/components/chart/chart-021/chart-021").then(
      (module) => module.Chart021,
    ),
  ),
  "chart-022": dynamic(() =>
    import("@/registry/components/chart/chart-022/chart-022").then(
      (module) => module.Chart022,
    ),
  ),
  "chart-023": dynamic(() =>
    import("@/registry/components/chart/chart-023/chart-023").then(
      (module) => module.Chart023,
    ),
  ),
  "chart-024": dynamic(() =>
    import("@/registry/components/chart/chart-024/chart-024").then(
      (module) => module.Chart024,
    ),
  ),
  "chart-025": dynamic(() =>
    import("@/registry/components/chart/chart-025/chart-025").then(
      (module) => module.Chart025,
    ),
  ),
  "checkbox-001": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-001/checkbox-001").then(
      (module) => module.Checkbox001,
    ),
  ),
  "checkbox-002": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-002/checkbox-002").then(
      (module) => module.Checkbox002,
    ),
  ),
  "checkbox-003": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-003/checkbox-003").then(
      (module) => module.Checkbox003,
    ),
  ),
  "checkbox-004": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-004/checkbox-004").then(
      (module) => module.Checkbox004,
    ),
  ),
  "checkbox-005": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-005/checkbox-005").then(
      (module) => module.Checkbox005,
    ),
  ),
  "checkbox-006": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-006/checkbox-006").then(
      (module) => module.Checkbox006,
    ),
  ),
  "checkbox-007": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-007/checkbox-007").then(
      (module) => module.Checkbox007,
    ),
  ),
  "checkbox-008": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-008/checkbox-008").then(
      (module) => module.Checkbox008,
    ),
  ),
  "checkbox-009": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-009/checkbox-009").then(
      (module) => module.Checkbox009,
    ),
  ),
  "checkbox-010": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-010/checkbox-010").then(
      (module) => module.Checkbox010,
    ),
  ),
  "checkbox-011": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-011/checkbox-011").then(
      (module) => module.Checkbox011,
    ),
  ),
  "checkbox-012": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-012/checkbox-012").then(
      (module) => module.Checkbox012,
    ),
  ),
  "checkbox-013": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-013/checkbox-013").then(
      (module) => module.Checkbox013,
    ),
  ),
  "checkbox-014": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-014/checkbox-014").then(
      (module) => module.Checkbox014,
    ),
  ),
  "checkbox-015": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-015/checkbox-015").then(
      (module) => module.Checkbox015,
    ),
  ),
  "checkbox-016": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-016/checkbox-016").then(
      (module) => module.Checkbox016,
    ),
  ),
  "checkbox-017": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-017/checkbox-017").then(
      (module) => module.Checkbox017,
    ),
  ),
  "checkbox-018": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-018/checkbox-018").then(
      (module) => module.Checkbox018,
    ),
  ),
  "checkbox-019": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-019/checkbox-019").then(
      (module) => module.Checkbox019,
    ),
  ),
  "checkbox-020": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-020/checkbox-020").then(
      (module) => module.Checkbox020,
    ),
  ),
  "checkbox-021": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-021/checkbox-021").then(
      (module) => module.Checkbox021,
    ),
  ),
  "checkbox-022": dynamic(() =>
    import("@/registry/components/checkbox/checkbox-022/checkbox-022").then(
      (module) => module.Checkbox022,
    ),
  ),
  "codeblock-001": dynamic(() =>
    import("@/registry/components/code-block/codeblock-001/codeblock-001").then(
      (module) => module.Codeblock001,
    ),
  ),
  "codeblock-002": dynamic(() =>
    import("@/registry/components/code-block/codeblock-002/codeblock-002").then(
      (module) => module.Codeblock002,
    ),
  ),
  "codeblock-003": dynamic(() =>
    import("@/registry/components/code-block/codeblock-003/codeblock-003").then(
      (module) => module.Codeblock003,
    ),
  ),
  "codeblock-004": dynamic(() =>
    import("@/registry/components/code-block/codeblock-004/codeblock-004").then(
      (module) => module.Codeblock004,
    ),
  ),
  "codeblock-005": dynamic(() =>
    import("@/registry/components/code-block/codeblock-005/codeblock-005").then(
      (module) => module.Codeblock005,
    ),
  ),
  "codeblock-006": dynamic(() =>
    import("@/registry/components/code-block/codeblock-006/codeblock-006").then(
      (module) => module.Codeblock006,
    ),
  ),
  "codeblock-007": dynamic(() =>
    import("@/registry/components/code-block/codeblock-007/codeblock-007").then(
      (module) => module.Codeblock007,
    ),
  ),
  "codeblock-008": dynamic(() =>
    import("@/registry/components/code-block/codeblock-008/codeblock-008").then(
      (module) => module.Codeblock008,
    ),
  ),
  "codeblock-009": dynamic(() =>
    import("@/registry/components/code-block/codeblock-009/codeblock-009").then(
      (module) => module.Codeblock009,
    ),
  ),
  "codeblock-010": dynamic(() =>
    import("@/registry/components/code-block/codeblock-010/codeblock-010").then(
      (module) => module.Codeblock010,
    ),
  ),
  "codeblock-011": dynamic(() =>
    import("@/registry/components/code-block/codeblock-011/codeblock-011").then(
      (module) => module.Codeblock011,
    ),
  ),
  "codeblock-012": dynamic(() =>
    import("@/registry/components/code-block/codeblock-012/codeblock-012").then(
      (module) => module.Codeblock012,
    ),
  ),
  "codeblock-013": dynamic(() =>
    import("@/registry/components/code-block/codeblock-013/codeblock-013").then(
      (module) => module.Codeblock013,
    ),
  ),
  "codeblock-014": dynamic(() =>
    import("@/registry/components/code-block/codeblock-014/codeblock-014").then(
      (module) => module.Codeblock014,
    ),
  ),
  "codeblock-015": dynamic(() =>
    import("@/registry/components/code-block/codeblock-015/codeblock-015").then(
      (module) => module.Codeblock015,
    ),
  ),
  "codeblock-016": dynamic(() =>
    import("@/registry/components/code-block/codeblock-016/codeblock-016").then(
      (module) => module.Codeblock016,
    ),
  ),
  "codeblock-017": dynamic(() =>
    import("@/registry/components/code-block/codeblock-017/codeblock-017").then(
      (module) => module.Codeblock017,
    ),
  ),
  "codeblock-018": dynamic(() =>
    import("@/registry/components/code-block/codeblock-018/codeblock-018").then(
      (module) => module.Codeblock018,
    ),
  ),
  "codeblock-019": dynamic(() =>
    import("@/registry/components/code-block/codeblock-019/codeblock-019").then(
      (module) => module.Codeblock019,
    ),
  ),
  "codeblock-020": dynamic(() =>
    import("@/registry/components/code-block/codeblock-020/codeblock-020").then(
      (module) => module.Codeblock020,
    ),
  ),
  "codeblock-021": dynamic(() =>
    import("@/registry/components/code-block/codeblock-021/codeblock-021").then(
      (module) => module.Codeblock021,
    ),
  ),
  "codeblock-022": dynamic(() =>
    import("@/registry/components/code-block/codeblock-022/codeblock-022").then(
      (module) => module.Codeblock022,
    ),
  ),
  "codeblock-023": dynamic(() =>
    import("@/registry/components/code-block/codeblock-023/codeblock-023").then(
      (module) => module.Codeblock023,
    ),
  ),
  "codeblock-024": dynamic(() =>
    import("@/registry/components/code-block/codeblock-024/codeblock-024").then(
      (module) => module.Codeblock024,
    ),
  ),
  "codeblock-025": dynamic(() =>
    import("@/registry/components/code-block/codeblock-025/codeblock-025").then(
      (module) => module.Codeblock025,
    ),
  ),
  "codeblock-026": dynamic(() =>
    import("@/registry/components/code-block/codeblock-026/codeblock-026").then(
      (module) => module.Codeblock026,
    ),
  ),
  "codeblock-027": dynamic(() =>
    import("@/registry/components/code-block/codeblock-027/codeblock-027").then(
      (module) => module.Codeblock027,
    ),
  ),
  "code-001": dynamic(() =>
    import("@/registry/components/code-block/code-001/code-001").then(
      (module) => module.Code001,
    ),
  ),
  "collapsible-001": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-001/collapsible-001").then(
      (module) => module.Collapsible001,
    ),
  ),
  "collapsible-002": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-002/collapsible-002").then(
      (module) => module.Collapsible002,
    ),
  ),
  "collapsible-003": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-003/collapsible-003").then(
      (module) => module.Collapsible003,
    ),
  ),
  "collapsible-004": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-004/collapsible-004").then(
      (module) => module.Collapsible004,
    ),
  ),
  "collapsible-005": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-005/collapsible-005").then(
      (module) => module.Collapsible005,
    ),
  ),
  "collapsible-006": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-006/collapsible-006").then(
      (module) => module.Collapsible006,
    ),
  ),
  "collapsible-007": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-007/collapsible-007").then(
      (module) => module.Collapsible007,
    ),
  ),
  "collapsible-008": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-008/collapsible-008").then(
      (module) => module.Collapsible008,
    ),
  ),
  "collapsible-009": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-009/collapsible-009").then(
      (module) => module.Collapsible009,
    ),
  ),
  "collapsible-010": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-010/collapsible-010").then(
      (module) => module.Collapsible010,
    ),
  ),
  "combobox-001": dynamic(() =>
    import("@/registry/components/combobox/combobox-001/combobox-001").then(
      (module) => module.Combobox001,
    ),
  ),
  "combobox-002": dynamic(() =>
    import("@/registry/components/combobox/combobox-002/combobox-002").then(
      (module) => module.Combobox002,
    ),
  ),
  "combobox-003": dynamic(() =>
    import("@/registry/components/combobox/combobox-003/combobox-003").then(
      (module) => module.Combobox003,
    ),
  ),
  "combobox-004": dynamic(() =>
    import("@/registry/components/combobox/combobox-004/combobox-004").then(
      (module) => module.Combobox004,
    ),
  ),
  "combobox-005": dynamic(() =>
    import("@/registry/components/combobox/combobox-005/combobox-005").then(
      (module) => module.Combobox005,
    ),
  ),
  "combobox-006": dynamic(() =>
    import("@/registry/components/combobox/combobox-006/combobox-006").then(
      (module) => module.Combobox006,
    ),
  ),
  "combobox-007": dynamic(() =>
    import("@/registry/components/combobox/combobox-007/combobox-007").then(
      (module) => module.Combobox007,
    ),
  ),
  "combobox-008": dynamic(() =>
    import("@/registry/components/combobox/combobox-008/combobox-008").then(
      (module) => module.Combobox008,
    ),
  ),
  "combobox-009": dynamic(() =>
    import("@/registry/components/combobox/combobox-009/combobox-009").then(
      (module) => module.Combobox009,
    ),
  ),
  "combobox-010": dynamic(() =>
    import("@/registry/components/combobox/combobox-010/combobox-010").then(
      (module) => module.Combobox010,
    ),
  ),
  "combobox-011": dynamic(() =>
    import("@/registry/components/combobox/combobox-011/combobox-011").then(
      (module) => module.Combobox011,
    ),
  ),
  "combobox-012": dynamic(() =>
    import("@/registry/components/combobox/combobox-012/combobox-012").then(
      (module) => module.Combobox012,
    ),
  ),
  "combobox-013": dynamic(() =>
    import("@/registry/components/combobox/combobox-013/combobox-013").then(
      (module) => module.Combobox013,
    ),
  ),
  "combobox-014": dynamic(() =>
    import("@/registry/components/combobox/combobox-014/combobox-014").then(
      (module) => module.Combobox014,
    ),
  ),
  "combobox-015": dynamic(() =>
    import("@/registry/components/combobox/combobox-015/combobox-015").then(
      (module) => module.Combobox015,
    ),
  ),
  "combobox-016": dynamic(() =>
    import("@/registry/components/combobox/combobox-016/combobox-016").then(
      (module) => module.Combobox016,
    ),
  ),
  "combobox-017": dynamic(() =>
    import("@/registry/components/combobox/combobox-017/combobox-017").then(
      (module) => module.Combobox017,
    ),
  ),
  "combobox-018": dynamic(() =>
    import("@/registry/components/combobox/combobox-018/combobox-018").then(
      (module) => module.Combobox018,
    ),
  ),
  "combobox-019": dynamic(() =>
    import("@/registry/components/combobox/combobox-019/combobox-019").then(
      (module) => module.Combobox019,
    ),
  ),
  "combobox-020": dynamic(() =>
    import("@/registry/components/combobox/combobox-020/combobox-020").then(
      (module) => module.Combobox020,
    ),
  ),
  "combobox-021": dynamic(() =>
    import("@/registry/components/combobox/combobox-021/combobox-021").then(
      (module) => module.Combobox021,
    ),
  ),
  "combobox-022": dynamic(() =>
    import("@/registry/components/combobox/combobox-022/combobox-022").then(
      (module) => module.Combobox022,
    ),
  ),
  "combobox-023": dynamic(() =>
    import("@/registry/components/combobox/combobox-023/combobox-023").then(
      (module) => module.Combobox023,
    ),
  ),
  "combobox-024": dynamic(() =>
    import("@/registry/components/combobox/combobox-024/combobox-024").then(
      (module) => module.Combobox024,
    ),
  ),
  "combobox-025": dynamic(() =>
    import("@/registry/components/combobox/combobox-025/combobox-025").then(
      (module) => module.Combobox025,
    ),
  ),
  "combobox-026": dynamic(() =>
    import("@/registry/components/combobox/combobox-026/combobox-026").then(
      (module) => module.Combobox026,
    ),
  ),
  "combobox-027": dynamic(() =>
    import("@/registry/components/combobox/combobox-027/combobox-027").then(
      (module) => module.Combobox027,
    ),
  ),
  "combobox-028": dynamic(() =>
    import("@/registry/components/combobox/combobox-028/combobox-028").then(
      (module) => module.Combobox028,
    ),
  ),
  "command-001": dynamic(() =>
    import("@/registry/components/command/command-001/command-001").then(
      (module) => module.Command001,
    ),
  ),
  "command-002": dynamic(() =>
    import("@/registry/components/command/command-002/command-002").then(
      (module) => module.Command002,
    ),
  ),
  "command-003": dynamic(() =>
    import("@/registry/components/command/command-003/command-003").then(
      (module) => module.Command003,
    ),
  ),
  "command-004": dynamic(() =>
    import("@/registry/components/command/command-004/command-004").then(
      (module) => module.Command004,
    ),
  ),
  "command-005": dynamic(() =>
    import("@/registry/components/command/command-005/command-005").then(
      (module) => module.Command005,
    ),
  ),
  "command-006": dynamic(() =>
    import("@/registry/components/command/command-006/command-006").then(
      (module) => module.Command006,
    ),
  ),
  "command-007": dynamic(() =>
    import("@/registry/components/command/command-007/command-007").then(
      (module) => module.Command007,
    ),
  ),
  "command-008": dynamic(() =>
    import("@/registry/components/command/command-008/command-008").then(
      (module) => module.Command008,
    ),
  ),
  "command-009": dynamic(() =>
    import("@/registry/components/command/command-009/command-009").then(
      (module) => module.Command009,
    ),
  ),
  "command-010": dynamic(() =>
    import("@/registry/components/command/command-010/command-010").then(
      (module) => module.Command010,
    ),
  ),
  "menu-002": dynamic(() =>
    import("@/registry/components/context-menu/menu-002/menu-002").then(
      (module) => module.Menu002,
    ),
  ),
  "contextmenu-001": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-001/contextmenu-001").then(
      (module) => module.Contextmenu001,
    ),
  ),
  "contextmenu-002": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-002/contextmenu-002").then(
      (module) => module.Contextmenu002,
    ),
  ),
  "contextmenu-003": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-003/contextmenu-003").then(
      (module) => module.Contextmenu003,
    ),
  ),
  "contextmenu-004": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-004/contextmenu-004").then(
      (module) => module.Contextmenu004,
    ),
  ),
  "contextmenu-005": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-005/contextmenu-005").then(
      (module) => module.Contextmenu005,
    ),
  ),
  "contextmenu-006": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-006/contextmenu-006").then(
      (module) => module.Contextmenu006,
    ),
  ),
  "contextmenu-007": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-007/contextmenu-007").then(
      (module) => module.Contextmenu007,
    ),
  ),
  "contextmenu-008": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-008/contextmenu-008").then(
      (module) => module.Contextmenu008,
    ),
  ),
  "contextmenu-009": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-009/contextmenu-009").then(
      (module) => module.Contextmenu009,
    ),
  ),
  "contextmenu-010": dynamic(() =>
    import("@/registry/components/context-menu/contextmenu-010/contextmenu-010").then(
      (module) => module.Contextmenu010,
    ),
  ),
  "currency-001": dynamic(() =>
    import("@/registry/components/currency-input/currency-001/currency-001").then(
      (module) => module.Currency001,
    ),
  ),
  "currency-002": dynamic(() =>
    import("@/registry/components/currency-input/currency-002/currency-002").then(
      (module) => module.Currency002,
    ),
  ),
  "currency-003": dynamic(() =>
    import("@/registry/components/currency-input/currency-003/currency-003").then(
      (module) => module.Currency003,
    ),
  ),
  "currency-004": dynamic(() =>
    import("@/registry/components/currency-input/currency-004/currency-004").then(
      (module) => module.Currency004,
    ),
  ),
  "currency-005": dynamic(() =>
    import("@/registry/components/currency-input/currency-005/currency-005").then(
      (module) => module.Currency005,
    ),
  ),
  "currency-006": dynamic(() =>
    import("@/registry/components/currency-input/currency-006/currency-006").then(
      (module) => module.Currency006,
    ),
  ),
  "currency-007": dynamic(() =>
    import("@/registry/components/currency-input/currency-007/currency-007").then(
      (module) => module.Currency007,
    ),
  ),
  "datagrid-001": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-001/datagrid-001").then(
      (module) => module.Datagrid001,
    ),
  ),
  "datagrid-002": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-002/datagrid-002").then(
      (module) => module.Datagrid002,
    ),
  ),
  "datagrid-003": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-003/datagrid-003").then(
      (module) => module.Datagrid003,
    ),
  ),
  "datagrid-004": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-004/datagrid-004").then(
      (module) => module.Datagrid004,
    ),
  ),
  "datagrid-005": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-005/datagrid-005").then(
      (module) => module.Datagrid005,
    ),
  ),
  "datagrid-006": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-006/datagrid-006").then(
      (module) => module.Datagrid006,
    ),
  ),
  "datagrid-007": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-007/datagrid-007").then(
      (module) => module.Datagrid007,
    ),
  ),
  "datagrid-008": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-008/datagrid-008").then(
      (module) => module.Datagrid008,
    ),
  ),
  "datagrid-009": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-009/datagrid-009").then(
      (module) => module.Datagrid009,
    ),
  ),
  "datagrid-010": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-010/datagrid-010").then(
      (module) => module.Datagrid010,
    ),
  ),
  "datagrid-011": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-011/datagrid-011").then(
      (module) => module.Datagrid011,
    ),
  ),
  "datagrid-012": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-012/datagrid-012").then(
      (module) => module.Datagrid012,
    ),
  ),
  "datagrid-013": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-013/datagrid-013").then(
      (module) => module.Datagrid013,
    ),
  ),
  "datagrid-014": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-014/datagrid-014").then(
      (module) => module.Datagrid014,
    ),
  ),
  "datagrid-015": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-015/datagrid-015").then(
      (module) => module.Datagrid015,
    ),
  ),
  "datagrid-016": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-016/datagrid-016").then(
      (module) => module.Datagrid016,
    ),
  ),
  "datagrid-017": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-017/datagrid-017").then(
      (module) => module.Datagrid017,
    ),
  ),
  "datagrid-018": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-018/datagrid-018").then(
      (module) => module.Datagrid018,
    ),
  ),
  "datagrid-019": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-019/datagrid-019").then(
      (module) => module.Datagrid019,
    ),
  ),
  "datagrid-020": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-020/datagrid-020").then(
      (module) => module.Datagrid020,
    ),
  ),
  "datagrid-021": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-021/datagrid-021").then(
      (module) => module.Datagrid021,
    ),
  ),
  "datagrid-022": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-022/datagrid-022").then(
      (module) => module.Datagrid022,
    ),
  ),
  "datagrid-023": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-023/datagrid-023").then(
      (module) => module.Datagrid023,
    ),
  ),
  "datagrid-024": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-024/datagrid-024").then(
      (module) => module.Datagrid024,
    ),
  ),
  "datagrid-025": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-025/datagrid-025").then(
      (module) => module.Datagrid025,
    ),
  ),
  "datagrid-026": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-026/datagrid-026").then(
      (module) => module.Datagrid026,
    ),
  ),
  "datagrid-027": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-027/datagrid-027").then(
      (module) => module.Datagrid027,
    ),
  ),
  "datagrid-028": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-028/datagrid-028").then(
      (module) => module.Datagrid028,
    ),
  ),
  "datagrid-030": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-030/datagrid-030").then(
      (module) => module.Datagrid030,
    ),
  ),
  "datagrid-029": dynamic(() =>
    import("@/registry/components/data-grid/datagrid-029/datagrid-029").then(
      (module) => module.Datagrid029,
    ),
  ),
  "date-001": dynamic(() =>
    import("@/registry/components/date-selector/date-001/date-001").then(
      (module) => module.Date001,
    ),
  ),
  "date-002": dynamic(() =>
    import("@/registry/components/date-selector/date-002/date-002").then(
      (module) => module.Date002,
    ),
  ),
  "date-003": dynamic(() =>
    import("@/registry/components/date-selector/date-003/date-003").then(
      (module) => module.Date003,
    ),
  ),
  "date-004": dynamic(() =>
    import("@/registry/components/date-selector/date-004/date-004").then(
      (module) => module.Date004,
    ),
  ),
  "date-005": dynamic(() =>
    import("@/registry/components/date-selector/date-005/date-005").then(
      (module) => module.Date005,
    ),
  ),
  "date-006": dynamic(() =>
    import("@/registry/components/date-selector/date-006/date-006").then(
      (module) => module.Date006,
    ),
  ),
  "date-007": dynamic(() =>
    import("@/registry/components/date-selector/date-007/date-007").then(
      (module) => module.Date007,
    ),
  ),
  "date-008": dynamic(() =>
    import("@/registry/components/date-selector/date-008/date-008").then(
      (module) => module.Date008,
    ),
  ),
  "dialog-001": dynamic(() =>
    import("@/registry/components/dialog/dialog-001/dialog-001").then(
      (module) => module.Dialog001,
    ),
  ),
  "dialog-002": dynamic(() =>
    import("@/registry/components/dialog/dialog-002/dialog-002").then(
      (module) => module.Dialog002,
    ),
  ),
  "dialog-003": dynamic(() =>
    import("@/registry/components/dialog/dialog-003/dialog-003").then(
      (module) => module.Dialog003,
    ),
  ),
  "dialog-004": dynamic(() =>
    import("@/registry/components/dialog/dialog-004/dialog-004").then(
      (module) => module.Dialog004,
    ),
  ),
  "dialog-005": dynamic(() =>
    import("@/registry/components/dialog/dialog-005/dialog-005").then(
      (module) => module.Dialog005,
    ),
  ),
  "dialog-006": dynamic(() =>
    import("@/registry/components/dialog/dialog-006/dialog-006").then(
      (module) => module.Dialog006,
    ),
  ),
  "dialog-007": dynamic(() =>
    import("@/registry/components/dialog/dialog-007/dialog-007").then(
      (module) => module.Dialog007,
    ),
  ),
  "dialog-008": dynamic(() =>
    import("@/registry/components/dialog/dialog-008/dialog-008").then(
      (module) => module.Dialog008,
    ),
  ),
  "dialog-009": dynamic(() =>
    import("@/registry/components/dialog/dialog-009/dialog-009").then(
      (module) => module.Dialog009,
    ),
  ),
  "dialog-010": dynamic(() =>
    import("@/registry/components/dialog/dialog-010/dialog-010").then(
      (module) => module.Dialog010,
    ),
  ),
  "dialog-011": dynamic(() =>
    import("@/registry/components/dialog/dialog-011/dialog-011").then(
      (module) => module.Dialog011,
    ),
  ),
  "dialog-012": dynamic(() =>
    import("@/registry/components/dialog/dialog-012/dialog-012").then(
      (module) => module.Dialog012,
    ),
  ),
  "dialog-013": dynamic(() =>
    import("@/registry/components/dialog/dialog-013/dialog-013").then(
      (module) => module.Dialog013,
    ),
  ),
  "dialog-014": dynamic(() =>
    import("@/registry/components/dialog/dialog-014/dialog-014").then(
      (module) => module.Dialog014,
    ),
  ),
  "drawer-001": dynamic(() =>
    import("@/registry/components/drawer/drawer-001/drawer-001").then(
      (module) => module.Drawer001,
    ),
  ),
  "drawer-002": dynamic(() =>
    import("@/registry/components/drawer/drawer-002/drawer-002").then(
      (module) => module.Drawer002,
    ),
  ),
  "drawer-003": dynamic(() =>
    import("@/registry/components/drawer/drawer-003/drawer-003").then(
      (module) => module.Drawer003,
    ),
  ),
  "drawer-004": dynamic(() =>
    import("@/registry/components/drawer/drawer-004/drawer-004").then(
      (module) => module.Drawer004,
    ),
  ),
  "drawer-005": dynamic(() =>
    import("@/registry/components/drawer/drawer-005/drawer-005").then(
      (module) => module.Drawer005,
    ),
  ),
  "drawer-006": dynamic(() =>
    import("@/registry/components/drawer/drawer-006/drawer-006").then(
      (module) => module.Drawer006,
    ),
  ),
  "drawer-007": dynamic(() =>
    import("@/registry/components/drawer/drawer-007/drawer-007").then(
      (module) => module.Drawer007,
    ),
  ),
  "drawer-008": dynamic(() =>
    import("@/registry/components/drawer/drawer-008/drawer-008").then(
      (module) => module.Drawer008,
    ),
  ),
  "dropdown-001": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-001/dropdown-001").then(
      (module) => module.Dropdown001,
    ),
  ),
  "menu-001": dynamic(() =>
    import("@/registry/components/dropdown-menu/menu-001/menu-001").then(
      (module) => module.Menu001,
    ),
  ),
  "menu-004": dynamic(() =>
    import("@/registry/components/dropdown-menu/menu-004/menu-004").then(
      (module) => module.Menu004,
    ),
  ),
  "menu-005": dynamic(() =>
    import("@/registry/components/dropdown-menu/menu-005/menu-005").then(
      (module) => module.Menu005,
    ),
  ),
  "dropdown-002": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-002/dropdown-002").then(
      (module) => module.Dropdown002,
    ),
  ),
  "dropdown-003": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-003/dropdown-003").then(
      (module) => module.Dropdown003,
    ),
  ),
  "dropdown-004": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-004/dropdown-004").then(
      (module) => module.Dropdown004,
    ),
  ),
  "dropdown-005": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-005/dropdown-005").then(
      (module) => module.Dropdown005,
    ),
  ),
  "dropdown-006": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-006/dropdown-006").then(
      (module) => module.Dropdown006,
    ),
  ),
  "dropdown-007": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-007/dropdown-007").then(
      (module) => module.Dropdown007,
    ),
  ),
  "dropdown-008": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-008/dropdown-008").then(
      (module) => module.Dropdown008,
    ),
  ),
  "dropdown-009": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-009/dropdown-009").then(
      (module) => module.Dropdown009,
    ),
  ),
  "dropdown-010": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-010/dropdown-010").then(
      (module) => module.Dropdown010,
    ),
  ),
  "dropdown-011": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-011/dropdown-011").then(
      (module) => module.Dropdown011,
    ),
  ),
  "dropdown-012": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-012/dropdown-012").then(
      (module) => module.Dropdown012,
    ),
  ),
  "dropdown-013": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-013/dropdown-013").then(
      (module) => module.Dropdown013,
    ),
  ),
  "dropdown-014": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-014/dropdown-014").then(
      (module) => module.Dropdown014,
    ),
  ),
  "dropdown-015": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-015/dropdown-015").then(
      (module) => module.Dropdown015,
    ),
  ),
  "dropdown-016": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-016/dropdown-016").then(
      (module) => module.Dropdown016,
    ),
  ),
  "dropdown-017": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-017/dropdown-017").then(
      (module) => module.Dropdown017,
    ),
  ),
  "dropdown-018": dynamic(() =>
    import("@/registry/components/dropdown-menu/dropdown-018/dropdown-018").then(
      (module) => module.Dropdown018,
    ),
  ),
  "empty-001": dynamic(() =>
    import("@/registry/components/empty/empty-001/empty-001").then(
      (module) => module.Empty001,
    ),
  ),
  "empty-002": dynamic(() =>
    import("@/registry/components/empty/empty-002/empty-002").then(
      (module) => module.Empty002,
    ),
  ),
  "empty-003": dynamic(() =>
    import("@/registry/components/empty/empty-003/empty-003").then(
      (module) => module.Empty003,
    ),
  ),
  "empty-004": dynamic(() =>
    import("@/registry/components/empty/empty-004/empty-004").then(
      (module) => module.Empty004,
    ),
  ),
  "empty-005": dynamic(() =>
    import("@/registry/components/empty/empty-005/empty-005").then(
      (module) => module.Empty005,
    ),
  ),
  "empty-006": dynamic(() =>
    import("@/registry/components/empty/empty-006/empty-006").then(
      (module) => module.Empty006,
    ),
  ),
  "empty-007": dynamic(() =>
    import("@/registry/components/empty/empty-007/empty-007").then(
      (module) => module.Empty007,
    ),
  ),
  "empty-008": dynamic(() =>
    import("@/registry/components/empty/empty-008/empty-008").then(
      (module) => module.Empty008,
    ),
  ),
  "empty-009": dynamic(() =>
    import("@/registry/components/empty/empty-009/empty-009").then(
      (module) => module.Empty009,
    ),
  ),
  "empty-010": dynamic(() =>
    import("@/registry/components/empty/empty-010/empty-010").then(
      (module) => module.Empty010,
    ),
  ),
  "empty-011": dynamic(() =>
    import("@/registry/components/empty/empty-011/empty-011").then(
      (module) => module.Empty011,
    ),
  ),
  "empty-012": dynamic(() =>
    import("@/registry/components/empty/empty-012/empty-012").then(
      (module) => module.Empty012,
    ),
  ),
  "empty-013": dynamic(() =>
    import("@/registry/components/empty/empty-013/empty-013").then(
      (module) => module.Empty013,
    ),
  ),
  "empty-014": dynamic(() =>
    import("@/registry/components/empty/empty-014/empty-014").then(
      (module) => module.Empty014,
    ),
  ),
  "empty-015": dynamic(() =>
    import("@/registry/components/empty/empty-015/empty-015").then(
      (module) => module.Empty015,
    ),
  ),
  "empty-016": dynamic(() =>
    import("@/registry/components/empty/empty-016/empty-016").then(
      (module) => module.Empty016,
    ),
  ),
  "empty-017": dynamic(() =>
    import("@/registry/components/empty/empty-017/empty-017").then(
      (module) => module.Empty017,
    ),
  ),
  "empty-018": dynamic(() =>
    import("@/registry/components/empty/empty-018/empty-018").then(
      (module) => module.Empty018,
    ),
  ),
  "empty-019": dynamic(() =>
    import("@/registry/components/empty/empty-019/empty-019").then(
      (module) => module.Empty019,
    ),
  ),
  "empty-020": dynamic(() =>
    import("@/registry/components/empty/empty-020/empty-020").then(
      (module) => module.Empty020,
    ),
  ),
  "eventcalendar-001": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-001/eventcalendar-001").then(
      (module) => module.Eventcalendar001,
    ),
  ),
  "eventcalendar-002": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-002/eventcalendar-002").then(
      (module) => module.Eventcalendar002,
    ),
  ),
  "eventcalendar-003": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-003/eventcalendar-003").then(
      (module) => module.Eventcalendar003,
    ),
  ),
  "eventcalendar-004": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-004/eventcalendar-004").then(
      (module) => module.Eventcalendar004,
    ),
  ),
  "eventcalendar-005": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-005/eventcalendar-005").then(
      (module) => module.Eventcalendar005,
    ),
  ),
  "field-001": dynamic(() =>
    import("@/registry/components/field/field-001/field-001").then(
      (module) => module.Field001,
    ),
  ),
  "field-002": dynamic(() =>
    import("@/registry/components/field/field-002/field-002").then(
      (module) => module.Field002,
    ),
  ),
  "field-003": dynamic(() =>
    import("@/registry/components/field/field-003/field-003").then(
      (module) => module.Field003,
    ),
  ),
  "field-004": dynamic(() =>
    import("@/registry/components/field/field-004/field-004").then(
      (module) => module.Field004,
    ),
  ),
  "field-005": dynamic(() =>
    import("@/registry/components/field/field-005/field-005").then(
      (module) => module.Field005,
    ),
  ),
  "field-006": dynamic(() =>
    import("@/registry/components/field/field-006/field-006").then(
      (module) => module.Field006,
    ),
  ),
  "field-007": dynamic(() =>
    import("@/registry/components/field/field-007/field-007").then(
      (module) => module.Field007,
    ),
  ),
  "field-008": dynamic(() =>
    import("@/registry/components/field/field-008/field-008").then(
      (module) => module.Field008,
    ),
  ),
  "field-009": dynamic(() =>
    import("@/registry/components/field/field-009/field-009").then(
      (module) => module.Field009,
    ),
  ),
  "field-010": dynamic(() =>
    import("@/registry/components/field/field-010/field-010").then(
      (module) => module.Field010,
    ),
  ),
  "field-011": dynamic(() =>
    import("@/registry/components/field/field-011/field-011").then(
      (module) => module.Field011,
    ),
  ),
  "file-001": dynamic(() =>
    import("@/registry/components/file-upload/file-001/file-001").then(
      (module) => module.File001,
    ),
  ),
  "file-002": dynamic(() =>
    import("@/registry/components/file-upload/file-002/file-002").then(
      (module) => module.File002,
    ),
  ),
  "file-003": dynamic(() =>
    import("@/registry/components/file-upload/file-003/file-003").then(
      (module) => module.File003,
    ),
  ),
  "file-004": dynamic(() =>
    import("@/registry/components/file-upload/file-004/file-004").then(
      (module) => module.File004,
    ),
  ),
  "file-005": dynamic(() =>
    import("@/registry/components/file-upload/file-005/file-005").then(
      (module) => module.File005,
    ),
  ),
  "file-006": dynamic(() =>
    import("@/registry/components/file-upload/file-006/file-006").then(
      (module) => module.File006,
    ),
  ),
  "file-007": dynamic(() =>
    import("@/registry/components/file-upload/file-007/file-007").then(
      (module) => module.File007,
    ),
  ),
  "file-008": dynamic(() =>
    import("@/registry/components/file-upload/file-008/file-008").then(
      (module) => module.File008,
    ),
  ),
  "file-009": dynamic(() =>
    import("@/registry/components/file-upload/file-009/file-009").then(
      (module) => module.File009,
    ),
  ),
  "file-010": dynamic(() =>
    import("@/registry/components/file-upload/file-010/file-010").then(
      (module) => module.File010,
    ),
  ),
  "filters-001": dynamic(() =>
    import("@/registry/components/filters/filters-001/filters-001").then(
      (module) => module.Filters001,
    ),
  ),
  "filters-002": dynamic(() =>
    import("@/registry/components/filters/filters-002/filters-002").then(
      (module) => module.Filters002,
    ),
  ),
  "filters-003": dynamic(() =>
    import("@/registry/components/filters/filters-003/filters-003").then(
      (module) => module.Filters003,
    ),
  ),
  "filters-004": dynamic(() =>
    import("@/registry/components/filters/filters-004/filters-004").then(
      (module) => module.Filters004,
    ),
  ),
  "filters-005": dynamic(() =>
    import("@/registry/components/filters/filters-005/filters-005").then(
      (module) => module.Filters005,
    ),
  ),
  "filters-006": dynamic(() =>
    import("@/registry/components/filters/filters-006/filters-006").then(
      (module) => module.Filters006,
    ),
  ),
  "filters-007": dynamic(() =>
    import("@/registry/components/filters/filters-007/filters-007").then(
      (module) => module.Filters007,
    ),
  ),
  "filters-008": dynamic(() =>
    import("@/registry/components/filters/filters-008/filters-008").then(
      (module) => module.Filters008,
    ),
  ),
  "filters-009": dynamic(() =>
    import("@/registry/components/filters/filters-009/filters-009").then(
      (module) => module.Filters009,
    ),
  ),
  "filters-010": dynamic(() =>
    import("@/registry/components/filters/filters-010/filters-010").then(
      (module) => module.Filters010,
    ),
  ),
  "filters-011": dynamic(() =>
    import("@/registry/components/filters/filters-011/filters-011").then(
      (module) => module.Filters011,
    ),
  ),
  "filters-012": dynamic(() =>
    import("@/registry/components/filters/filters-012/filters-012").then(
      (module) => module.Filters012,
    ),
  ),
  "frame-001": dynamic(() =>
    import("@/registry/components/frame/frame-001/frame-001").then(
      (module) => module.Frame001,
    ),
  ),
  "frame-002": dynamic(() =>
    import("@/registry/components/frame/frame-002/frame-002").then(
      (module) => module.Frame002,
    ),
  ),
  "frame-003": dynamic(() =>
    import("@/registry/components/frame/frame-003/frame-003").then(
      (module) => module.Frame003,
    ),
  ),
  "frame-004": dynamic(() =>
    import("@/registry/components/frame/frame-004/frame-004").then(
      (module) => module.Frame004,
    ),
  ),
  "frame-005": dynamic(() =>
    import("@/registry/components/frame/frame-005/frame-005").then(
      (module) => module.Frame005,
    ),
  ),
  "frame-006": dynamic(() =>
    import("@/registry/components/frame/frame-006/frame-006").then(
      (module) => module.Frame006,
    ),
  ),
  "frame-007": dynamic(() =>
    import("@/registry/components/frame/frame-007/frame-007").then(
      (module) => module.Frame007,
    ),
  ),
  "frame-008": dynamic(() =>
    import("@/registry/components/frame/frame-008/frame-008").then(
      (module) => module.Frame008,
    ),
  ),
  "frame-009": dynamic(() =>
    import("@/registry/components/frame/frame-009/frame-009").then(
      (module) => module.Frame009,
    ),
  ),
  "frame-010": dynamic(() =>
    import("@/registry/components/frame/frame-010/frame-010").then(
      (module) => module.Frame010,
    ),
  ),
  "frame-011": dynamic(() =>
    import("@/registry/components/frame/frame-011/frame-011").then(
      (module) => module.Frame011,
    ),
  ),
  "frame-012": dynamic(() =>
    import("@/registry/components/frame/frame-012/frame-012").then(
      (module) => module.Frame012,
    ),
  ),
  "frame-013": dynamic(() =>
    import("@/registry/components/frame/frame-013/frame-013").then(
      (module) => module.Frame013,
    ),
  ),
  "frame-014": dynamic(() =>
    import("@/registry/components/frame/frame-014/frame-014").then(
      (module) => module.Frame014,
    ),
  ),
  "frame-015": dynamic(() =>
    import("@/registry/components/frame/frame-015/frame-015").then(
      (module) => module.Frame015,
    ),
  ),
  "frame-016": dynamic(() =>
    import("@/registry/components/frame/frame-016/frame-016").then(
      (module) => module.Frame016,
    ),
  ),
  "frame-017": dynamic(() =>
    import("@/registry/components/frame/frame-017/frame-017").then(
      (module) => module.Frame017,
    ),
  ),
  "frame-018": dynamic(() =>
    import("@/registry/components/frame/frame-018/frame-018").then(
      (module) => module.Frame018,
    ),
  ),
  "frame-019": dynamic(() =>
    import("@/registry/components/frame/frame-019/frame-019").then(
      (module) => module.Frame019,
    ),
  ),
  "gantt-001": dynamic(() =>
    import("@/registry/components/gantt/gantt-001/gantt-001").then(
      (module) => module.Gantt001,
    ),
  ),
  "gantt-002": dynamic(() =>
    import("@/registry/components/gantt/gantt-002/gantt-002").then(
      (module) => module.Gantt002,
    ),
  ),
  "gantt-003": dynamic(() =>
    import("@/registry/components/gantt/gantt-003/gantt-003").then(
      (module) => module.Gantt003,
    ),
  ),
  "gantt-004": dynamic(() =>
    import("@/registry/components/gantt/gantt-004/gantt-004").then(
      (module) => module.Gantt004,
    ),
  ),
  "gantt-005": dynamic(() =>
    import("@/registry/components/gantt/gantt-005/gantt-005").then(
      (module) => module.Gantt005,
    ),
  ),
  "gantt-006": dynamic(() =>
    import("@/registry/components/gantt/gantt-006/gantt-006").then(
      (module) => module.Gantt006,
    ),
  ),
  "gantt-007": dynamic(() =>
    import("@/registry/components/gantt/gantt-007/gantt-007").then(
      (module) => module.Gantt007,
    ),
  ),
  "hovercard-001": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-001/hovercard-001").then(
      (module) => module.Hovercard001,
    ),
  ),
  "hovercard-002": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-002/hovercard-002").then(
      (module) => module.Hovercard002,
    ),
  ),
  "hovercard-003": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-003/hovercard-003").then(
      (module) => module.Hovercard003,
    ),
  ),
  "hovercard-004": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-004/hovercard-004").then(
      (module) => module.Hovercard004,
    ),
  ),
  "hovercard-005": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-005/hovercard-005").then(
      (module) => module.Hovercard005,
    ),
  ),
  "hovercard-006": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-006/hovercard-006").then(
      (module) => module.Hovercard006,
    ),
  ),
  "hovercard-007": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-007/hovercard-007").then(
      (module) => module.Hovercard007,
    ),
  ),
  "hovercard-008": dynamic(() =>
    import("@/registry/components/hover-card/hovercard-008/hovercard-008").then(
      (module) => module.Hovercard008,
    ),
  ),
  "iconstack-001": dynamic(() =>
    import("@/registry/components/icon-stack/iconstack-001/iconstack-001").then(
      (module) => module.Iconstack001,
    ),
  ),
  "iconstack-002": dynamic(() =>
    import("@/registry/components/icon-stack/iconstack-002/iconstack-002").then(
      (module) => module.Iconstack002,
    ),
  ),
  "iconstack-003": dynamic(() =>
    import("@/registry/components/icon-stack/iconstack-003/iconstack-003").then(
      (module) => module.Iconstack003,
    ),
  ),
  "iconstack-004": dynamic(() =>
    import("@/registry/components/icon-stack/iconstack-004/iconstack-004").then(
      (module) => module.Iconstack004,
    ),
  ),
  "iconstack-005": dynamic(() =>
    import("@/registry/components/icon-stack/iconstack-005/iconstack-005").then(
      (module) => module.Iconstack005,
    ),
  ),
  "iconstack-006": dynamic(() =>
    import("@/registry/components/icon-stack/iconstack-006/iconstack-006").then(
      (module) => module.Iconstack006,
    ),
  ),
  "icontile-001": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-001/icontile-001").then(
      (module) => module.Icontile001,
    ),
  ),
  "icontile-002": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-002/icontile-002").then(
      (module) => module.Icontile002,
    ),
  ),
  "icontile-003": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-003/icontile-003").then(
      (module) => module.Icontile003,
    ),
  ),
  "icontile-004": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-004/icontile-004").then(
      (module) => module.Icontile004,
    ),
  ),
  "icontile-005": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-005/icontile-005").then(
      (module) => module.Icontile005,
    ),
  ),
  "icontile-006": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-006/icontile-006").then(
      (module) => module.Icontile006,
    ),
  ),
  "icontile-007": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-007/icontile-007").then(
      (module) => module.Icontile007,
    ),
  ),
  "icontile-008": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-008/icontile-008").then(
      (module) => module.Icontile008,
    ),
  ),
  "icontile-009": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-009/icontile-009").then(
      (module) => module.Icontile009,
    ),
  ),
  "icontile-010": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-010/icontile-010").then(
      (module) => module.Icontile010,
    ),
  ),
  "icontile-011": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-011/icontile-011").then(
      (module) => module.Icontile011,
    ),
  ),
  "icontile-012": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-012/icontile-012").then(
      (module) => module.Icontile012,
    ),
  ),
  "icontile-013": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-013/icontile-013").then(
      (module) => module.Icontile013,
    ),
  ),
  "icontile-014": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-014/icontile-014").then(
      (module) => module.Icontile014,
    ),
  ),
  "icontile-015": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-015/icontile-015").then(
      (module) => module.Icontile015,
    ),
  ),
  "icontile-016": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-016/icontile-016").then(
      (module) => module.Icontile016,
    ),
  ),
  "icontile-017": dynamic(() =>
    import("@/registry/components/icon-tile/icontile-017/icontile-017").then(
      (module) => module.Icontile017,
    ),
  ),
  "input-001": dynamic(() =>
    import("@/registry/components/input/input-001/input-001").then(
      (module) => module.Input001,
    ),
  ),
  "input-002": dynamic(() =>
    import("@/registry/components/input/input-002/input-002").then(
      (module) => module.Input002,
    ),
  ),
  "input-003": dynamic(() =>
    import("@/registry/components/input/input-003/input-003").then(
      (module) => module.Input003,
    ),
  ),
  "input-004": dynamic(() =>
    import("@/registry/components/input/input-004/input-004").then(
      (module) => module.Input004,
    ),
  ),
  "input-005": dynamic(() =>
    import("@/registry/components/input/input-005/input-005").then(
      (module) => module.Input005,
    ),
  ),
  "input-006": dynamic(() =>
    import("@/registry/components/input/input-006/input-006").then(
      (module) => module.Input006,
    ),
  ),
  "input-007": dynamic(() =>
    import("@/registry/components/input/input-007/input-007").then(
      (module) => module.Input007,
    ),
  ),
  "input-008": dynamic(() =>
    import("@/registry/components/input/input-008/input-008").then(
      (module) => module.Input008,
    ),
  ),
  "input-009": dynamic(() =>
    import("@/registry/components/input/input-009/input-009").then(
      (module) => module.Input009,
    ),
  ),
  "input-010": dynamic(() =>
    import("@/registry/components/input/input-010/input-010").then(
      (module) => module.Input010,
    ),
  ),
  "input-011": dynamic(() =>
    import("@/registry/components/input/input-011/input-011").then(
      (module) => module.Input011,
    ),
  ),
  "input-012": dynamic(() =>
    import("@/registry/components/input/input-012/input-012").then(
      (module) => module.Input012,
    ),
  ),
  "input-013": dynamic(() =>
    import("@/registry/components/input/input-013/input-013").then(
      (module) => module.Input013,
    ),
  ),
  "input-014": dynamic(() =>
    import("@/registry/components/input/input-014/input-014").then(
      (module) => module.Input014,
    ),
  ),
  "input-015": dynamic(() =>
    import("@/registry/components/input/input-015/input-015").then(
      (module) => module.Input015,
    ),
  ),
  "input-016": dynamic(() =>
    import("@/registry/components/input/input-016/input-016").then(
      (module) => module.Input016,
    ),
  ),
  "input-017": dynamic(() =>
    import("@/registry/components/input/input-017/input-017").then(
      (module) => module.Input017,
    ),
  ),
  "input-018": dynamic(() =>
    import("@/registry/components/input/input-018/input-018").then(
      (module) => module.Input018,
    ),
  ),
  "input-019": dynamic(() =>
    import("@/registry/components/input/input-019/input-019").then(
      (module) => module.Input019,
    ),
  ),
  "input-020": dynamic(() =>
    import("@/registry/components/input/input-020/input-020").then(
      (module) => module.Input020,
    ),
  ),
  "input-021": dynamic(() =>
    import("@/registry/components/input/input-021/input-021").then(
      (module) => module.Input021,
    ),
  ),
  "input-022": dynamic(() =>
    import("@/registry/components/input/input-022/input-022").then(
      (module) => module.Input022,
    ),
  ),
  "input-023": dynamic(() =>
    import("@/registry/components/input/input-023/input-023").then(
      (module) => module.Input023,
    ),
  ),
  "input-024": dynamic(() =>
    import("@/registry/components/input/input-024/input-024").then(
      (module) => module.Input024,
    ),
  ),
  "input-025": dynamic(() =>
    import("@/registry/components/input/input-025/input-025").then(
      (module) => module.Input025,
    ),
  ),
  "input-026": dynamic(() =>
    import("@/registry/components/input/input-026/input-026").then(
      (module) => module.Input026,
    ),
  ),
  "input-027": dynamic(() =>
    import("@/registry/components/input/input-027/input-027").then(
      (module) => module.Input027,
    ),
  ),
  "input-028": dynamic(() =>
    import("@/registry/components/input/input-028/input-028").then(
      (module) => module.Input028,
    ),
  ),
  "input-029": dynamic(() =>
    import("@/registry/components/input/input-029/input-029").then(
      (module) => module.Input029,
    ),
  ),
  "input-030": dynamic(() =>
    import("@/registry/components/input/input-030/input-030").then(
      (module) => module.Input030,
    ),
  ),
  "input-031": dynamic(() =>
    import("@/registry/components/input/input-031/input-031").then(
      (module) => module.Input031,
    ),
  ),
  "inputgroup-001": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-001/inputgroup-001").then(
      (module) => module.Inputgroup001,
    ),
  ),
  "inputgroup-002": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-002/inputgroup-002").then(
      (module) => module.Inputgroup002,
    ),
  ),
  "inputgroup-003": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-003/inputgroup-003").then(
      (module) => module.Inputgroup003,
    ),
  ),
  "inputgroup-004": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-004/inputgroup-004").then(
      (module) => module.Inputgroup004,
    ),
  ),
  "inputgroup-005": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-005/inputgroup-005").then(
      (module) => module.Inputgroup005,
    ),
  ),
  "inputgroup-006": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-006/inputgroup-006").then(
      (module) => module.Inputgroup006,
    ),
  ),
  "inputgroup-007": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-007/inputgroup-007").then(
      (module) => module.Inputgroup007,
    ),
  ),
  "inputgroup-008": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-008/inputgroup-008").then(
      (module) => module.Inputgroup008,
    ),
  ),
  "inputgroup-009": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-009/inputgroup-009").then(
      (module) => module.Inputgroup009,
    ),
  ),
  "inputgroup-010": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-010/inputgroup-010").then(
      (module) => module.Inputgroup010,
    ),
  ),
  "inputgroup-011": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-011/inputgroup-011").then(
      (module) => module.Inputgroup011,
    ),
  ),
  "inputgroup-012": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-012/inputgroup-012").then(
      (module) => module.Inputgroup012,
    ),
  ),
  "inputgroup-013": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-013/inputgroup-013").then(
      (module) => module.Inputgroup013,
    ),
  ),
  "inputgroup-014": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-014/inputgroup-014").then(
      (module) => module.Inputgroup014,
    ),
  ),
  "inputgroup-015": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-015/inputgroup-015").then(
      (module) => module.Inputgroup015,
    ),
  ),
  "inputgroup-016": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-016/inputgroup-016").then(
      (module) => module.Inputgroup016,
    ),
  ),
  "inputgroup-017": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-017/inputgroup-017").then(
      (module) => module.Inputgroup017,
    ),
  ),
  "inputgroup-018": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-018/inputgroup-018").then(
      (module) => module.Inputgroup018,
    ),
  ),
  "inputgroup-019": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-019/inputgroup-019").then(
      (module) => module.Inputgroup019,
    ),
  ),
  "inputgroup-020": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-020/inputgroup-020").then(
      (module) => module.Inputgroup020,
    ),
  ),
  "inputgroup-021": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-021/inputgroup-021").then(
      (module) => module.Inputgroup021,
    ),
  ),
  "inputgroup-022": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-022/inputgroup-022").then(
      (module) => module.Inputgroup022,
    ),
  ),
  "inputgroup-023": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-023/inputgroup-023").then(
      (module) => module.Inputgroup023,
    ),
  ),
  "inputgroup-024": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-024/inputgroup-024").then(
      (module) => module.Inputgroup024,
    ),
  ),
  "inputgroup-025": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-025/inputgroup-025").then(
      (module) => module.Inputgroup025,
    ),
  ),
  "inputgroup-026": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-026/inputgroup-026").then(
      (module) => module.Inputgroup026,
    ),
  ),
  "inputgroup-027": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-027/inputgroup-027").then(
      (module) => module.Inputgroup027,
    ),
  ),
  "inputgroup-028": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-028/inputgroup-028").then(
      (module) => module.Inputgroup028,
    ),
  ),
  "inputgroup-029": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-029/inputgroup-029").then(
      (module) => module.Inputgroup029,
    ),
  ),
  "inputgroup-030": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-030/inputgroup-030").then(
      (module) => module.Inputgroup030,
    ),
  ),
  "inputgroup-031": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-031/inputgroup-031").then(
      (module) => module.Inputgroup031,
    ),
  ),
  "inputgroup-032": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-032/inputgroup-032").then(
      (module) => module.Inputgroup032,
    ),
  ),
  "inputgroup-033": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-033/inputgroup-033").then(
      (module) => module.Inputgroup033,
    ),
  ),
  "inputgroup-034": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-034/inputgroup-034").then(
      (module) => module.Inputgroup034,
    ),
  ),
  "inputgroup-035": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-035/inputgroup-035").then(
      (module) => module.Inputgroup035,
    ),
  ),
  "inputgroup-036": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-036/inputgroup-036").then(
      (module) => module.Inputgroup036,
    ),
  ),
  "inputgroup-037": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-037/inputgroup-037").then(
      (module) => module.Inputgroup037,
    ),
  ),
  "inputgroup-038": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-038/inputgroup-038").then(
      (module) => module.Inputgroup038,
    ),
  ),
  "inputgroup-039": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-039/inputgroup-039").then(
      (module) => module.Inputgroup039,
    ),
  ),
  "inputgroup-040": dynamic(() =>
    import("@/registry/components/input-group/inputgroup-040/inputgroup-040").then(
      (module) => module.Inputgroup040,
    ),
  ),
  "otp-001": dynamic(() =>
    import("@/registry/components/input-otp/otp-001/otp-001").then(
      (module) => module.Otp001,
    ),
  ),
  "otp-002": dynamic(() =>
    import("@/registry/components/input-otp/otp-002/otp-002").then(
      (module) => module.Otp002,
    ),
  ),
  "otp-003": dynamic(() =>
    import("@/registry/components/input-otp/otp-003/otp-003").then(
      (module) => module.Otp003,
    ),
  ),
  "otp-004": dynamic(() =>
    import("@/registry/components/input-otp/otp-004/otp-004").then(
      (module) => module.Otp004,
    ),
  ),
  "otp-005": dynamic(() =>
    import("@/registry/components/input-otp/otp-005/otp-005").then(
      (module) => module.Otp005,
    ),
  ),
  "otp-006": dynamic(() =>
    import("@/registry/components/input-otp/otp-006/otp-006").then(
      (module) => module.Otp006,
    ),
  ),
  "otp-007": dynamic(() =>
    import("@/registry/components/input-otp/otp-007/otp-007").then(
      (module) => module.Otp007,
    ),
  ),
  "item-001": dynamic(() =>
    import("@/registry/components/item/item-001/item-001").then(
      (module) => module.Item001,
    ),
  ),
  "item-002": dynamic(() =>
    import("@/registry/components/item/item-002/item-002").then(
      (module) => module.Item002,
    ),
  ),
  "item-003": dynamic(() =>
    import("@/registry/components/item/item-003/item-003").then(
      (module) => module.Item003,
    ),
  ),
  "item-004": dynamic(() =>
    import("@/registry/components/item/item-004/item-004").then(
      (module) => module.Item004,
    ),
  ),
  "item-005": dynamic(() =>
    import("@/registry/components/item/item-005/item-005").then(
      (module) => module.Item005,
    ),
  ),
  "item-006": dynamic(() =>
    import("@/registry/components/item/item-006/item-006").then(
      (module) => module.Item006,
    ),
  ),
  "item-007": dynamic(() =>
    import("@/registry/components/item/item-007/item-007").then(
      (module) => module.Item007,
    ),
  ),
  "item-008": dynamic(() =>
    import("@/registry/components/item/item-008/item-008").then(
      (module) => module.Item008,
    ),
  ),
  "item-009": dynamic(() =>
    import("@/registry/components/item/item-009/item-009").then(
      (module) => module.Item009,
    ),
  ),
  "item-010": dynamic(() =>
    import("@/registry/components/item/item-010/item-010").then(
      (module) => module.Item010,
    ),
  ),
  "item-011": dynamic(() =>
    import("@/registry/components/item/item-011/item-011").then(
      (module) => module.Item011,
    ),
  ),
  "item-012": dynamic(() =>
    import("@/registry/components/item/item-012/item-012").then(
      (module) => module.Item012,
    ),
  ),
  "kanban-001": dynamic(() =>
    import("@/registry/components/kanban/kanban-001/kanban-001").then(
      (module) => module.Kanban001,
    ),
  ),
  "kanban-002": dynamic(() =>
    import("@/registry/components/kanban/kanban-002/kanban-002").then(
      (module) => module.Kanban002,
    ),
  ),
  "kanban-003": dynamic(() =>
    import("@/registry/components/kanban/kanban-003/kanban-003").then(
      (module) => module.Kanban003,
    ),
  ),
  "kanban-004": dynamic(() =>
    import("@/registry/components/kanban/kanban-004/kanban-004").then(
      (module) => module.Kanban004,
    ),
  ),
  "kanban-005": dynamic(() =>
    import("@/registry/components/kanban/kanban-005/kanban-005").then(
      (module) => module.Kanban005,
    ),
  ),
  "kanban-006": dynamic(() =>
    import("@/registry/components/kanban/kanban-006/kanban-006").then(
      (module) => module.Kanban006,
    ),
  ),
  "kanban-007": dynamic(() =>
    import("@/registry/components/kanban/kanban-007/kanban-007").then(
      (module) => module.Kanban007,
    ),
  ),
  "kbd-001": dynamic(() =>
    import("@/registry/components/kbd/kbd-001/kbd-001").then(
      (module) => module.Kbd001,
    ),
  ),
  "kbd-002": dynamic(() =>
    import("@/registry/components/kbd/kbd-002/kbd-002").then(
      (module) => module.Kbd002,
    ),
  ),
  "kbd-003": dynamic(() =>
    import("@/registry/components/kbd/kbd-003/kbd-003").then(
      (module) => module.Kbd003,
    ),
  ),
  "kbd-004": dynamic(() =>
    import("@/registry/components/kbd/kbd-004/kbd-004").then(
      (module) => module.Kbd004,
    ),
  ),
  "kbd-005": dynamic(() =>
    import("@/registry/components/kbd/kbd-005/kbd-005").then(
      (module) => module.Kbd005,
    ),
  ),
  "kbd-006": dynamic(() =>
    import("@/registry/components/kbd/kbd-006/kbd-006").then(
      (module) => module.Kbd006,
    ),
  ),
  "label-001": dynamic(() =>
    import("@/registry/components/label/label-001/label-001").then(
      (module) => module.Label001,
    ),
  ),
  "label-002": dynamic(() =>
    import("@/registry/components/label/label-002/label-002").then(
      (module) => module.Label002,
    ),
  ),
  "label-003": dynamic(() =>
    import("@/registry/components/label/label-003/label-003").then(
      (module) => module.Label003,
    ),
  ),
  "label-004": dynamic(() =>
    import("@/registry/components/label/label-004/label-004").then(
      (module) => module.Label004,
    ),
  ),
  "label-005": dynamic(() =>
    import("@/registry/components/label/label-005/label-005").then(
      (module) => module.Label005,
    ),
  ),
  "label-006": dynamic(() =>
    import("@/registry/components/label/label-006/label-006").then(
      (module) => module.Label006,
    ),
  ),
  "label-007": dynamic(() =>
    import("@/registry/components/label/label-007/label-007").then(
      (module) => module.Label007,
    ),
  ),
  "label-008": dynamic(() =>
    import("@/registry/components/label/label-008/label-008").then(
      (module) => module.Label008,
    ),
  ),
  "label-009": dynamic(() =>
    import("@/registry/components/label/label-009/label-009").then(
      (module) => module.Label009,
    ),
  ),
  "label-010": dynamic(() =>
    import("@/registry/components/label/label-010/label-010").then(
      (module) => module.Label010,
    ),
  ),
  "label-011": dynamic(() =>
    import("@/registry/components/label/label-011/label-011").then(
      (module) => module.Label011,
    ),
  ),
  "label-012": dynamic(() =>
    import("@/registry/components/label/label-012/label-012").then(
      (module) => module.Label012,
    ),
  ),
  "label-013": dynamic(() =>
    import("@/registry/components/label/label-013/label-013").then(
      (module) => module.Label013,
    ),
  ),
  "menu-003": dynamic(() =>
    import("@/registry/components/menubar/menu-003/menu-003").then(
      (module) => module.Menu003,
    ),
  ),
  "menubar-001": dynamic(() =>
    import("@/registry/components/menubar/menubar-001/menubar-001").then(
      (module) => module.Menubar001,
    ),
  ),
  "menubar-002": dynamic(() =>
    import("@/registry/components/menubar/menubar-002/menubar-002").then(
      (module) => module.Menubar002,
    ),
  ),
  "menubar-003": dynamic(() =>
    import("@/registry/components/menubar/menubar-003/menubar-003").then(
      (module) => module.Menubar003,
    ),
  ),
  "menubar-004": dynamic(() =>
    import("@/registry/components/menubar/menubar-004/menubar-004").then(
      (module) => module.Menubar004,
    ),
  ),
  "menubar-005": dynamic(() =>
    import("@/registry/components/menubar/menubar-005/menubar-005").then(
      (module) => module.Menubar005,
    ),
  ),
  "menubar-006": dynamic(() =>
    import("@/registry/components/menubar/menubar-006/menubar-006").then(
      (module) => module.Menubar006,
    ),
  ),
  "menubar-007": dynamic(() =>
    import("@/registry/components/menubar/menubar-007/menubar-007").then(
      (module) => module.Menubar007,
    ),
  ),
  "menubar-008": dynamic(() =>
    import("@/registry/components/menubar/menubar-008/menubar-008").then(
      (module) => module.Menubar008,
    ),
  ),
  "nativeselect-001": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-001/nativeselect-001").then(
      (module) => module.Nativeselect001,
    ),
  ),
  "nativeselect-002": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-002/nativeselect-002").then(
      (module) => module.Nativeselect002,
    ),
  ),
  "nativeselect-003": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-003/nativeselect-003").then(
      (module) => module.Nativeselect003,
    ),
  ),
  "nativeselect-004": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-004/nativeselect-004").then(
      (module) => module.Nativeselect004,
    ),
  ),
  "nativeselect-005": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-005/nativeselect-005").then(
      (module) => module.Nativeselect005,
    ),
  ),
  "nativeselect-006": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-006/nativeselect-006").then(
      (module) => module.Nativeselect006,
    ),
  ),
  "nativeselect-007": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-007/nativeselect-007").then(
      (module) => module.Nativeselect007,
    ),
  ),
  "menu-006": dynamic(() =>
    import("@/registry/components/navigation-menu/menu-006/menu-006").then(
      (module) => module.Menu006,
    ),
  ),
  "navmenu-001": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-001/navmenu-001").then(
      (module) => module.Navmenu001,
    ),
  ),
  "navmenu-002": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-002/navmenu-002").then(
      (module) => module.Navmenu002,
    ),
  ),
  "navmenu-003": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-003/navmenu-003").then(
      (module) => module.Navmenu003,
    ),
  ),
  "navmenu-004": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-004/navmenu-004").then(
      (module) => module.Navmenu004,
    ),
  ),
  "navmenu-005": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-005/navmenu-005").then(
      (module) => module.Navmenu005,
    ),
  ),
  "navmenu-006": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-006/navmenu-006").then(
      (module) => module.Navmenu006,
    ),
  ),
  "navmenu-007": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-007/navmenu-007").then(
      (module) => module.Navmenu007,
    ),
  ),
  "navmenu-008": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-008/navmenu-008").then(
      (module) => module.Navmenu008,
    ),
  ),
  "number-001": dynamic(() =>
    import("@/registry/components/number-field/number-001/number-001").then(
      (module) => module.Number001,
    ),
  ),
  "number-002": dynamic(() =>
    import("@/registry/components/number-field/number-002/number-002").then(
      (module) => module.Number002,
    ),
  ),
  "number-003": dynamic(() =>
    import("@/registry/components/number-field/number-003/number-003").then(
      (module) => module.Number003,
    ),
  ),
  "number-004": dynamic(() =>
    import("@/registry/components/number-field/number-004/number-004").then(
      (module) => module.Number004,
    ),
  ),
  "number-005": dynamic(() =>
    import("@/registry/components/number-field/number-005/number-005").then(
      (module) => module.Number005,
    ),
  ),
  "number-006": dynamic(() =>
    import("@/registry/components/number-field/number-006/number-006").then(
      (module) => module.Number006,
    ),
  ),
  "number-007": dynamic(() =>
    import("@/registry/components/number-field/number-007/number-007").then(
      (module) => module.Number007,
    ),
  ),
  "number-008": dynamic(() =>
    import("@/registry/components/number-field/number-008/number-008").then(
      (module) => module.Number008,
    ),
  ),
  "pagination-001": dynamic(() =>
    import("@/registry/components/pagination/pagination-001/pagination-001").then(
      (module) => module.Pagination001,
    ),
  ),
  "pagination-002": dynamic(() =>
    import("@/registry/components/pagination/pagination-002/pagination-002").then(
      (module) => module.Pagination002,
    ),
  ),
  "pagination-003": dynamic(() =>
    import("@/registry/components/pagination/pagination-003/pagination-003").then(
      (module) => module.Pagination003,
    ),
  ),
  "pagination-004": dynamic(() =>
    import("@/registry/components/pagination/pagination-004/pagination-004").then(
      (module) => module.Pagination004,
    ),
  ),
  "pagination-005": dynamic(() =>
    import("@/registry/components/pagination/pagination-005/pagination-005").then(
      (module) => module.Pagination005,
    ),
  ),
  "pagination-006": dynamic(() =>
    import("@/registry/components/pagination/pagination-006/pagination-006").then(
      (module) => module.Pagination006,
    ),
  ),
  "pagination-007": dynamic(() =>
    import("@/registry/components/pagination/pagination-007/pagination-007").then(
      (module) => module.Pagination007,
    ),
  ),
  "pagination-008": dynamic(() =>
    import("@/registry/components/pagination/pagination-008/pagination-008").then(
      (module) => module.Pagination008,
    ),
  ),
  "pagination-009": dynamic(() =>
    import("@/registry/components/pagination/pagination-009/pagination-009").then(
      (module) => module.Pagination009,
    ),
  ),
  "pagination-010": dynamic(() =>
    import("@/registry/components/pagination/pagination-010/pagination-010").then(
      (module) => module.Pagination010,
    ),
  ),
  "pagination-011": dynamic(() =>
    import("@/registry/components/pagination/pagination-011/pagination-011").then(
      (module) => module.Pagination011,
    ),
  ),
  "pagination-012": dynamic(() =>
    import("@/registry/components/pagination/pagination-012/pagination-012").then(
      (module) => module.Pagination012,
    ),
  ),
  "pagination-013": dynamic(() =>
    import("@/registry/components/pagination/pagination-013/pagination-013").then(
      (module) => module.Pagination013,
    ),
  ),
  "pagination-014": dynamic(() =>
    import("@/registry/components/pagination/pagination-014/pagination-014").then(
      (module) => module.Pagination014,
    ),
  ),
  "pagination-015": dynamic(() =>
    import("@/registry/components/pagination/pagination-015/pagination-015").then(
      (module) => module.Pagination015,
    ),
  ),
  "phoneinput-001": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-001/phoneinput-001").then(
      (module) => module.Phoneinput001,
    ),
  ),
  "phoneinput-002": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-002/phoneinput-002").then(
      (module) => module.Phoneinput002,
    ),
  ),
  "phoneinput-003": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-003/phoneinput-003").then(
      (module) => module.Phoneinput003,
    ),
  ),
  "phoneinput-004": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-004/phoneinput-004").then(
      (module) => module.Phoneinput004,
    ),
  ),
  "phoneinput-005": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-005/phoneinput-005").then(
      (module) => module.Phoneinput005,
    ),
  ),
  "phoneinput-006": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-006/phoneinput-006").then(
      (module) => module.Phoneinput006,
    ),
  ),
  "phoneinput-007": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-007/phoneinput-007").then(
      (module) => module.Phoneinput007,
    ),
  ),
  "phoneinput-008": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-008/phoneinput-008").then(
      (module) => module.Phoneinput008,
    ),
  ),
  "popover-001": dynamic(() =>
    import("@/registry/components/popover/popover-001/popover-001").then(
      (module) => module.Popover001,
    ),
  ),
  "popover-002": dynamic(() =>
    import("@/registry/components/popover/popover-002/popover-002").then(
      (module) => module.Popover002,
    ),
  ),
  "popover-003": dynamic(() =>
    import("@/registry/components/popover/popover-003/popover-003").then(
      (module) => module.Popover003,
    ),
  ),
  "popover-004": dynamic(() =>
    import("@/registry/components/popover/popover-004/popover-004").then(
      (module) => module.Popover004,
    ),
  ),
  "popover-005": dynamic(() =>
    import("@/registry/components/popover/popover-005/popover-005").then(
      (module) => module.Popover005,
    ),
  ),
  "popover-006": dynamic(() =>
    import("@/registry/components/popover/popover-006/popover-006").then(
      (module) => module.Popover006,
    ),
  ),
  "popover-007": dynamic(() =>
    import("@/registry/components/popover/popover-007/popover-007").then(
      (module) => module.Popover007,
    ),
  ),
  "popover-008": dynamic(() =>
    import("@/registry/components/popover/popover-008/popover-008").then(
      (module) => module.Popover008,
    ),
  ),
  "popover-009": dynamic(() =>
    import("@/registry/components/popover/popover-009/popover-009").then(
      (module) => module.Popover009,
    ),
  ),
  "popover-010": dynamic(() =>
    import("@/registry/components/popover/popover-010/popover-010").then(
      (module) => module.Popover010,
    ),
  ),
  "popover-011": dynamic(() =>
    import("@/registry/components/popover/popover-011/popover-011").then(
      (module) => module.Popover011,
    ),
  ),
  "progress-001": dynamic(() =>
    import("@/registry/components/progress/progress-001/progress-001").then(
      (module) => module.Progress001,
    ),
  ),
  "progress-002": dynamic(() =>
    import("@/registry/components/progress/progress-002/progress-002").then(
      (module) => module.Progress002,
    ),
  ),
  "progress-003": dynamic(() =>
    import("@/registry/components/progress/progress-003/progress-003").then(
      (module) => module.Progress003,
    ),
  ),
  "progress-004": dynamic(() =>
    import("@/registry/components/progress/progress-004/progress-004").then(
      (module) => module.Progress004,
    ),
  ),
  "progress-005": dynamic(() =>
    import("@/registry/components/progress/progress-005/progress-005").then(
      (module) => module.Progress005,
    ),
  ),
  "progress-006": dynamic(() =>
    import("@/registry/components/progress/progress-006/progress-006").then(
      (module) => module.Progress006,
    ),
  ),
  "progress-007": dynamic(() =>
    import("@/registry/components/progress/progress-007/progress-007").then(
      (module) => module.Progress007,
    ),
  ),
  "progress-008": dynamic(() =>
    import("@/registry/components/progress/progress-008/progress-008").then(
      (module) => module.Progress008,
    ),
  ),
  "progress-009": dynamic(() =>
    import("@/registry/components/progress/progress-009/progress-009").then(
      (module) => module.Progress009,
    ),
  ),
  "radio-001": dynamic(() =>
    import("@/registry/components/radio-group/radio-001/radio-001").then(
      (module) => module.Radio001,
    ),
  ),
  "radio-002": dynamic(() =>
    import("@/registry/components/radio-group/radio-002/radio-002").then(
      (module) => module.Radio002,
    ),
  ),
  "radio-003": dynamic(() =>
    import("@/registry/components/radio-group/radio-003/radio-003").then(
      (module) => module.Radio003,
    ),
  ),
  "radio-004": dynamic(() =>
    import("@/registry/components/radio-group/radio-004/radio-004").then(
      (module) => module.Radio004,
    ),
  ),
  "radio-005": dynamic(() =>
    import("@/registry/components/radio-group/radio-005/radio-005").then(
      (module) => module.Radio005,
    ),
  ),
  "radio-006": dynamic(() =>
    import("@/registry/components/radio-group/radio-006/radio-006").then(
      (module) => module.Radio006,
    ),
  ),
  "radio-007": dynamic(() =>
    import("@/registry/components/radio-group/radio-007/radio-007").then(
      (module) => module.Radio007,
    ),
  ),
  "radio-008": dynamic(() =>
    import("@/registry/components/radio-group/radio-008/radio-008").then(
      (module) => module.Radio008,
    ),
  ),
  "radio-009": dynamic(() =>
    import("@/registry/components/radio-group/radio-009/radio-009").then(
      (module) => module.Radio009,
    ),
  ),
  "radio-010": dynamic(() =>
    import("@/registry/components/radio-group/radio-010/radio-010").then(
      (module) => module.Radio010,
    ),
  ),
  "radio-011": dynamic(() =>
    import("@/registry/components/radio-group/radio-011/radio-011").then(
      (module) => module.Radio011,
    ),
  ),
  "radio-012": dynamic(() =>
    import("@/registry/components/radio-group/radio-012/radio-012").then(
      (module) => module.Radio012,
    ),
  ),
  "radio-013": dynamic(() =>
    import("@/registry/components/radio-group/radio-013/radio-013").then(
      (module) => module.Radio013,
    ),
  ),
  "radio-014": dynamic(() =>
    import("@/registry/components/radio-group/radio-014/radio-014").then(
      (module) => module.Radio014,
    ),
  ),
  "radio-015": dynamic(() =>
    import("@/registry/components/radio-group/radio-015/radio-015").then(
      (module) => module.Radio015,
    ),
  ),
  "radio-016": dynamic(() =>
    import("@/registry/components/radio-group/radio-016/radio-016").then(
      (module) => module.Radio016,
    ),
  ),
  "radio-017": dynamic(() =>
    import("@/registry/components/radio-group/radio-017/radio-017").then(
      (module) => module.Radio017,
    ),
  ),
  "range-001": dynamic(() =>
    import("@/registry/components/range/range-001/range-001").then(
      (module) => module.Range001,
    ),
  ),
  "range-002": dynamic(() =>
    import("@/registry/components/range/range-002/range-002").then(
      (module) => module.Range002,
    ),
  ),
  "range-003": dynamic(() =>
    import("@/registry/components/range/range-003/range-003").then(
      (module) => module.Range003,
    ),
  ),
  "range-004": dynamic(() =>
    import("@/registry/components/range/range-004/range-004").then(
      (module) => module.Range004,
    ),
  ),
  "range-005": dynamic(() =>
    import("@/registry/components/range/range-005/range-005").then(
      (module) => module.Range005,
    ),
  ),
  "range-006": dynamic(() =>
    import("@/registry/components/range/range-006/range-006").then(
      (module) => module.Range006,
    ),
  ),
  "range-007": dynamic(() =>
    import("@/registry/components/range/range-007/range-007").then(
      (module) => module.Range007,
    ),
  ),
  "rating-001": dynamic(() =>
    import("@/registry/components/rating/rating-001/rating-001").then(
      (module) => module.Rating001,
    ),
  ),
  "rating-002": dynamic(() =>
    import("@/registry/components/rating/rating-002/rating-002").then(
      (module) => module.Rating002,
    ),
  ),
  "rating-003": dynamic(() =>
    import("@/registry/components/rating/rating-003/rating-003").then(
      (module) => module.Rating003,
    ),
  ),
  "rating-004": dynamic(() =>
    import("@/registry/components/rating/rating-004/rating-004").then(
      (module) => module.Rating004,
    ),
  ),
  "rating-005": dynamic(() =>
    import("@/registry/components/rating/rating-005/rating-005").then(
      (module) => module.Rating005,
    ),
  ),
  "rating-006": dynamic(() =>
    import("@/registry/components/rating/rating-006/rating-006").then(
      (module) => module.Rating006,
    ),
  ),
  "rating-007": dynamic(() =>
    import("@/registry/components/rating/rating-007/rating-007").then(
      (module) => module.Rating007,
    ),
  ),
  "rating-008": dynamic(() =>
    import("@/registry/components/rating/rating-008/rating-008").then(
      (module) => module.Rating008,
    ),
  ),
  "rating-009": dynamic(() =>
    import("@/registry/components/rating/rating-009/rating-009").then(
      (module) => module.Rating009,
    ),
  ),
  "resizable-001": dynamic(() =>
    import("@/registry/components/resizable/resizable-001/resizable-001").then(
      (module) => module.Resizable001,
    ),
  ),
  "resizable-002": dynamic(() =>
    import("@/registry/components/resizable/resizable-002/resizable-002").then(
      (module) => module.Resizable002,
    ),
  ),
  "resizable-003": dynamic(() =>
    import("@/registry/components/resizable/resizable-003/resizable-003").then(
      (module) => module.Resizable003,
    ),
  ),
  "resizable-004": dynamic(() =>
    import("@/registry/components/resizable/resizable-004/resizable-004").then(
      (module) => module.Resizable004,
    ),
  ),
  "resizable-005": dynamic(() =>
    import("@/registry/components/resizable/resizable-005/resizable-005").then(
      (module) => module.Resizable005,
    ),
  ),
  "resizable-006": dynamic(() =>
    import("@/registry/components/resizable/resizable-006/resizable-006").then(
      (module) => module.Resizable006,
    ),
  ),
  "resizable-007": dynamic(() =>
    import("@/registry/components/resizable/resizable-007/resizable-007").then(
      (module) => module.Resizable007,
    ),
  ),
  "resizable-008": dynamic(() =>
    import("@/registry/components/resizable/resizable-008/resizable-008").then(
      (module) => module.Resizable008,
    ),
  ),
  "resizable-009": dynamic(() =>
    import("@/registry/components/resizable/resizable-009/resizable-009").then(
      (module) => module.Resizable009,
    ),
  ),
  "resizable-010": dynamic(() =>
    import("@/registry/components/resizable/resizable-010/resizable-010").then(
      (module) => module.Resizable010,
    ),
  ),
  "scrollarea-001": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-001/scrollarea-001").then(
      (module) => module.Scrollarea001,
    ),
  ),
  "scrollarea-002": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-002/scrollarea-002").then(
      (module) => module.Scrollarea002,
    ),
  ),
  "scrollarea-003": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-003/scrollarea-003").then(
      (module) => module.Scrollarea003,
    ),
  ),
  "scrollarea-004": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-004/scrollarea-004").then(
      (module) => module.Scrollarea004,
    ),
  ),
  "scrollarea-005": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-005/scrollarea-005").then(
      (module) => module.Scrollarea005,
    ),
  ),
  "scrollarea-006": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-006/scrollarea-006").then(
      (module) => module.Scrollarea006,
    ),
  ),
  "scrollarea-007": dynamic(() =>
    import("@/registry/components/scroll-area/scrollarea-007/scrollarea-007").then(
      (module) => module.Scrollarea007,
    ),
  ),
  "scrollspy-001": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-001/scrollspy-001").then(
      (module) => module.Scrollspy001,
    ),
  ),
  "scrollspy-002": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-002/scrollspy-002").then(
      (module) => module.Scrollspy002,
    ),
  ),
  "scrollspy-003": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-003/scrollspy-003").then(
      (module) => module.Scrollspy003,
    ),
  ),
  "scrollspy-004": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-004/scrollspy-004").then(
      (module) => module.Scrollspy004,
    ),
  ),
  "scrollspy-005": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-005/scrollspy-005").then(
      (module) => module.Scrollspy005,
    ),
  ),
  "scrollspy-006": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-006/scrollspy-006").then(
      (module) => module.Scrollspy006,
    ),
  ),
  "scrollspy-007": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-007/scrollspy-007").then(
      (module) => module.Scrollspy007,
    ),
  ),
  "select-001": dynamic(() =>
    import("@/registry/components/select/select-001/select-001").then(
      (module) => module.Select001,
    ),
  ),
  "select-002": dynamic(() =>
    import("@/registry/components/select/select-002/select-002").then(
      (module) => module.Select002,
    ),
  ),
  "select-003": dynamic(() =>
    import("@/registry/components/select/select-003/select-003").then(
      (module) => module.Select003,
    ),
  ),
  "select-004": dynamic(() =>
    import("@/registry/components/select/select-004/select-004").then(
      (module) => module.Select004,
    ),
  ),
  "select-005": dynamic(() =>
    import("@/registry/components/select/select-005/select-005").then(
      (module) => module.Select005,
    ),
  ),
  "select-006": dynamic(() =>
    import("@/registry/components/select/select-006/select-006").then(
      (module) => module.Select006,
    ),
  ),
  "select-007": dynamic(() =>
    import("@/registry/components/select/select-007/select-007").then(
      (module) => module.Select007,
    ),
  ),
  "select-008": dynamic(() =>
    import("@/registry/components/select/select-008/select-008").then(
      (module) => module.Select008,
    ),
  ),
  "select-009": dynamic(() =>
    import("@/registry/components/select/select-009/select-009").then(
      (module) => module.Select009,
    ),
  ),
  "select-010": dynamic(() =>
    import("@/registry/components/select/select-010/select-010").then(
      (module) => module.Select010,
    ),
  ),
  "select-011": dynamic(() =>
    import("@/registry/components/select/select-011/select-011").then(
      (module) => module.Select011,
    ),
  ),
  "select-012": dynamic(() =>
    import("@/registry/components/select/select-012/select-012").then(
      (module) => module.Select012,
    ),
  ),
  "select-013": dynamic(() =>
    import("@/registry/components/select/select-013/select-013").then(
      (module) => module.Select013,
    ),
  ),
  "select-014": dynamic(() =>
    import("@/registry/components/select/select-014/select-014").then(
      (module) => module.Select014,
    ),
  ),
  "select-015": dynamic(() =>
    import("@/registry/components/select/select-015/select-015").then(
      (module) => module.Select015,
    ),
  ),
  "select-016": dynamic(() =>
    import("@/registry/components/select/select-016/select-016").then(
      (module) => module.Select016,
    ),
  ),
  "select-017": dynamic(() =>
    import("@/registry/components/select/select-017/select-017").then(
      (module) => module.Select017,
    ),
  ),
  "select-018": dynamic(() =>
    import("@/registry/components/select/select-018/select-018").then(
      (module) => module.Select018,
    ),
  ),
  "select-019": dynamic(() =>
    import("@/registry/components/select/select-019/select-019").then(
      (module) => module.Select019,
    ),
  ),
  "select-020": dynamic(() =>
    import("@/registry/components/select/select-020/select-020").then(
      (module) => module.Select020,
    ),
  ),
  "select-021": dynamic(() =>
    import("@/registry/components/select/select-021/select-021").then(
      (module) => module.Select021,
    ),
  ),
  "select-022": dynamic(() =>
    import("@/registry/components/select/select-022/select-022").then(
      (module) => module.Select022,
    ),
  ),
  "select-023": dynamic(() =>
    import("@/registry/components/select/select-023/select-023").then(
      (module) => module.Select023,
    ),
  ),
  "select-024": dynamic(() =>
    import("@/registry/components/select/select-024/select-024").then(
      (module) => module.Select024,
    ),
  ),
  "select-025": dynamic(() =>
    import("@/registry/components/select/select-025/select-025").then(
      (module) => module.Select025,
    ),
  ),
  "select-026": dynamic(() =>
    import("@/registry/components/select/select-026/select-026").then(
      (module) => module.Select026,
    ),
  ),
  "select-027": dynamic(() =>
    import("@/registry/components/select/select-027/select-027").then(
      (module) => module.Select027,
    ),
  ),
  "select-028": dynamic(() =>
    import("@/registry/components/select/select-028/select-028").then(
      (module) => module.Select028,
    ),
  ),
  "select-029": dynamic(() =>
    import("@/registry/components/select/select-029/select-029").then(
      (module) => module.Select029,
    ),
  ),
  "select-030": dynamic(() =>
    import("@/registry/components/select/select-030/select-030").then(
      (module) => module.Select030,
    ),
  ),
  "select-031": dynamic(() =>
    import("@/registry/components/select/select-031/select-031").then(
      (module) => module.Select031,
    ),
  ),
  "select-032": dynamic(() =>
    import("@/registry/components/select/select-032/select-032").then(
      (module) => module.Select032,
    ),
  ),
  "select-033": dynamic(() =>
    import("@/registry/components/select/select-033/select-033").then(
      (module) => module.Select033,
    ),
  ),
  "separator-001": dynamic(() =>
    import("@/registry/components/separator/separator-001/separator-001").then(
      (module) => module.Separator001,
    ),
  ),
  "separator-002": dynamic(() =>
    import("@/registry/components/separator/separator-002/separator-002").then(
      (module) => module.Separator002,
    ),
  ),
  "separator-003": dynamic(() =>
    import("@/registry/components/separator/separator-003/separator-003").then(
      (module) => module.Separator003,
    ),
  ),
  "separator-004": dynamic(() =>
    import("@/registry/components/separator/separator-004/separator-004").then(
      (module) => module.Separator004,
    ),
  ),
  "separator-005": dynamic(() =>
    import("@/registry/components/separator/separator-005/separator-005").then(
      (module) => module.Separator005,
    ),
  ),
  "separator-006": dynamic(() =>
    import("@/registry/components/separator/separator-006/separator-006").then(
      (module) => module.Separator006,
    ),
  ),
  "sheet-001": dynamic(() =>
    import("@/registry/components/sheet/sheet-001/sheet-001").then(
      (module) => module.Sheet001,
    ),
  ),
  "sheet-002": dynamic(() =>
    import("@/registry/components/sheet/sheet-002/sheet-002").then(
      (module) => module.Sheet002,
    ),
  ),
  "sheet-003": dynamic(() =>
    import("@/registry/components/sheet/sheet-003/sheet-003").then(
      (module) => module.Sheet003,
    ),
  ),
  "sheet-004": dynamic(() =>
    import("@/registry/components/sheet/sheet-004/sheet-004").then(
      (module) => module.Sheet004,
    ),
  ),
  "sheet-005": dynamic(() =>
    import("@/registry/components/sheet/sheet-005/sheet-005").then(
      (module) => module.Sheet005,
    ),
  ),
  "sheet-006": dynamic(() =>
    import("@/registry/components/sheet/sheet-006/sheet-006").then(
      (module) => module.Sheet006,
    ),
  ),
  "sheet-007": dynamic(() =>
    import("@/registry/components/sheet/sheet-007/sheet-007").then(
      (module) => module.Sheet007,
    ),
  ),
  "menu-007": dynamic(() =>
    import("@/registry/components/sheet/menu-007/menu-007").then(
      (module) => module.Menu007,
    ),
  ),
  "sidebar-001": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-001/sidebar-001").then(
      (module) => module.Sidebar001,
    ),
  ),
  "sidebar-002": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-002/sidebar-002").then(
      (module) => module.Sidebar002,
    ),
  ),
  "sidebar-003": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-003/sidebar-003").then(
      (module) => module.Sidebar003,
    ),
  ),
  "sidebar-004": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-004/sidebar-004").then(
      (module) => module.Sidebar004,
    ),
  ),
  "sidebar-005": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-005/sidebar-005").then(
      (module) => module.Sidebar005,
    ),
  ),
  "sidebar-006": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-006/sidebar-006").then(
      (module) => module.Sidebar006,
    ),
  ),
  "sidebar-007": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-007/sidebar-007").then(
      (module) => module.Sidebar007,
    ),
  ),
  "sidebar-008": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-008/sidebar-008").then(
      (module) => module.Sidebar008,
    ),
  ),
  "sidebar-009": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-009/sidebar-009").then(
      (module) => module.Sidebar009,
    ),
  ),
  "skeleton-001": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-001/skeleton-001").then(
      (module) => module.Skeleton001,
    ),
  ),
  "skeleton-002": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-002/skeleton-002").then(
      (module) => module.Skeleton002,
    ),
  ),
  "skeleton-003": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-003/skeleton-003").then(
      (module) => module.Skeleton003,
    ),
  ),
  "skeleton-004": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-004/skeleton-004").then(
      (module) => module.Skeleton004,
    ),
  ),
  "skeleton-005": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-005/skeleton-005").then(
      (module) => module.Skeleton005,
    ),
  ),
  "skeleton-006": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-006/skeleton-006").then(
      (module) => module.Skeleton006,
    ),
  ),
  "skeleton-007": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-007/skeleton-007").then(
      (module) => module.Skeleton007,
    ),
  ),
  "skeleton-008": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-008/skeleton-008").then(
      (module) => module.Skeleton008,
    ),
  ),
  "skeleton-009": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-009/skeleton-009").then(
      (module) => module.Skeleton009,
    ),
  ),
  "skeleton-010": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-010/skeleton-010").then(
      (module) => module.Skeleton010,
    ),
  ),
  "slider-001": dynamic(() =>
    import("@/registry/components/slider/slider-001/slider-001").then(
      (module) => module.Slider001,
    ),
  ),
  "slider-002": dynamic(() =>
    import("@/registry/components/slider/slider-002/slider-002").then(
      (module) => module.Slider002,
    ),
  ),
  "slider-003": dynamic(() =>
    import("@/registry/components/slider/slider-003/slider-003").then(
      (module) => module.Slider003,
    ),
  ),
  "slider-004": dynamic(() =>
    import("@/registry/components/slider/slider-004/slider-004").then(
      (module) => module.Slider004,
    ),
  ),
  "slider-005": dynamic(() =>
    import("@/registry/components/slider/slider-005/slider-005").then(
      (module) => module.Slider005,
    ),
  ),
  "slider-006": dynamic(() =>
    import("@/registry/components/slider/slider-006/slider-006").then(
      (module) => module.Slider006,
    ),
  ),
  "slider-007": dynamic(() =>
    import("@/registry/components/slider/slider-007/slider-007").then(
      (module) => module.Slider007,
    ),
  ),
  "slider-008": dynamic(() =>
    import("@/registry/components/slider/slider-008/slider-008").then(
      (module) => module.Slider008,
    ),
  ),
  "slider-009": dynamic(() =>
    import("@/registry/components/slider/slider-009/slider-009").then(
      (module) => module.Slider009,
    ),
  ),
  "slider-010": dynamic(() =>
    import("@/registry/components/slider/slider-010/slider-010").then(
      (module) => module.Slider010,
    ),
  ),
  "slider-011": dynamic(() =>
    import("@/registry/components/slider/slider-011/slider-011").then(
      (module) => module.Slider011,
    ),
  ),
  "slider-012": dynamic(() =>
    import("@/registry/components/slider/slider-012/slider-012").then(
      (module) => module.Slider012,
    ),
  ),
  "sortable-001": dynamic(() =>
    import("@/registry/components/sortable/sortable-001/sortable-001").then(
      (module) => module.Sortable001,
    ),
  ),
  "sortable-002": dynamic(() =>
    import("@/registry/components/sortable/sortable-002/sortable-002").then(
      (module) => module.Sortable002,
    ),
  ),
  "sortable-003": dynamic(() =>
    import("@/registry/components/sortable/sortable-003/sortable-003").then(
      (module) => module.Sortable003,
    ),
  ),
  "sortable-004": dynamic(() =>
    import("@/registry/components/sortable/sortable-004/sortable-004").then(
      (module) => module.Sortable004,
    ),
  ),
  "sortable-005": dynamic(() =>
    import("@/registry/components/sortable/sortable-005/sortable-005").then(
      (module) => module.Sortable005,
    ),
  ),
  "sortable-006": dynamic(() =>
    import("@/registry/components/sortable/sortable-006/sortable-006").then(
      (module) => module.Sortable006,
    ),
  ),
  "sortable-007": dynamic(() =>
    import("@/registry/components/sortable/sortable-007/sortable-007").then(
      (module) => module.Sortable007,
    ),
  ),
  "sortable-008": dynamic(() =>
    import("@/registry/components/sortable/sortable-008/sortable-008").then(
      (module) => module.Sortable008,
    ),
  ),
  "sparkline-001": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-001/sparkline-001").then(
      (module) => module.Sparkline001,
    ),
  ),
  "sparkline-002": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-002/sparkline-002").then(
      (module) => module.Sparkline002,
    ),
  ),
  "spinner-001": dynamic(() =>
    import("@/registry/components/spinner/spinner-001/spinner-001").then(
      (module) => module.Spinner001,
    ),
  ),
  "spinner-002": dynamic(() =>
    import("@/registry/components/spinner/spinner-002/spinner-002").then(
      (module) => module.Spinner002,
    ),
  ),
  "spinner-003": dynamic(() =>
    import("@/registry/components/spinner/spinner-003/spinner-003").then(
      (module) => module.Spinner003,
    ),
  ),
  "spinner-004": dynamic(() =>
    import("@/registry/components/spinner/spinner-004/spinner-004").then(
      (module) => module.Spinner004,
    ),
  ),
  "spinner-005": dynamic(() =>
    import("@/registry/components/spinner/spinner-005/spinner-005").then(
      (module) => module.Spinner005,
    ),
  ),
  "spinner-006": dynamic(() =>
    import("@/registry/components/spinner/spinner-006/spinner-006").then(
      (module) => module.Spinner006,
    ),
  ),
  "spinner-007": dynamic(() =>
    import("@/registry/components/spinner/spinner-007/spinner-007").then(
      (module) => module.Spinner007,
    ),
  ),
  "spinner-008": dynamic(() =>
    import("@/registry/components/spinner/spinner-008/spinner-008").then(
      (module) => module.Spinner008,
    ),
  ),
  "spinner-009": dynamic(() =>
    import("@/registry/components/spinner/spinner-009/spinner-009").then(
      (module) => module.Spinner009,
    ),
  ),
  "spinner-010": dynamic(() =>
    import("@/registry/components/spinner/spinner-010/spinner-010").then(
      (module) => module.Spinner010,
    ),
  ),
  "spinner-011": dynamic(() =>
    import("@/registry/components/spinner/spinner-011/spinner-011").then(
      (module) => module.Spinner011,
    ),
  ),
  "spinner-012": dynamic(() =>
    import("@/registry/components/spinner/spinner-012/spinner-012").then(
      (module) => module.Spinner012,
    ),
  ),
  "stepper-001": dynamic(() =>
    import("@/registry/components/stepper/stepper-001/stepper-001").then(
      (module) => module.Stepper001,
    ),
  ),
  "stepper-002": dynamic(() =>
    import("@/registry/components/stepper/stepper-002/stepper-002").then(
      (module) => module.Stepper002,
    ),
  ),
  "stepper-003": dynamic(() =>
    import("@/registry/components/stepper/stepper-003/stepper-003").then(
      (module) => module.Stepper003,
    ),
  ),
  "stepper-004": dynamic(() =>
    import("@/registry/components/stepper/stepper-004/stepper-004").then(
      (module) => module.Stepper004,
    ),
  ),
  "stepper-005": dynamic(() =>
    import("@/registry/components/stepper/stepper-005/stepper-005").then(
      (module) => module.Stepper005,
    ),
  ),
  "stepper-006": dynamic(() =>
    import("@/registry/components/stepper/stepper-006/stepper-006").then(
      (module) => module.Stepper006,
    ),
  ),
  "stepper-007": dynamic(() =>
    import("@/registry/components/stepper/stepper-007/stepper-007").then(
      (module) => module.Stepper007,
    ),
  ),
  "stepper-008": dynamic(() =>
    import("@/registry/components/stepper/stepper-008/stepper-008").then(
      (module) => module.Stepper008,
    ),
  ),
  "stepper-009": dynamic(() =>
    import("@/registry/components/stepper/stepper-009/stepper-009").then(
      (module) => module.Stepper009,
    ),
  ),
  "stepper-010": dynamic(() =>
    import("@/registry/components/stepper/stepper-010/stepper-010").then(
      (module) => module.Stepper010,
    ),
  ),
  "stepper-011": dynamic(() =>
    import("@/registry/components/stepper/stepper-011/stepper-011").then(
      (module) => module.Stepper011,
    ),
  ),
  "stepper-012": dynamic(() =>
    import("@/registry/components/stepper/stepper-012/stepper-012").then(
      (module) => module.Stepper012,
    ),
  ),
  "stepper-013": dynamic(() =>
    import("@/registry/components/stepper/stepper-013/stepper-013").then(
      (module) => module.Stepper013,
    ),
  ),
  "stepper-014": dynamic(() =>
    import("@/registry/components/stepper/stepper-014/stepper-014").then(
      (module) => module.Stepper014,
    ),
  ),
  "stepper-015": dynamic(() =>
    import("@/registry/components/stepper/stepper-015/stepper-015").then(
      (module) => module.Stepper015,
    ),
  ),
  "switch-001": dynamic(() =>
    import("@/registry/components/switch/switch-001/switch-001").then(
      (module) => module.Switch001,
    ),
  ),
  "switch-002": dynamic(() =>
    import("@/registry/components/switch/switch-002/switch-002").then(
      (module) => module.Switch002,
    ),
  ),
  "switch-003": dynamic(() =>
    import("@/registry/components/switch/switch-003/switch-003").then(
      (module) => module.Switch003,
    ),
  ),
  "switch-004": dynamic(() =>
    import("@/registry/components/switch/switch-004/switch-004").then(
      (module) => module.Switch004,
    ),
  ),
  "switch-005": dynamic(() =>
    import("@/registry/components/switch/switch-005/switch-005").then(
      (module) => module.Switch005,
    ),
  ),
  "switch-006": dynamic(() =>
    import("@/registry/components/switch/switch-006/switch-006").then(
      (module) => module.Switch006,
    ),
  ),
  "switch-007": dynamic(() =>
    import("@/registry/components/switch/switch-007/switch-007").then(
      (module) => module.Switch007,
    ),
  ),
  "switch-008": dynamic(() =>
    import("@/registry/components/switch/switch-008/switch-008").then(
      (module) => module.Switch008,
    ),
  ),
  "switch-009": dynamic(() =>
    import("@/registry/components/switch/switch-009/switch-009").then(
      (module) => module.Switch009,
    ),
  ),
  "switch-010": dynamic(() =>
    import("@/registry/components/switch/switch-010/switch-010").then(
      (module) => module.Switch010,
    ),
  ),
  "switch-011": dynamic(() =>
    import("@/registry/components/switch/switch-011/switch-011").then(
      (module) => module.Switch011,
    ),
  ),
  "switch-012": dynamic(() =>
    import("@/registry/components/switch/switch-012/switch-012").then(
      (module) => module.Switch012,
    ),
  ),
  "switch-013": dynamic(() =>
    import("@/registry/components/switch/switch-013/switch-013").then(
      (module) => module.Switch013,
    ),
  ),
  "switch-014": dynamic(() =>
    import("@/registry/components/switch/switch-014/switch-014").then(
      (module) => module.Switch014,
    ),
  ),
  "table-001": dynamic(() =>
    import("@/registry/components/table/table-001/table-001").then(
      (module) => module.Table001,
    ),
  ),
  "table-002": dynamic(() =>
    import("@/registry/components/table/table-002/table-002").then(
      (module) => module.Table002,
    ),
  ),
  "table-003": dynamic(() =>
    import("@/registry/components/table/table-003/table-003").then(
      (module) => module.Table003,
    ),
  ),
  "table-004": dynamic(() =>
    import("@/registry/components/table/table-004/table-004").then(
      (module) => module.Table004,
    ),
  ),
  "table-005": dynamic(() =>
    import("@/registry/components/table/table-005/table-005").then(
      (module) => module.Table005,
    ),
  ),
  "table-006": dynamic(() =>
    import("@/registry/components/table/table-006/table-006").then(
      (module) => module.Table006,
    ),
  ),
  "table-007": dynamic(() =>
    import("@/registry/components/table/table-007/table-007").then(
      (module) => module.Table007,
    ),
  ),
  "table-008": dynamic(() =>
    import("@/registry/components/table/table-008/table-008").then(
      (module) => module.Table008,
    ),
  ),
  "table-009": dynamic(() =>
    import("@/registry/components/table/table-009/table-009").then(
      (module) => module.Table009,
    ),
  ),
  "table-010": dynamic(() =>
    import("@/registry/components/table/table-010/table-010").then(
      (module) => module.Table010,
    ),
  ),
  "table-011": dynamic(() =>
    import("@/registry/components/table/table-011/table-011").then(
      (module) => module.Table011,
    ),
  ),
  "table-012": dynamic(() =>
    import("@/registry/components/table/table-012/table-012").then(
      (module) => module.Table012,
    ),
  ),
  "table-013": dynamic(() =>
    import("@/registry/components/table/table-013/table-013").then(
      (module) => module.Table013,
    ),
  ),
  "table-014": dynamic(() =>
    import("@/registry/components/table/table-014/table-014").then(
      (module) => module.Table014,
    ),
  ),
  "table-015": dynamic(() =>
    import("@/registry/components/table/table-015/table-015").then(
      (module) => module.Table015,
    ),
  ),
  "table-016": dynamic(() =>
    import("@/registry/components/table/table-016/table-016").then(
      (module) => module.Table016,
    ),
  ),
  "table-017": dynamic(() =>
    import("@/registry/components/table/table-017/table-017").then(
      (module) => module.Table017,
    ),
  ),
  "table-018": dynamic(() =>
    import("@/registry/components/table/table-018/table-018").then(
      (module) => module.Table018,
    ),
  ),
  "table-019": dynamic(() =>
    import("@/registry/components/table/table-019/table-019").then(
      (module) => module.Table019,
    ),
  ),
  "table-020": dynamic(() =>
    import("@/registry/components/table/table-020/table-020").then(
      (module) => module.Table020,
    ),
  ),
  "tabs-001": dynamic(() =>
    import("@/registry/components/tabs/tabs-001/tabs-001").then(
      (module) => module.Tabs001,
    ),
  ),
  "tabbar-001": dynamic(() =>
    import("@/registry/components/tabs/tabbar-001/tabbar-001").then(
      (module) => module.Tabbar001,
    ),
  ),
  "tabs-002": dynamic(() =>
    import("@/registry/components/tabs/tabs-002/tabs-002").then(
      (module) => module.Tabs002,
    ),
  ),
  "tabs-003": dynamic(() =>
    import("@/registry/components/tabs/tabs-003/tabs-003").then(
      (module) => module.Tabs003,
    ),
  ),
  "tabs-004": dynamic(() =>
    import("@/registry/components/tabs/tabs-004/tabs-004").then(
      (module) => module.Tabs004,
    ),
  ),
  "tabs-005": dynamic(() =>
    import("@/registry/components/tabs/tabs-005/tabs-005").then(
      (module) => module.Tabs005,
    ),
  ),
  "tabs-006": dynamic(() =>
    import("@/registry/components/tabs/tabs-006/tabs-006").then(
      (module) => module.Tabs006,
    ),
  ),
  "tabs-007": dynamic(() =>
    import("@/registry/components/tabs/tabs-007/tabs-007").then(
      (module) => module.Tabs007,
    ),
  ),
  "tabs-008": dynamic(() =>
    import("@/registry/components/tabs/tabs-008/tabs-008").then(
      (module) => module.Tabs008,
    ),
  ),
  "tabs-009": dynamic(() =>
    import("@/registry/components/tabs/tabs-009/tabs-009").then(
      (module) => module.Tabs009,
    ),
  ),
  "tabs-010": dynamic(() =>
    import("@/registry/components/tabs/tabs-010/tabs-010").then(
      (module) => module.Tabs010,
    ),
  ),
  "tags-001": dynamic(() =>
    import("@/registry/components/tags-input/tags-001/tags-001").then(
      (module) => module.Tags001,
    ),
  ),
  "tags-002": dynamic(() =>
    import("@/registry/components/tags-input/tags-002/tags-002").then(
      (module) => module.Tags002,
    ),
  ),
  "tags-003": dynamic(() =>
    import("@/registry/components/tags-input/tags-003/tags-003").then(
      (module) => module.Tags003,
    ),
  ),
  "tags-004": dynamic(() =>
    import("@/registry/components/tags-input/tags-004/tags-004").then(
      (module) => module.Tags004,
    ),
  ),
  "tags-005": dynamic(() =>
    import("@/registry/components/tags-input/tags-005/tags-005").then(
      (module) => module.Tags005,
    ),
  ),
  "tags-006": dynamic(() =>
    import("@/registry/components/tags-input/tags-006/tags-006").then(
      (module) => module.Tags006,
    ),
  ),
  "tags-007": dynamic(() =>
    import("@/registry/components/tags-input/tags-007/tags-007").then(
      (module) => module.Tags007,
    ),
  ),
  "textarea-001": dynamic(() =>
    import("@/registry/components/textarea/textarea-001/textarea-001").then(
      (module) => module.Textarea001,
    ),
  ),
  "textarea-002": dynamic(() =>
    import("@/registry/components/textarea/textarea-002/textarea-002").then(
      (module) => module.Textarea002,
    ),
  ),
  "textarea-003": dynamic(() =>
    import("@/registry/components/textarea/textarea-003/textarea-003").then(
      (module) => module.Textarea003,
    ),
  ),
  "textarea-004": dynamic(() =>
    import("@/registry/components/textarea/textarea-004/textarea-004").then(
      (module) => module.Textarea004,
    ),
  ),
  "textarea-005": dynamic(() =>
    import("@/registry/components/textarea/textarea-005/textarea-005").then(
      (module) => module.Textarea005,
    ),
  ),
  "textarea-006": dynamic(() =>
    import("@/registry/components/textarea/textarea-006/textarea-006").then(
      (module) => module.Textarea006,
    ),
  ),
  "textarea-007": dynamic(() =>
    import("@/registry/components/textarea/textarea-007/textarea-007").then(
      (module) => module.Textarea007,
    ),
  ),
  "textarea-008": dynamic(() =>
    import("@/registry/components/textarea/textarea-008/textarea-008").then(
      (module) => module.Textarea008,
    ),
  ),
  "timeline-001": dynamic(() =>
    import("@/registry/components/timeline/timeline-001/timeline-001").then(
      (module) => module.Timeline001,
    ),
  ),
  "timeline-002": dynamic(() =>
    import("@/registry/components/timeline/timeline-002/timeline-002").then(
      (module) => module.Timeline002,
    ),
  ),
  "timeline-003": dynamic(() =>
    import("@/registry/components/timeline/timeline-003/timeline-003").then(
      (module) => module.Timeline003,
    ),
  ),
  "timeline-004": dynamic(() =>
    import("@/registry/components/timeline/timeline-004/timeline-004").then(
      (module) => module.Timeline004,
    ),
  ),
  "timeline-005": dynamic(() =>
    import("@/registry/components/timeline/timeline-005/timeline-005").then(
      (module) => module.Timeline005,
    ),
  ),
  "timeline-006": dynamic(() =>
    import("@/registry/components/timeline/timeline-006/timeline-006").then(
      (module) => module.Timeline006,
    ),
  ),
  "timeline-007": dynamic(() =>
    import("@/registry/components/timeline/timeline-007/timeline-007").then(
      (module) => module.Timeline007,
    ),
  ),
  "timeline-008": dynamic(() =>
    import("@/registry/components/timeline/timeline-008/timeline-008").then(
      (module) => module.Timeline008,
    ),
  ),
  "timeline-009": dynamic(() =>
    import("@/registry/components/timeline/timeline-009/timeline-009").then(
      (module) => module.Timeline009,
    ),
  ),
  "timeline-010": dynamic(() =>
    import("@/registry/components/timeline/timeline-010/timeline-010").then(
      (module) => module.Timeline010,
    ),
  ),
  "timeline-011": dynamic(() =>
    import("@/registry/components/timeline/timeline-011/timeline-011").then(
      (module) => module.Timeline011,
    ),
  ),
  "timeline-012": dynamic(() =>
    import("@/registry/components/timeline/timeline-012/timeline-012").then(
      (module) => module.Timeline012,
    ),
  ),
  "toast-001": dynamic(() =>
    import("@/registry/components/toast/toast-001/toast-001").then(
      (module) => module.Toast001,
    ),
  ),
  "toast-002": dynamic(() =>
    import("@/registry/components/toast/toast-002/toast-002").then(
      (module) => module.Toast002,
    ),
  ),
  "toast-003": dynamic(() =>
    import("@/registry/components/toast/toast-003/toast-003").then(
      (module) => module.Toast003,
    ),
  ),
  "toast-004": dynamic(() =>
    import("@/registry/components/toast/toast-004/toast-004").then(
      (module) => module.Toast004,
    ),
  ),
  "toast-005": dynamic(() =>
    import("@/registry/components/toast/toast-005/toast-005").then(
      (module) => module.Toast005,
    ),
  ),
  "toast-006": dynamic(() =>
    import("@/registry/components/toast/toast-006/toast-006").then(
      (module) => module.Toast006,
    ),
  ),
  "toast-007": dynamic(() =>
    import("@/registry/components/toast/toast-007/toast-007").then(
      (module) => module.Toast007,
    ),
  ),
  "toast-008": dynamic(() =>
    import("@/registry/components/toast/toast-008/toast-008").then(
      (module) => module.Toast008,
    ),
  ),
  "toast-009": dynamic(() =>
    import("@/registry/components/toast/toast-009/toast-009").then(
      (module) => module.Toast009,
    ),
  ),
  "toast-010": dynamic(() =>
    import("@/registry/components/toast/toast-010/toast-010").then(
      (module) => module.Toast010,
    ),
  ),
  "toast-011": dynamic(() =>
    import("@/registry/components/toast/toast-011/toast-011").then(
      (module) => module.Toast011,
    ),
  ),
  "toast-012": dynamic(() =>
    import("@/registry/components/toast/toast-012/toast-012").then(
      (module) => module.Toast012,
    ),
  ),
  "toast-013": dynamic(() =>
    import("@/registry/components/toast/toast-013/toast-013").then(
      (module) => module.Toast013,
    ),
  ),
  "toast-014": dynamic(() =>
    import("@/registry/components/toast/toast-014/toast-014").then(
      (module) => module.Toast014,
    ),
  ),
  "toast-015": dynamic(() =>
    import("@/registry/components/toast/toast-015/toast-015").then(
      (module) => module.Toast015,
    ),
  ),
  "toast-016": dynamic(() =>
    import("@/registry/components/toast/toast-016/toast-016").then(
      (module) => module.Toast016,
    ),
  ),
  "toast-017": dynamic(() =>
    import("@/registry/components/toast/toast-017/toast-017").then(
      (module) => module.Toast017,
    ),
  ),
  "toast-018": dynamic(() =>
    import("@/registry/components/toast/toast-018/toast-018").then(
      (module) => module.Toast018,
    ),
  ),
  "toast-019": dynamic(() =>
    import("@/registry/components/toast/toast-019/toast-019").then(
      (module) => module.Toast019,
    ),
  ),
  "toast-020": dynamic(() =>
    import("@/registry/components/toast/toast-020/toast-020").then(
      (module) => module.Toast020,
    ),
  ),
  "toast-021": dynamic(() =>
    import("@/registry/components/toast/toast-021/toast-021").then(
      (module) => module.Toast021,
    ),
  ),
  "toggle-001": dynamic(() =>
    import("@/registry/components/toggle/toggle-001/toggle-001").then(
      (module) => module.Toggle001,
    ),
  ),
  "toggle-002": dynamic(() =>
    import("@/registry/components/toggle/toggle-002/toggle-002").then(
      (module) => module.Toggle002,
    ),
  ),
  "toggle-003": dynamic(() =>
    import("@/registry/components/toggle/toggle-003/toggle-003").then(
      (module) => module.Toggle003,
    ),
  ),
  "toggle-004": dynamic(() =>
    import("@/registry/components/toggle/toggle-004/toggle-004").then(
      (module) => module.Toggle004,
    ),
  ),
  "toggle-005": dynamic(() =>
    import("@/registry/components/toggle/toggle-005/toggle-005").then(
      (module) => module.Toggle005,
    ),
  ),
  "toggle-006": dynamic(() =>
    import("@/registry/components/toggle/toggle-006/toggle-006").then(
      (module) => module.Toggle006,
    ),
  ),
  "toggle-007": dynamic(() =>
    import("@/registry/components/toggle/toggle-007/toggle-007").then(
      (module) => module.Toggle007,
    ),
  ),
  "toggle-008": dynamic(() =>
    import("@/registry/components/toggle/toggle-008/toggle-008").then(
      (module) => module.Toggle008,
    ),
  ),
  "toggle-009": dynamic(() =>
    import("@/registry/components/toggle/toggle-009/toggle-009").then(
      (module) => module.Toggle009,
    ),
  ),
  "toggle-010": dynamic(() =>
    import("@/registry/components/toggle/toggle-010/toggle-010").then(
      (module) => module.Toggle010,
    ),
  ),
  "toggle-011": dynamic(() =>
    import("@/registry/components/toggle/toggle-011/toggle-011").then(
      (module) => module.Toggle011,
    ),
  ),
  "toggle-012": dynamic(() =>
    import("@/registry/components/toggle/toggle-012/toggle-012").then(
      (module) => module.Toggle012,
    ),
  ),
  "toggle-013": dynamic(() =>
    import("@/registry/components/toggle/toggle-013/toggle-013").then(
      (module) => module.Toggle013,
    ),
  ),
  "toggle-014": dynamic(() =>
    import("@/registry/components/toggle/toggle-014/toggle-014").then(
      (module) => module.Toggle014,
    ),
  ),
  "togglegroup-001": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-001/togglegroup-001").then(
      (module) => module.Togglegroup001,
    ),
  ),
  "togglegroup-002": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-002/togglegroup-002").then(
      (module) => module.Togglegroup002,
    ),
  ),
  "togglegroup-003": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-003/togglegroup-003").then(
      (module) => module.Togglegroup003,
    ),
  ),
  "togglegroup-004": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-004/togglegroup-004").then(
      (module) => module.Togglegroup004,
    ),
  ),
  "togglegroup-005": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-005/togglegroup-005").then(
      (module) => module.Togglegroup005,
    ),
  ),
  "togglegroup-006": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-006/togglegroup-006").then(
      (module) => module.Togglegroup006,
    ),
  ),
  "togglegroup-007": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-007/togglegroup-007").then(
      (module) => module.Togglegroup007,
    ),
  ),
  "togglegroup-008": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-008/togglegroup-008").then(
      (module) => module.Togglegroup008,
    ),
  ),
  "togglegroup-009": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-009/togglegroup-009").then(
      (module) => module.Togglegroup009,
    ),
  ),
  "togglegroup-010": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-010/togglegroup-010").then(
      (module) => module.Togglegroup010,
    ),
  ),
  "togglegroup-011": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-011/togglegroup-011").then(
      (module) => module.Togglegroup011,
    ),
  ),
  "togglegroup-012": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-012/togglegroup-012").then(
      (module) => module.Togglegroup012,
    ),
  ),
  "togglegroup-013": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-013/togglegroup-013").then(
      (module) => module.Togglegroup013,
    ),
  ),
  "togglegroup-014": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-014/togglegroup-014").then(
      (module) => module.Togglegroup014,
    ),
  ),
  "togglegroup-015": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-015/togglegroup-015").then(
      (module) => module.Togglegroup015,
    ),
  ),
  "togglegroup-016": dynamic(() =>
    import("@/registry/components/toggle-group/togglegroup-016/togglegroup-016").then(
      (module) => module.Togglegroup016,
    ),
  ),
  "tooltip-001": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-001/tooltip-001").then(
      (module) => module.Tooltip001,
    ),
  ),
  "tooltip-002": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-002/tooltip-002").then(
      (module) => module.Tooltip002,
    ),
  ),
  "tooltip-003": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-003/tooltip-003").then(
      (module) => module.Tooltip003,
    ),
  ),
  "tooltip-004": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-004/tooltip-004").then(
      (module) => module.Tooltip004,
    ),
  ),
  "tooltip-005": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-005/tooltip-005").then(
      (module) => module.Tooltip005,
    ),
  ),
  "tooltip-006": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-006/tooltip-006").then(
      (module) => module.Tooltip006,
    ),
  ),
  "tooltip-007": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-007/tooltip-007").then(
      (module) => module.Tooltip007,
    ),
  ),
  "tooltip-008": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-008/tooltip-008").then(
      (module) => module.Tooltip008,
    ),
  ),
  "tooltip-009": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-009/tooltip-009").then(
      (module) => module.Tooltip009,
    ),
  ),
  "tooltip-010": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-010/tooltip-010").then(
      (module) => module.Tooltip010,
    ),
  ),
  "tooltip-011": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-011/tooltip-011").then(
      (module) => module.Tooltip011,
    ),
  ),
  "tooltip-012": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-012/tooltip-012").then(
      (module) => module.Tooltip012,
    ),
  ),
  "tooltip-013": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-013/tooltip-013").then(
      (module) => module.Tooltip013,
    ),
  ),
  "tooltip-014": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-014/tooltip-014").then(
      (module) => module.Tooltip014,
    ),
  ),
  "tooltip-015": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-015/tooltip-015").then(
      (module) => module.Tooltip015,
    ),
  ),
  "tooltip-016": dynamic(() =>
    import("@/registry/components/tooltip/tooltip-016/tooltip-016").then(
      (module) => module.Tooltip016,
    ),
  ),
  "tree-001": dynamic(() =>
    import("@/registry/components/tree/tree-001/tree-001").then(
      (module) => module.Tree001,
    ),
  ),
  "tree-002": dynamic(() =>
    import("@/registry/components/tree/tree-002/tree-002").then(
      (module) => module.Tree002,
    ),
  ),
  "tree-003": dynamic(() =>
    import("@/registry/components/tree/tree-003/tree-003").then(
      (module) => module.Tree003,
    ),
  ),
  "tree-004": dynamic(() =>
    import("@/registry/components/tree/tree-004/tree-004").then(
      (module) => module.Tree004,
    ),
  ),
  "tree-005": dynamic(() =>
    import("@/registry/components/tree/tree-005/tree-005").then(
      (module) => module.Tree005,
    ),
  ),
  "tree-006": dynamic(() =>
    import("@/registry/components/tree/tree-006/tree-006").then(
      (module) => module.Tree006,
    ),
  ),
  "tree-007": dynamic(() =>
    import("@/registry/components/tree/tree-007/tree-007").then(
      (module) => module.Tree007,
    ),
  ),
  "tree-008": dynamic(() =>
    import("@/registry/components/tree/tree-008/tree-008").then(
      (module) => module.Tree008,
    ),
  ),
} as unknown as Record<string, ComponentType<PreviewProps>>
