import type { LabCheck } from "@/components/lab/check-types"

import { Hovercard001 } from "@/registry/components/hover-card/hovercard-001/hovercard-001"
import { Hovercard002 } from "@/registry/components/hover-card/hovercard-002/hovercard-002"
import { Hovercard003 } from "@/registry/components/hover-card/hovercard-003/hovercard-003"
import { Hovercard004 } from "@/registry/components/hover-card/hovercard-004/hovercard-004"
import { Hovercard005 } from "@/registry/components/hover-card/hovercard-005/hovercard-005"
import { Hovercard006 } from "@/registry/components/hover-card/hovercard-006/hovercard-006"
import { Hovercard007 } from "@/registry/components/hover-card/hovercard-007/hovercard-007"
import { Hovercard008 } from "@/registry/components/hover-card/hovercard-008/hovercard-008"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 92189

export const CHECKS: LabCheck[] = [
  {
    name: "hovercard-001",
    title: "Карточка по наведению",
    notes: [
      "Имя: Что дальше",
      "Логин: Смена",
      "Описание: Черновик",
      "Акцент: #1f0c6b",
    ],
    node: (
      <Hovercard001
        name="Что дальше"
        handle="Смена"
        about="Черновик"
        accent="#1f0c6b"
      />
    ),
  },
  {
    name: "hovercard-002",
    title: "Предпросмотр ссылки",
    notes: ["Домен: Смена", "Текст ссылки: Черновик", "Акцент: #80ac26"],
    node: (
      <Hovercard002 domain="Смена" anchorText="Черновик" accent="#80ac26" />
    ),
  },
  {
    name: "hovercard-003",
    title: "Карточка товара",
    notes: ["Цена: Смена", "Оценка: 3", "Акцент: #e69a21"],
    node: <Hovercard003 price="Смена" rating={3} accent="#e69a21" />,
  },
  {
    name: "hovercard-004",
    title: "Карточка репозитория",
    notes: [
      "Репозиторий: Смена",
      "Звёзды: Ня",
      "Цвет языка: #368ef0",
      "Акцент: #049a6b",
    ],
    node: (
      <Hovercard004
        repo="Смена"
        stars="Ня"
        languageColor="#368ef0"
        accent="#049a6b"
      />
    ),
  },
  {
    name: "hovercard-005",
    title: "Карточка термина",
    notes: ["Сокращение: 42", "Раздел: Проверка", "Акцент: #d7c3e6"],
    node: <Hovercard005 term="42" category="Проверка" accent="#d7c3e6" />,
  },
  {
    name: "hovercard-006",
    title: "Карточка события",
    notes: ["День: Ок", "Время: Проверка", "Акцент: #348796"],
    node: <Hovercard006 day="Ок" time="Проверка" accent="#348796" />,
  },
  {
    name: "hovercard-007",
    title: "Карточка намерения",
    notes: ["Задержка, с: 0", "Текст ссылки: Черновик", "Акцент: #b2aa4c"],
    node: <Hovercard007 delay={0} label="Черновик" accent="#b2aa4c" />,
  },
  {
    name: "hovercard-008",
    title: "Снимок репозитория",
    notes: [
      "Репозиторий: Черновик",
      "Звёзды: 42",
      "Открытые issue: Ок",
      "Цвет языка: #a9e4c1",
      "Акцент: #0c3000",
    ],
    node: (
      <Hovercard008
        repo="Черновик"
        stars="42"
        openIssues="Ок"
        languageColor="#a9e4c1"
        accent="#0c3000"
      />
    ),
  },
]
