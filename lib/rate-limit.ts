import "server-only"

type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()

function clientIp(request: Request) {
  const real = request.headers.get("x-real-ip")?.trim()

  if (real) return real

  const forwarded = request.headers.get("x-forwarded-for") ?? ""
  const parts = forwarded
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  return parts[parts.length - 1] ?? "unknown"
}

/** Простой fixed-window лимит для одного Next-процесса за nginx. */
export function rateLimit(
  request: Request,
  namespace: string,
  limit: number,
  windowMs = 60_000,
) {
  const now = Date.now()
  const key = `${namespace}:${clientIp(request)}`
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  current.count += 1

  if (current.count <= limit) return null

  return new Response("Too many requests\n", {
    status: 429,
    headers: {
      "retry-after": String(
        Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
      ),
      "cache-control": "private, no-store",
    },
  })
}
