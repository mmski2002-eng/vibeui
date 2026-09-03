import type { LabCheck } from "@/components/lab/check-types"

import { Breadcrumb001 } from "@/registry/components/breadcrumb/breadcrumb-001/breadcrumb-001"
import { Breadcrumb002 } from "@/registry/components/breadcrumb/breadcrumb-002/breadcrumb-002"
import { Breadcrumb003 } from "@/registry/components/breadcrumb/breadcrumb-003/breadcrumb-003"
import { Breadcrumb004 } from "@/registry/components/breadcrumb/breadcrumb-004/breadcrumb-004"
import { Breadcrumb005 } from "@/registry/components/breadcrumb/breadcrumb-005/breadcrumb-005"
import { Breadcrumb006 } from "@/registry/components/breadcrumb/breadcrumb-006/breadcrumb-006"
import { Breadcrumb007 } from "@/registry/components/breadcrumb/breadcrumb-007/breadcrumb-007"
import { Breadcrumb008 } from "@/registry/components/breadcrumb/breadcrumb-008/breadcrumb-008"
import { Breadcrumb009 } from "@/registry/components/breadcrumb/breadcrumb-009/breadcrumb-009"
import { Breadcrumb010 } from "@/registry/components/breadcrumb/breadcrumb-010/breadcrumb-010"
import { Breadcrumb011 } from "@/registry/components/breadcrumb/breadcrumb-011/breadcrumb-011"
import { Breadcrumb012 } from "@/registry/components/breadcrumb/breadcrumb-012/breadcrumb-012"
import { Breadcrumb013 } from "@/registry/components/breadcrumb/breadcrumb-013/breadcrumb-013"
import { Breadcrumb014 } from "@/registry/components/breadcrumb/breadcrumb-014/breadcrumb-014"
import { Breadcrumb015 } from "@/registry/components/breadcrumb/breadcrumb-015/breadcrumb-015"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 92189

export const CHECKS: LabCheck[] = [
  {
    name: "breadcrumb-001",
    title: "Крошки со сворачиванием",
    notes: ["Уровней: 3", "Акцент: #4ebe1a"],
    node: <Breadcrumb001 maxVisible={3} accent="#4ebe1a" />,
  },
  {
    name: "breadcrumb-002",
    title: "Крошки через слеш",
    notes: ["Разделитель: 42", "Акцент: #1f0c6b"],
    node: <Breadcrumb002 separator="42" accent="#1f0c6b" />,
  },
  {
    name: "breadcrumb-003",
    title: "Путь от главной",
    notes: ["Имя корня: Смена", "Акцент: #bbfe80"],
    node: <Breadcrumb003 homeLabel="Смена" accent="#bbfe80" />,
  },
  {
    name: "breadcrumb-004",
    title: "Раскрываемые крошки",
    notes: ["Хвост: 3", "Акцент: #26640c"],
    node: <Breadcrumb004 visible={3} accent="#26640c" />,
  },
  {
    name: "breadcrumb-005",
    title: "Прокручиваемый путь",
    notes: ["Акцент: #86e69a"],
    node: <Breadcrumb005 accent="#86e69a" />,
  },
  {
    name: "breadcrumb-006",
    title: "Путь в шапке страницы",
    notes: [
      "Заголовок: Проверка",
      "Служебная строка: Подпись: тест",
      "Акцент: #ad368e",
    ],
    node: (
      <Breadcrumb006 title="Проверка" meta="Подпись: тест" accent="#ad368e" />
    ),
  },
  {
    name: "breadcrumb-007",
    title: "Путь с действиями",
    notes: [
      "Главное действие: Смена",
      "Второе действие: Подпись: тест",
      "Акцент: #3ddc22",
    ],
    node: (
      <Breadcrumb007
        actionLabel="Смена"
        secondaryLabel="Подпись: тест"
        accent="#3ddc22"
      />
    ),
  },
  {
    name: "breadcrumb-008",
    title: "Путь к файлу",
    notes: ["Путь: Черновик", "Разделитель: 42", "Акцент: #c07360"],
    node: <Breadcrumb008 path="Черновик" separator="42" accent="#c07360" />,
  },
  {
    name: "breadcrumb-009",
    title: "Путь мастера",
    notes: ["Текущий шаг: 2", "Акцент: #348796"],
    node: <Breadcrumb009 current={2} accent="#348796" />,
  },
  {
    name: "breadcrumb-010",
    title: "Путь со счётчиком",
    notes: ["Акцент: #48dbfc"],
    node: <Breadcrumb010 accent="#48dbfc" />,
  },
  {
    name: "breadcrumb-011",
    title: "Переход к соседям",
    notes: ["Родитель: Проверка", "Имя поля: Подпись: тест", "Акцент: #d56ad1"],
    node: (
      <Breadcrumb011
        rootLabel="Проверка"
        label="Подпись: тест"
        accent="#d56ad1"
      />
    ),
  },
  {
    name: "breadcrumb-012",
    title: "Ссылка на уровень выше",
    notes: [
      "Родитель: Что дальше",
      "Текущий уровень: Черновик",
      "Акцент: #c10c30",
    ],
    node: (
      <Breadcrumb012
        parentLabel="Что дальше"
        currentLabel="Черновик"
        accent="#c10c30"
      />
    ),
  },
  {
    name: "breadcrumb-013",
    title: "Меню уровня",
    notes: [
      "Текущая страница: Смена",
      "Заголовок меню: Что дальше",
      "Акцент: #ae3815",
    ],
    node: (
      <Breadcrumb013 current="Смена" menuTitle="Что дальше" accent="#ae3815" />
    ),
  },
  {
    name: "breadcrumb-014",
    title: "Крошки с типами",
    notes: [
      "Текущий уровень: Что дальше",
      "Тип узла: folder",
      "Акцент: #eac6b9",
    ],
    node: (
      <Breadcrumb014
        currentLabel="Что дальше"
        currentKind="folder"
        accent="#eac6b9"
      />
    ),
  },
  {
    name: "breadcrumb-015",
    title: "Загружающийся сегмент",
    notes: [
      "Имя записи: Подпись: тест",
      "Идёт загрузка: false",
      "Ширина заглушки: 14",
      "Акцент: #1d739a",
    ],
    node: (
      <Breadcrumb015
        currentLabel="Подпись: тест"
        loading={false}
        placeholderWidth={14}
        accent="#1d739a"
      />
    ),
  },
]
