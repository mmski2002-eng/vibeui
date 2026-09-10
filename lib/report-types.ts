/**
 * Виды и состояния обращений.
 *
 * Отдельным файлом от `report-actions.ts`: тот помечен "use server" и должен
 * экспортировать только серверные действия. Типы оттуда тянут и клиентские
 * компоненты, а смешивать это в одном модуле — лишний повод для сборщика
 * спорить с нами.
 */
export type ReportKind = "component" | "support" | "legal"

export type ReportStatus =
  | "new"
  | "in_progress"
  | "answered"
  | "closed"
  | "spam"

export type CreateReportResult =
  | { ok: true }
  | { ok: false; reason: "rate" | "invalid" }
