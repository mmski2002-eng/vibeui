import type { ComponentType } from "react"

// TODO: сейчас поддерживаются два параллельных индекса — registry.json (metadata)
// и эта карта (React-компонент для preview). При десятках items карту нужно
// генерировать из registry.json, а не вести руками.

import { Button001 } from "@/registry/components/buttons/button-001/button-001"

export const BUTTONS_COMPONENTS: Record<string, ComponentType> = {
  "button-001": Button001,
}
