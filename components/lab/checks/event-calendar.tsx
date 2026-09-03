import type { LabCheck } from "@/components/lab/check-types"

import { Eventcalendar001 } from "@/registry/components/event-calendar/eventcalendar-001/eventcalendar-001"
import { Eventcalendar002 } from "@/registry/components/event-calendar/eventcalendar-002/eventcalendar-002"
import { Eventcalendar003 } from "@/registry/components/event-calendar/eventcalendar-003/eventcalendar-003"
import { Eventcalendar004 } from "@/registry/components/event-calendar/eventcalendar-004/eventcalendar-004"
import { Eventcalendar005 } from "@/registry/components/event-calendar/eventcalendar-005/eventcalendar-005"
import { Eventcalendar006 } from "@/registry/components/event-calendar/eventcalendar-006/eventcalendar-006"
import { Eventcalendar007 } from "@/registry/components/event-calendar/eventcalendar-007/eventcalendar-007"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 23865

export const CHECKS: LabCheck[] = [
  {
    name: "eventcalendar-001",
    title: "Месяц с переполнением",
    notes: ["Событий в клетке: 2", "Акцент: #dd8121"],
    node: <Eventcalendar001 visible={2} accent="#dd8121" />,
  },
  {
    name: "eventcalendar-002",
    title: "Колонки недели",
    notes: [
      "Заголовок: Черновик",
      "Начало дня: 6",
      "Конец дня: 21",
      "Акцент: #398950",
    ],
    node: (
      <Eventcalendar002
        heading="Черновик"
        dayFrom={6}
        dayTo={21}
        accent="#398950"
      />
    ),
  },
  {
    name: "eventcalendar-003",
    title: "Дорожки дня",
    notes: ["Начало дня: 12", "Конец дня: 24", "Акцент: #a6abc8"],
    node: <Eventcalendar003 dayFrom={12} dayTo={24} accent="#a6abc8" />,
  },
  {
    name: "eventcalendar-004",
    title: "Лента ближайших",
    notes: ["Заголовок: Проверка", "Дней вперёд: 20", "Акцент: #b831cb"],
    node: <Eventcalendar004 heading="Проверка" days={20} accent="#b831cb" />,
  },
  {
    name: "eventcalendar-005",
    title: "Легенда источников",
    notes: ["Заголовок: Смена", "Недель в сетке: 5", "Акцент: #72e67f"],
    node: <Eventcalendar005 heading="Смена" weeks={5} accent="#72e67f" />,
  },
  {
    name: "eventcalendar-006",
    title: "Выбор времени приёма",
    notes: ["Заголовок: Проверка", "Дата: Черновик", "Акцент: #1f7a5c"],
    node: (
      <Eventcalendar006
        heading="Проверка"
        dateLabel="Черновик"
        accent="#1f7a5c"
      />
    ),
  },
  {
    name: "eventcalendar-007",
    title: "Месяц с точками занятости",
    notes: ["Месяц: Проверка", "Сегодня: 5", "Выбранный день: 12"],
    node: (
      <Eventcalendar007
        month="Проверка"
        today={5}
        selected={12}
        accent="#7a3fd4"
      />
    ),
  },
]
