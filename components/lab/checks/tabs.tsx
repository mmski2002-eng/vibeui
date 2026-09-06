import type { LabCheck } from "@/components/lab/check-types"

import { Tabs001 } from "@/registry/components/tabs/tabs-001/tabs-001"
import { Tabs014 } from "@/registry/components/tabs/tabs-014/tabs-014"
import { Tabs002 } from "@/registry/components/tabs/tabs-002/tabs-002"
import { Tabs003 } from "@/registry/components/tabs/tabs-003/tabs-003"
import { Tabs004 } from "@/registry/components/tabs/tabs-004/tabs-004"
import { Tabs005 } from "@/registry/components/tabs/tabs-005/tabs-005"
import { Tabs006 } from "@/registry/components/tabs/tabs-006/tabs-006"
import { Tabs007 } from "@/registry/components/tabs/tabs-007/tabs-007"
import { Tabs008 } from "@/registry/components/tabs/tabs-008/tabs-008"
import { Tabs009 } from "@/registry/components/tabs/tabs-009/tabs-009"
import { Tabs010 } from "@/registry/components/tabs/tabs-010/tabs-010"
import { Tabs011 } from "@/registry/components/tabs/tabs-011/tabs-011"
import { Tabs013 } from "@/registry/components/tabs/tabs-013/tabs-013"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 44675

export const CHECKS: LabCheck[] = [
  {
    name: "tabs-001",
    title: "Вкладки с клавиатурой",
    notes: ["Открыта вкладка: domains", "Акцент: #139d8a"],
    node: <Tabs001 defaultId="domains" accent="#139d8a" />,
  },
  {
    name: "tabs-014",
    title: "Полоса вкладок на телефоне",
    notes: ["Активный: Профиль", "Акцент: #adef6a"],
    node: <Tabs014 activeLabel="Профиль" accent="#adef6a" />,
  },
  {
    name: "tabs-002",
    title: "Вкладки на CSS",
    notes: ["Имя группы: Подпись: тест", "Акцент: #d9821e"],
    node: <Tabs002 name="Подпись: тест" accent="#d9821e" />,
  },
  {
    name: "tabs-003",
    title: "Скользящее подчёркивание",
    notes: ["Открыта вкладка: budget", "Акцент: #80bb3f"],
    node: <Tabs003 defaultId="budget" accent="#80bb3f" />,
  },
  {
    name: "tabs-004",
    title: "Вкладки-пилюли",
    notes: ["Период: day", "Акцент: #208dd5"],
    node: <Tabs004 defaultId="day" accent="#208dd5" />,
  },
  {
    name: "tabs-005",
    title: "Вертикальные вкладки",
    notes: ["Раздел: alerts", "Акцент: #dbfb5e"],
    node: <Tabs005 defaultId="alerts" accent="#dbfb5e" />,
  },
  {
    name: "tabs-006",
    title: "Вкладки со счётчиками",
    notes: ["Папка: later", "Акцент: #fc4232"],
    node: <Tabs006 defaultId="later" accent="#fc4232" />,
  },
  {
    name: "tabs-007",
    title: "Прокручиваемые вкладки",
    notes: ["Город: spb", "Акцент: #f6bfad"],
    node: <Tabs007 defaultId="spb" accent="#f6bfad" />,
  },
  {
    name: "tabs-008",
    title: "Вкладки с переполнением",
    notes: ["Видимых вкладок: 4", "Кнопка: Тест", "Акцент: #7b29d1"],
    node: <Tabs008 visible={4} moreLabel="Тест" accent="#7b29d1" />,
  },
  {
    name: "tabs-009",
    title: "Вкладки редактора",
    notes: ["Открыт файл: page", "Акцент: #2de982"],
    node: <Tabs009 defaultId="page" accent="#2de982" />,
  },
  {
    name: "tabs-010",
    title: "Вкладки на радиокнопках",
    notes: ["Акцент: #fdb5ea"],
    node: <Tabs010 accent="#fdb5ea" />,
  },
  {
    name: "tabs-011",
    title: "Вкладки в адресе",
    notes: ["Подпись полосы: Разделы услуги", "Акцент: #0f766e"],
    node: <Tabs011 groupLabel="Разделы услуги" accent="#0f766e" />,
  },
  {
    name: "tabs-013",
    title: "Загрузка панели",
    notes: [
      "Открытая вкладка: logs",
      "Подпись загрузки: Тянем данные…",
      "Подпись ошибки: Не отдалось",
      "Акцент: #ef476f",
    ],
    node: (
      <Tabs013
        currentId="logs"
        loadingText="Тянем данные…"
        errorText="Не отдалось"
        accent="#ef476f"
      />
    ),
  },
]
