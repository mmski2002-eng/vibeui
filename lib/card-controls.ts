import {
  AlignLeft,
  ArrowDownUp,
  Ban,
  Blend,
  ChevronDown,
  Circle,
  CircleDot,
  Clock,
  Columns2,
  Diamond,
  Ellipsis,
  Eye,
  Gauge,
  Grid2x2,
  Hash,
  Layers,
  ListCollapse,
  LayoutGrid,
  List,
  ListOrdered,
  LoaderCircle,
  Maximize2,
  Minus,
  Palette,
  Plus,
  Proportions,
  Ruler,
  Scan,
  Shapes,
  Square,
  SquareDashed,
  SquareStack,
  ToggleLeft,
  Triangle,
  Type,
  Flag,
  GitCommitVertical,
  IndentIncrease,
  Rows3,
  Sparkles,
  Tag,
  PaintBucket,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import type { ControlValue, ItemControl } from "@/registry/meta"

/**
 * База значков для быстрых настроек на карточке витрины.
 *
 * По карточке настройка крутится одной кнопкой, поэтому значок должен читаться
 * без подписи. Пропов в библиотеке под тысячу, и словаря «на каждое имя» тут
 * быть не может: база собрана по смыслу — повторяющиеся роли, которые
 * встречаются у разных компонентов. Незнакомый проп получает значок своего
 * типа, а не выпадает из карточки.
 */
const BY_PROP: Record<string, LucideIcon> = {
  accent: Palette,
  align: AlignLeft,
  count: Hash,
  defaultOpen: ListCollapse,
  delay: Clock,
  dense: Layers,
  density: Layers,
  disabled: Ban,
  divider: Minus,
  duration: Clock,
  background: PaintBucket,
  badge: Tag,
  elevation: SquareStack,
  glow: Sparkles,
  guide: IndentIncrease,
  exclusive: CircleDot,
  gap: Columns2,
  icon: Shapes,
  inset: SquareDashed,
  invert: Blend,
  layout: LayoutGrid,
  loading: LoaderCircle,
  marker: Triangle,
  numbered: ListOrdered,
  orientation: ArrowDownUp,
  progress: Gauge,
  radius: Proportions,
  ratio: Proportions,
  rail: GitCommitVertical,
  rows: List,
  shape: Diamond,
  side: Columns2,
  size: Maximize2,
  speed: Gauge,
  status: CircleDot,
  state: CircleDot,
  step: Hash,
  stripe: Flag,
  tone: Palette,
  variant: Grid2x2,
  visible: Eye,
  warn: TriangleAlert,
  width: Ruler,
  zebra: Rows3,
}

/** Запасной значок: тип контрола известен всегда. */
const BY_TYPE: Record<ItemControl["type"], LucideIcon> = {
  boolean: ToggleLeft,
  color: Palette,
  number: Hash,
  select: List,
  text: Type,
}

/**
 * Значки на отдельные значения. Кнопка тогда показывает не «здесь есть
 * настройка», а текущее состояние — на карточке это единственная подпись,
 * которую видно.
 */
const BY_VALUE: Record<string, Record<string, LucideIcon>> = {
  marker: {
    chevron: ChevronDown,
    dot: CircleDot,
    ring: Circle,
    triangle: Triangle,
    square: Square,
    plus: Plus,
    none: Ban,
  },
  elevation: {
    lift: SquareStack,
    ring: Scan,
    flat: Square,
  },
  glow: {
    edge: Sparkles,
    ring: Scan,
    none: Ban,
  },
  guide: {
    line: IndentIncrease,
    none: Ban,
  },
  progress: {
    bar: Gauge,
    count: Hash,
    none: Ban,
  },
  rail: {
    solid: Minus,
    dashed: Ellipsis,
    none: Ban,
  },
  stripe: {
    bar: Flag,
    ring: Scan,
    none: Ban,
  },
  divider: {
    line: Minus,
    dashed: Ellipsis,
    none: Ban,
  },
}

/**
 * Типы, которые крутятся одной кнопкой. Текст на карточке не редактируется:
 * поле ввода в строку значков не помещается, и это работа страницы item'а.
 */
const CARD_TYPES = new Set<ItemControl["type"]>([
  "select",
  "boolean",
  "number",
  "color",
])

export function isCardControl(control: ItemControl): boolean {
  // У числового контрола без границ круг не замкнуть: кнопка одна, и вернуться
  // к началу перебора будет нечем.
  if (control.type === "number") {
    return control.min !== undefined && control.max !== undefined
  }

  return CARD_TYPES.has(control.type)
}

export function cardControlIcon(
  control: ItemControl,
  value: ControlValue,
): LucideIcon {
  const byValue = BY_VALUE[control.prop]?.[String(value)]

  if (byValue) {
    return byValue
  }

  return BY_PROP[control.prop] ?? BY_TYPE[control.type]
}

/** Кто из контролов вынесен на карточку. Порядок задаёт сам item. */
export function pickCardControls(
  controls: ItemControl[],
  props: string[] | undefined,
): ItemControl[] {
  if (!props?.length) {
    return []
  }

  return props
    .map((prop) => controls.find((control) => control.prop === prop))
    .filter(
      (control): control is ItemControl =>
        control !== undefined && isCardControl(control),
    )
}

/**
 * Следующее значение по кругу. Кнопка одна, поэтому перебор идёт вперёд и
 * с последнего значения возвращается на первое.
 */
export function nextControlValue(
  control: ItemControl,
  value: ControlValue,
): ControlValue {
  switch (control.type) {
    case "select": {
      const index = control.options.indexOf(String(value))

      return control.options[(index + 1) % control.options.length]
    }
    case "boolean":
      return value !== true
    case "number": {
      const min = control.min ?? 0
      const max = control.max ?? min
      const next = Number(value) + 1

      return next > max ? min : next
    }
    default:
      return value
  }
}

/** Подпись кнопки: что настраивается и что стоит сейчас. */
export function cardControlTitle(
  control: ItemControl,
  value: ControlValue,
): string {
  if (control.type === "boolean") {
    return `${control.label}: ${value === true ? "on" : "off"}`
  }

  return `${control.label}: ${String(value) || "—"}`
}
