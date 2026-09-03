import type { LabCheck } from "@/components/lab/check-types"

import { Rating001 } from "@/registry/components/rating/rating-001/rating-001"
import { Rating002 } from "@/registry/components/rating/rating-002/rating-002"
import { Rating003 } from "@/registry/components/rating/rating-003/rating-003"
import { Rating004 } from "@/registry/components/rating/rating-004/rating-004"
import { Rating005 } from "@/registry/components/rating/rating-005/rating-005"
import { Rating006 } from "@/registry/components/rating/rating-006/rating-006"
import { Rating007 } from "@/registry/components/rating/rating-007/rating-007"
import { Rating008 } from "@/registry/components/rating/rating-008/rating-008"
import { Rating009 } from "@/registry/components/rating/rating-009/rating-009"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 60513

export const CHECKS: LabCheck[] = [
  {
    name: "rating-001",
    title: "Оценка звёздами",
    notes: ["Вопрос: Смена", "Звёзд: 6", "Оценка: 1", "Акцент: #5af7a3"],
    node: (
      <Rating001 legend="Смена" max={6} defaultValue={1} accent="#5af7a3" />
    ),
  },
  {
    name: "rating-002",
    title: "Половинки звёзд",
    notes: ["Вопрос: Смена", "Оценка: 0", "Акцент: #471c5a"],
    node: <Rating002 legend="Смена" defaultValue={0} accent="#471c5a" />,
  },
  {
    name: "rating-003",
    title: "Шкала из десяти",
    notes: ["Вопрос: Что дальше", "Делений: 7", "Оценка: 2", "Акцент: #3a0ad7"],
    node: (
      <Rating003 label="Что дальше" max={7} defaultValue={2} accent="#3a0ad7" />
    ),
  },
  {
    name: "rating-004",
    title: "Лица эмодзи",
    notes: ["Вопрос: Смена", "Выбрано: 0", "Акцент: #12550d"],
    node: <Rating004 legend="Смена" defaultValue={0} accent="#12550d" />,
  },
  {
    name: "rating-005",
    title: "Голос пальцем",
    notes: [
      "Вопрос: Смена",
      "Голосов «за»: 329",
      "Голосов «против»: 838",
      "Акцент: #0fa178",
    ],
    node: <Rating005 question="Смена" up={329} down={838} accent="#0fa178" />,
  },
  {
    name: "rating-006",
    title: "Обязательная причина",
    notes: [
      "Вопрос: Проверка",
      "Порог: 4",
      "Минимум символов: 22",
      "Акцент: #345b94",
    ],
    node: (
      <Rating006
        legend="Проверка"
        threshold={4}
        minLength={22}
        accent="#345b94"
      />
    ),
  },
  {
    name: "rating-007",
    title: "Сводка средней оценки",
    notes: ["Средняя: 2", "Отзывов: 26034", "Акцент: #d43ca1"],
    node: <Rating007 value={2} count={26034} accent="#d43ca1" />,
  },
  {
    name: "rating-008",
    title: "Шкала NPS",
    notes: [
      "Вопрос: Что дальше",
      "Подпись слева: Проверка",
      "Подпись справа: Черновик",
      "Акцент: #0e8ec4",
    ],
    node: (
      <Rating008
        legend="Что дальше"
        lowAnchor="Проверка"
        highAnchor="Черновик"
        accent="#0e8ec4"
      />
    ),
  },
  {
    name: "rating-009",
    title: "Распределение голосов",
    notes: ["Акцент: #f3d2b9"],
    node: <Rating009 accent="#f3d2b9" />,
  },
]
