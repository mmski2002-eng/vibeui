import type { LabCheck } from "@/components/lab/check-types"

import { Spinner001 } from "@/registry/components/spinner/spinner-001/spinner-001"
import { Spinner002 } from "@/registry/components/spinner/spinner-002/spinner-002"
import { Spinner003 } from "@/registry/components/spinner/spinner-003/spinner-003"
import { Spinner004 } from "@/registry/components/spinner/spinner-004/spinner-004"
import { Spinner005 } from "@/registry/components/spinner/spinner-005/spinner-005"
import { Spinner006 } from "@/registry/components/spinner/spinner-006/spinner-006"
import { Spinner007 } from "@/registry/components/spinner/spinner-007/spinner-007"
import { Spinner008 } from "@/registry/components/spinner/spinner-008/spinner-008"
import { Spinner009 } from "@/registry/components/spinner/spinner-009/spinner-009"
import { Spinner010 } from "@/registry/components/spinner/spinner-010/spinner-010"
import { Spinner011 } from "@/registry/components/spinner/spinner-011/spinner-011"
import { Spinner012 } from "@/registry/components/spinner/spinner-012/spinner-012"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 68432

export const CHECKS: LabCheck[] = [
  {
    name: "spinner-001",
    title: "Индикатор с подписью",
    notes: [
      "Действие: Смена",
      "Оценка: Смена",
      "Размер: sm",
      "Акцент: #07d4e0",
    ],
    node: <Spinner001 label="Смена" hint="Смена" size="sm" accent="#07d4e0" />,
  },
  {
    name: "spinner-002",
    title: "Волна из точек",
    notes: ["Подпись: Черновик", "Темп, с: 0.4"],
    node: <Spinner002 label="Черновик" speed={0.4} />,
  },
  {
    name: "spinner-003",
    title: "Неопределённый прогресс",
    notes: [
      "Подпись: Подпись: тест",
      "Вторая строка: Подпись: тест",
      "Толщина, px: 5",
    ],
    node: <Spinner003 label="Подпись: тест" hint="Подпись: тест" height={5} />,
  },
  {
    name: "spinner-004",
    title: "Кольцо с процентами",
    notes: [
      "Значение, %: 37",
      "Подпись: Что дальше",
      "Размер: md",
      "Вторая строка: Подпись: тест",
    ],
    node: (
      <Spinner004
        value={37}
        label="Что дальше"
        size="md"
        hintTemplate="Подпись: тест"
      />
    ),
  },
  {
    name: "spinner-005",
    title: "Блокирующая подложка",
    notes: [
      "Подпись: Проверка",
      "Блокировка: true",
      "Заголовок демо: Черновик",
    ],
    node: <Spinner005 label="Проверка" busy={true} sampleTitle="Черновик" />,
  },
  {
    name: "spinner-006",
    title: "Пульсирующий скелетон",
    notes: ["Строк: 6", "Картинка: false", "Подпись: Черновик"],
    node: <Spinner006 lines={6} media={false} label="Черновик" />,
  },
  {
    name: "spinner-007",
    title: "Догоняющие точки",
    notes: ["Подпись: Смена", "Темп, с: 1.5"],
    node: <Spinner007 label="Смена" speed={1.5} />,
  },
  {
    name: "spinner-008",
    title: "Полосатая полоса загрузки",
    notes: ["Подпись: Что дальше", "Подсказка: Смена", "Толщина, px: 11"],
    node: <Spinner008 label="Что дальше" hint="Смена" height={11} />,
  },
  {
    name: "spinner-009",
    title: "Кнопка с блокировкой отправки",
    notes: [
      "Подпись кнопки: Проверка",
      "Текст ожидания: Подпись: тест",
      "Длительность, мс: 3942",
      "Акцент: #c33d02",
    ],
    node: (
      <Spinner009
        label="Проверка"
        pendingLabel="Подпись: тест"
        pendingDuration={3942}
        accent="#c33d02"
      />
    ),
  },
  {
    name: "spinner-010",
    title: "Строка с бликом",
    notes: ["Ячеек: 6", "Подпись: Черновик"],
    node: <Spinner010 columns={6} label="Черновик" />,
  },
  {
    name: "spinner-011",
    title: "Сегментный циферблат",
    notes: [
      "Значение, %: 18",
      "Подпись: Смена",
      "Делений: 35",
      "Размер: md",
      "Вторая строка: Что дальше",
    ],
    node: (
      <Spinner011
        value={18}
        label="Смена"
        segments={35}
        size="md"
        hintTemplate="Что дальше"
      />
    ),
  },
  {
    name: "spinner-012",
    title: "Сообщение по этапам",
    notes: ["Подпись для скринридера: Что дальше", "Длительность круга, с: 6"],
    node: <Spinner012 label="Что дальше" speed={6} />,
  },
]
