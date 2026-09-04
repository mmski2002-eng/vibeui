import type { LabCheck } from "@/components/lab/check-types"

import { Timeline001 } from "@/registry/components/timeline/timeline-001/timeline-001"
import { Timeline002 } from "@/registry/components/timeline/timeline-002/timeline-002"
import { Timeline003 } from "@/registry/components/timeline/timeline-003/timeline-003"
import { Timeline004 } from "@/registry/components/timeline/timeline-004/timeline-004"
import { Timeline005 } from "@/registry/components/timeline/timeline-005/timeline-005"
import { Timeline006 } from "@/registry/components/timeline/timeline-006/timeline-006"
import { Timeline007 } from "@/registry/components/timeline/timeline-007/timeline-007"
import { Timeline008 } from "@/registry/components/timeline/timeline-008/timeline-008"
import { Timeline009 } from "@/registry/components/timeline/timeline-009/timeline-009"
import { Timeline010 } from "@/registry/components/timeline/timeline-010/timeline-010"
import { Timeline011 } from "@/registry/components/timeline/timeline-011/timeline-011"
import { Timeline012 } from "@/registry/components/timeline/timeline-012/timeline-012"
import { Timeline013 } from "@/registry/components/timeline/timeline-013/timeline-013"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "timeline-001",
    title: "Лента событий",
    notes: ["Акцент: #ea5443", "Пройденный шаг: #449278"],
    node: <Timeline001 accent="#ea5443" done="#449278" />,
  },
  {
    name: "timeline-002",
    title: "Лента активности",
    notes: ["Заголовок: Проверка", "Акцент: #79c5c1"],
    node: <Timeline002 title="Проверка" accent="#79c5c1" />,
  },
  {
    name: "timeline-003",
    title: "Статус заказа",
    notes: ["Срок: Смена", "Акцент: #ddc0de", "Метка «сейчас»: Что дальше"],
    node: <Timeline003 eta="Смена" accent="#ddc0de" nowLabel="Что дальше" />,
  },
  {
    name: "timeline-004",
    title: "Вехи проекта",
    notes: ["Заголовок: Подпись: тест", "Акцент: #169cfe"],
    node: <Timeline004 title="Подпись: тест" accent="#169cfe" />,
  },
  {
    name: "timeline-005",
    title: "Версии документа",
    notes: [
      "Заголовок: Что дальше",
      "Акцент: #f9f357",
      "Метка версии: Проверка",
    ],
    node: (
      <Timeline005
        title="Что дальше"
        accent="#f9f357"
        currentLabel="Проверка"
      />
    ),
  },
  {
    name: "timeline-006",
    title: "События по типам",
    notes: ["Заголовок: Подпись: тест"],
    node: <Timeline006 title="Подпись: тест" />,
  },
  {
    name: "timeline-007",
    title: "Полоса этапов",
    notes: ["Заголовок: Что дальше", "Акцент: #420b66"],
    node: <Timeline007 title="Что дальше" accent="#420b66" />,
  },
  {
    name: "timeline-008",
    title: "Группы по дням",
    notes: [
      "Заголовок: Подпись: тест",
      "Акцент: #eba3ad",
      "Подпись ленты: Смена",
    ],
    node: (
      <Timeline008
        title="Подпись: тест"
        accent="#eba3ad"
        feedLabelText="Смена"
      />
    ),
  },
  {
    name: "timeline-009",
    title: "Отслеживание доставки",
    notes: ["Заказ: Смена", "Акцент: #c4fc91"],
    node: <Timeline009 orderLabel="Смена" accent="#c4fc91" />,
  },
  {
    name: "timeline-010",
    title: "История правок",
    notes: ["Заголовок: Смена"],
    node: <Timeline010 title="Смена" />,
  },
  {
    name: "timeline-011",
    title: "Лента вех",
    notes: ["Заголовок: Черновик", "Акцент: #4a3b6d"],
    node: <Timeline011 title="Черновик" accent="#4a3b6d" />,
  },
  {
    name: "timeline-012",
    title: "Сводка за день",
    notes: ["Заголовок: Черновик", "Акцент: #fff51a"],
    node: <Timeline012 title="Черновик" accent="#fff51a" />,
  },
  {
    name: "timeline-013",
    title: "Двусторонние вехи",
    notes: ["Заголовок: Черновик", "Акцент: #2fb8a6"],
    node: <Timeline013 title="Черновик" accent="#2fb8a6" />,
  },
]
