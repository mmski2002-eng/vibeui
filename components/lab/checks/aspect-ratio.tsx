import type { LabCheck } from "@/components/lab/check-types"

import { Aspect001 } from "@/registry/components/aspect-ratio/aspect-001/aspect-001"
import { Aspect002 } from "@/registry/components/aspect-ratio/aspect-002/aspect-002"
import { Aspect003 } from "@/registry/components/aspect-ratio/aspect-003/aspect-003"
import { Aspect004 } from "@/registry/components/aspect-ratio/aspect-004/aspect-004"
import { Aspect005 } from "@/registry/components/aspect-ratio/aspect-005/aspect-005"
import { Aspect006 } from "@/registry/components/aspect-ratio/aspect-006/aspect-006"
import { Aspect007 } from "@/registry/components/aspect-ratio/aspect-007/aspect-007"
import { Aspect008 } from "@/registry/components/aspect-ratio/aspect-008/aspect-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 8027

export const CHECKS: LabCheck[] = [
  {
    name: "aspect-001",
    title: "Кадр с пропорцией",
    notes: ["Соотношение: 1 / 1", "Подпись: Подпись: тест"],
    node: <Aspect001 ratio="1 / 1" label="Подпись: тест" />,
  },
  {
    name: "aspect-002",
    title: "Кадр под видео",
    notes: ["Название: Смена", "Длительность: Смена", "Акцент: #5fb478"],
    node: <Aspect002 title="Смена" duration="Смена" accent="#5fb478" />,
  },
  {
    name: "aspect-003",
    title: "Кадр товара",
    notes: [
      "Название: Подпись: тест",
      "Цена: Что дальше",
      "Плашка: Черновик",
      "Акцент: #532fd3",
    ],
    node: (
      <Aspect003
        title="Подпись: тест"
        price="Что дальше"
        badge="Черновик"
        accent="#532fd3"
      />
    ),
  },
  {
    name: "aspect-004",
    title: "Вертикальный кадр",
    notes: [
      "Рубрика: Черновик",
      "Заголовок: Что дальше",
      "Подпись: Подпись: тест",
      "Тон градиента: #5d78e9",
      "Акцент: #676e88",
    ],
    node: (
      <Aspect004
        eyebrow="Черновик"
        title="Что дальше"
        subtitle="Подпись: тест"
        ink="#5d78e9"
        accent="#676e88"
      />
    ),
  },
  {
    name: "aspect-005",
    title: "Кинематографичный баннер",
    notes: [
      "Заголовок: Подпись: тест",
      "Описание: Подпись: тест",
      "Кнопка: Проверка",
      "Акцент: #ba7dad",
    ],
    node: (
      <Aspect005
        title="Подпись: тест"
        description="Подпись: тест"
        actionLabel="Проверка"
        accent="#ba7dad"
      />
    ),
  },
  {
    name: "aspect-006",
    title: "Сетка-коллаж",
    notes: ["Кадров: 5", "Знак счётчика: Тест"],
    node: <Aspect006 visible={5} moreLabel="Тест" />,
  },
  {
    name: "aspect-007",
    title: "Кадр под встраивание",
    notes: [
      "Что встроено: Подпись: тест",
      "Источник: Смена",
      "Акцент: #563f95",
    ],
    node: <Aspect007 title="Подпись: тест" source="Смена" accent="#563f95" />,
  },
  {
    name: "aspect-008",
    title: "Скелетон галереи",
    notes: ["Соотношение: 4 / 3", "Кадров: 5", "Подпись: Проверка"],
    node: <Aspect008 ratio="4 / 3" count={5} label="Проверка" />,
  },
]
