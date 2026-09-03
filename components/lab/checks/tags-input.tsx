import type { LabCheck } from "@/components/lab/check-types"

import { Tags001 } from "@/registry/components/tags-input/tags-001/tags-001"
import { Tags002 } from "@/registry/components/tags-input/tags-002/tags-002"
import { Tags003 } from "@/registry/components/tags-input/tags-003/tags-003"
import { Tags004 } from "@/registry/components/tags-input/tags-004/tags-004"
import { Tags005 } from "@/registry/components/tags-input/tags-005/tags-005"
import { Tags006 } from "@/registry/components/tags-input/tags-006/tags-006"
import { Tags007 } from "@/registry/components/tags-input/tags-007/tags-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 92189

export const CHECKS: LabCheck[] = [
  {
    name: "tags-001",
    title: "Ввод тегов",
    notes: ["Подпись: Что дальше", "Предел: 10", "Акцент: #1a49ee"],
    node: <Tags001 label="Что дальше" max={10} accent="#1a49ee" />,
  },
  {
    name: "tags-002",
    title: "Подсказки тегов",
    notes: ["Подпись: Смена", "Акцент: #6b5a22"],
    node: <Tags002 label="Смена" accent="#6b5a22" />,
  },
  {
    name: "tags-003",
    title: "Ограничение количества",
    notes: ["Подпись: Черновик", "Лимит: 7", "Акцент: #ac2664"],
    node: <Tags003 label="Черновик" max={7} accent="#ac2664" />,
  },
  {
    name: "tags-004",
    title: "Защита от дублей",
    notes: ["Подпись: Подпись: тест", "Акцент: #e69a21"],
    node: <Tags004 label="Подпись: тест" accent="#e69a21" />,
  },
  {
    name: "tags-005",
    title: "Разбор вставки",
    notes: ["Подпись: Смена", "Акцент: #8dad36"],
    node: <Tags005 label="Смена" accent="#8dad36" />,
  },
  {
    name: "tags-006",
    title: "Цветные категории",
    notes: ["Подпись: Черновик", "Акцент: #049a6b"],
    node: <Tags006 label="Черновик" accent="#049a6b" />,
  },
  {
    name: "tags-007",
    title: "Переполнение только для чтения",
    notes: ["Заголовок: Черновик", "Видимых: 2", "Акцент: #c9d7c3"],
    node: <Tags007 label="Черновик" visible={2} accent="#c9d7c3" />,
  },
]
