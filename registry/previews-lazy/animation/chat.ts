// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "chat-001": dynamic(() =>
    import("@/registry/animations/chat/chat-001/chat-001").then((module) => module.Chat001),
  ),
  "chat-002": dynamic(() =>
    import("@/registry/animations/chat/chat-002/chat-002").then((module) => module.Chat002),
  ),
  "chat-003": dynamic(() =>
    import("@/registry/animations/chat/chat-003/chat-003").then((module) => module.Chat003),
  ),
} satisfies PreviewMap
