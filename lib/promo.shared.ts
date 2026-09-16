import type { PlanId } from "@/lib/plans"

/** Типы промокода, общие для сервера и витрины: без `server-only`. */
export type PromoFailure = "invalid" | "not_found" | "own" | "not_first"

export type PromoPrices = Record<PlanId, number>

export type PromoCheck =
  | { ok: true; code: string; percent: number; prices: PromoPrices }
  | { ok: false; reason: PromoFailure }

export type AppliedPromo = {
  code: string
  percent: number
  prices: PromoPrices
}
