import type { LabCheck } from "@/components/lab/check-types"

import { Radio001 } from "@/registry/components/radio-group/radio-001/radio-001"
import { Radio002 } from "@/registry/components/radio-group/radio-002/radio-002"
import { Radio003 } from "@/registry/components/radio-group/radio-003/radio-003"
import { Radio004 } from "@/registry/components/radio-group/radio-004/radio-004"
import { Radio005 } from "@/registry/components/radio-group/radio-005/radio-005"
import { Radio006 } from "@/registry/components/radio-group/radio-006/radio-006"
import { Radio007 } from "@/registry/components/radio-group/radio-007/radio-007"
import { Radio008 } from "@/registry/components/radio-group/radio-008/radio-008"
import { Radio009 } from "@/registry/components/radio-group/radio-009/radio-009"
import { Radio010 } from "@/registry/components/radio-group/radio-010/radio-010"
import { Radio011 } from "@/registry/components/radio-group/radio-011/radio-011"
import { Radio012 } from "@/registry/components/radio-group/radio-012/radio-012"
import { Radio013 } from "@/registry/components/radio-group/radio-013/radio-013"
import { Radio014 } from "@/registry/components/radio-group/radio-014/radio-014"
import { Radio015 } from "@/registry/components/radio-group/radio-015/radio-015"
import { Radio016 } from "@/registry/components/radio-group/radio-016/radio-016"
import { Radio017 } from "@/registry/components/radio-group/radio-017/radio-017"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 108

export const CHECKS: LabCheck[] = [
  {
    name: "radio-001",
    title: "Карточки-переключатели",
    notes: ["Вопрос: Что дальше", "Выбрано: team", "Акцент: #d48548"],
    node: <Radio001 legend="Что дальше" defaultValue="team" accent="#d48548" />,
  },
  {
    name: "radio-002",
    title: "Простые переключатели",
    notes: [
      "Вопрос: Подпись: тест",
      "Выбрано: Электронная почта",
      "Акцент: #cf8de3",
    ],
    node: (
      <Radio002
        legend="Подпись: тест"
        defaultValue="Электронная почта"
        accent="#cf8de3"
      />
    ),
  },
  {
    name: "radio-003",
    title: "Карточки выбора тарифа",
    notes: ["Заголовок: Что дальше", "Выбран тариф: solo", "Акцент: #ce4764"],
    node: <Radio003 legend="Что дальше" defaultValue="solo" accent="#ce4764" />,
  },
  {
    name: "radio-004",
    title: "Переключатели с пояснением",
    notes: ["Заголовок: Проверка", "Выбрано: public", "Акцент: #ed5616"],
    node: <Radio004 legend="Проверка" defaultValue="public" accent="#ed5616" />,
  },
  {
    name: "radio-005",
    title: "Сегментированный выбор",
    notes: [
      "Заголовок: Подпись: тест",
      "Выбран сегмент: Неделя",
      "Акцент: #8ed09e",
    ],
    node: (
      <Radio005 legend="Подпись: тест" defaultValue="Неделя" accent="#8ed09e" />
    ),
  },
  {
    name: "radio-006",
    title: "Плитки с иконками",
    notes: ["Заголовок: Проверка", "Выбрано: phone", "Акцент: #f600a6"],
    node: <Radio006 legend="Проверка" defaultValue="phone" accent="#f600a6" />,
  },
  {
    name: "radio-007",
    title: "Способ доставки",
    notes: ["Заголовок: Подпись: тест", "Выбрано: pickup", "Акцент: #66ebd9"],
    node: (
      <Radio007 legend="Подпись: тест" defaultValue="pickup" accent="#66ebd9" />
    ),
  },
  {
    name: "radio-008",
    title: "Вариант «другое»",
    notes: ["Вопрос: Проверка", "Заглушка поля: Что дальше", "Акцент: #2f2b54"],
    node: (
      <Radio008 legend="Проверка" placeholder="Что дальше" accent="#2f2b54" />
    ),
  },
  {
    name: "radio-009",
    title: "Карточки пакетов",
    notes: ["Заголовок: Проверка", "Выбран набор: 1", "Акцент: #0dffd7"],
    node: <Radio009 legend="Проверка" defaultValue="1" accent="#0dffd7" />,
  },
  {
    name: "radio-010",
    title: "Переключатель вида",
    notes: ["Заголовок: Подпись: тест", "Выбран вид: grid", "Акцент: #3dd585"],
    node: (
      <Radio010 legend="Подпись: тест" defaultValue="grid" accent="#3dd585" />
    ),
  },
  {
    name: "radio-011",
    title: "Слот доставки",
    notes: ["Заголовок: Смена", "Выбран слот: tomorrow-1", "Акцент: #0621ee"],
    node: (
      <Radio011 legend="Смена" defaultValue="tomorrow-1" accent="#0621ee" />
    ),
  },
  {
    name: "radio-012",
    title: "Выбор цвета образцами",
    notes: ["Заголовок: 42", "Выбран цвет: terracotta", "Акцент: #a0dc8a"],
    node: <Radio012 legend="42" defaultValue="terracotta" accent="#a0dc8a" />,
  },
  {
    name: "radio-013",
    title: "Шкала оценки",
    notes: ["Вопрос: Что дальше", "Выбрана оценка: 3", "Акцент: #8c6e60"],
    node: <Radio013 legend="Что дальше" defaultValue="3" accent="#8c6e60" />,
  },
  {
    name: "radio-014",
    title: "Способ оплаты",
    notes: ["Заголовок: Проверка", "Выбран способ: invoice", "Акцент: #e2760e"],
    node: (
      <Radio014 legend="Проверка" defaultValue="invoice" accent="#e2760e" />
    ),
  },
  {
    name: "radio-015",
    title: "Выбор темы миниатюрами",
    notes: ["Заголовок: Проверка", "Выбрана тема: system", "Акцент: #d96b13"],
    node: <Radio015 legend="Проверка" defaultValue="system" accent="#d96b13" />,
  },
  {
    name: "radio-016",
    title: "Сравнение тарифов",
    notes: [
      "Заголовок: Подпись: тест",
      "Выбран план: basic",
      "Метка рекомендации: Подпись: тест",
      "Акцент: #4613e6",
    ],
    node: (
      <Radio016
        legend="Подпись: тест"
        defaultValue="basic"
        recommendedLabel="Подпись: тест"
        accent="#4613e6"
      />
    ),
  },
  {
    name: "radio-017",
    title: "Причина отмены",
    notes: [
      "Вопрос: Смена",
      "Заглушка поля: Смена",
      "Пункт «другое»: Проверка",
      "Акцент: #548725",
    ],
    node: (
      <Radio017
        legend="Смена"
        placeholder="Смена"
        otherLabel="Проверка"
        accent="#548725"
      />
    ),
  },
]
