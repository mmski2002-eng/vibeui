import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

/** Все маршруты Better Auth: вход, регистрация, подтверждение, сброс. */
export const { GET, POST } = toNextJsHandler(auth)
