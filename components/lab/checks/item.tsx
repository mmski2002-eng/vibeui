import type { LabCheck } from "@/components/lab/check-types"

import { Item001 } from "@/registry/components/item/item-001/item-001"
import { Item002 } from "@/registry/components/item/item-002/item-002"
import { Item003 } from "@/registry/components/item/item-003/item-003"
import { Item004 } from "@/registry/components/item/item-004/item-004"
import { Item005 } from "@/registry/components/item/item-005/item-005"
import { Item006 } from "@/registry/components/item/item-006/item-006"
import { Item007 } from "@/registry/components/item/item-007/item-007"
import { Item008 } from "@/registry/components/item/item-008/item-008"
import { Item009 } from "@/registry/components/item/item-009/item-009"
import { Item010 } from "@/registry/components/item/item-010/item-010"
import { Item011 } from "@/registry/components/item/item-011/item-011"
import { Item012 } from "@/registry/components/item/item-012/item-012"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 44675

export const CHECKS: LabCheck[] = [
  {
    name: "item-001",
    title: "Строка списка",
    notes: [
      "Название: Смена",
      "Значение: Подпись: тест",
      "Статус: Проверка",
      "Акцент: #ef6a25",
    ],
    node: (
      <Item001
        title="Смена"
        value="Подпись: тест"
        status="Проверка"
        accent="#ef6a25"
      />
    ),
  },
  {
    name: "item-002",
    title: "Строка с иконкой",
    notes: ["Название: Черновик", "Знак: Тест", "Оттенок: #ac80bb"],
    node: <Item002 title="Черновик" glyph="Тест" tint="#ac80bb" />,
  },
  {
    name: "item-003",
    title: "Строка с действием",
    notes: ["Название: Смена", "Действие: Подпись: тест", "Акцент: #d5bddb"],
    node: <Item003 title="Смена" action="Подпись: тест" accent="#d5bddb" />,
  },
  {
    name: "item-004",
    title: "Строка-ссылка",
    notes: ["Название: Что дальше", "Приписка: 42", "Акцент: #423268"],
    node: <Item004 title="Что дальше" hint="42" accent="#423268" />,
  },
  {
    name: "item-005",
    title: "Строка с превью",
    notes: [
      "Название: Проверка",
      "Длительность: Подпись: тест",
      "Акцент: #b83b7b",
    ],
    node: <Item005 title="Проверка" badge="Подпись: тест" accent="#b83b7b" />,
  },
  {
    name: "item-006",
    title: "Три колонки данных",
    notes: ["Название: Черновик", "Акцент: #322de9"],
    node: <Item006 title="Черновик" accent="#322de9" />,
  },
  {
    name: "item-007",
    title: "Выделяемая строка",
    notes: ["Название: Черновик", "Отмечено: false", "Акцент: #ea6966"],
    node: <Item007 title="Черновик" defaultChecked={false} accent="#ea6966" />,
  },
  {
    name: "item-008",
    title: "Строка с ручкой перетаскивания",
    notes: [
      "Название: Черновик",
      "Всего строк: 9",
      "Позиция: 3",
      "Акцент: #85def1",
    ],
    node: <Item008 title="Черновик" total={9} position={3} accent="#85def1" />,
  },
  {
    name: "item-009",
    title: "Строка с маркером состояния",
    notes: ["Состояние: off", "Название: Проверка"],
    node: <Item009 state="off" title="Проверка" />,
  },
  {
    name: "item-010",
    title: "Плотные строки списка",
    notes: ["Плотность: tight", "Акцент: #e301cd"],
    node: <Item010 density="tight" accent="#e301cd" />,
  },
  {
    name: "item-011",
    title: "Строка чеклиста",
    notes: [
      "Задача: Проверка",
      "Срок: Что дальше",
      "Выполнено: false",
      "Акцент: #c284c0",
    ],
    node: (
      <Item011
        title="Проверка"
        due="Что дальше"
        defaultChecked={false}
        accent="#c284c0"
      />
    ),
  },
  {
    name: "item-012",
    title: "Строка уведомления",
    notes: [
      "Название: Что дальше",
      "Время: Черновик",
      "Непрочитано: false",
      "Акцент: #d6fca8",
    ],
    node: (
      <Item012
        title="Что дальше"
        time="Черновик"
        unread={false}
        accent="#d6fca8"
      />
    ),
  },
]
