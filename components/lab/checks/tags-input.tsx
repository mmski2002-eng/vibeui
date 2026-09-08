import type { LabCheck } from "@/components/lab/check-types"

import { Tags001 } from "@/registry/components/tags-input/tags-001/tags-001"
import { Tags002 } from "@/registry/components/tags-input/tags-002/tags-002"
import { Tags003 } from "@/registry/components/tags-input/tags-003/tags-003"
import { Tags004 } from "@/registry/components/tags-input/tags-004/tags-004"
import { Tags005 } from "@/registry/components/tags-input/tags-005/tags-005"
import { Tags006 } from "@/registry/components/tags-input/tags-006/tags-006"
import { Tags007 } from "@/registry/components/tags-input/tags-007/tags-007"
import { Tags008 } from "@/registry/components/tags-input/tags-008/tags-008"
import { Tags009 } from "@/registry/components/tags-input/tags-009/tags-009"
import { Tags010 } from "@/registry/components/tags-input/tags-010/tags-010"

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
  {
    name: "tags-008",
    title: "Приглашения по почте",
    notes: ["Заголовок: Участники проекта", "Акцент: #2a9d8f"],
    node: <Tags008 title="Участники проекта" accent="#2a9d8f" />,
  },
  {
    name: "tags-009",
    title: "Создание нового тега",
    notes: [
      "Заголовок: Темы статьи",
      "Текст создания: Добавить «{name}»",
      "Акцент: #7c5cff",
    ],
    node: (
      <Tags009
        title="Темы статьи"
        createTemplate="Добавить «{name}»"
        accent="#7c5cff"
      />
    ),
  },
  {
    name: "tags-010",
    title: "Порядок тегов",
    notes: ["Заголовок: Приоритеты недели", "Акцент: #e07a5f"],
    node: <Tags010 title="Приоритеты недели" accent="#e07a5f" />,
  },
]
