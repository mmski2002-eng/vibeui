import type { RegistryItem } from "shadcn/schema"

export type BlockMeta = {
  tags: string[]
  ai: {
    summary: string
    preserve: string[]
    adapt: string[]
    notes?: string[]
  }
  internal?: boolean
  featured?: boolean
}

export type BlockItem = RegistryItem & { meta?: BlockMeta }
