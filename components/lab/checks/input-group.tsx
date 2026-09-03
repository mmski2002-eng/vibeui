import type { LabCheck } from "@/components/lab/check-types"

import { Inputgroup001 } from "@/registry/components/input-group/inputgroup-001/inputgroup-001"
import { Inputgroup002 } from "@/registry/components/input-group/inputgroup-002/inputgroup-002"
import { Inputgroup003 } from "@/registry/components/input-group/inputgroup-003/inputgroup-003"
import { Inputgroup004 } from "@/registry/components/input-group/inputgroup-004/inputgroup-004"
import { Inputgroup005 } from "@/registry/components/input-group/inputgroup-005/inputgroup-005"
import { Inputgroup006 } from "@/registry/components/input-group/inputgroup-006/inputgroup-006"
import { Inputgroup007 } from "@/registry/components/input-group/inputgroup-007/inputgroup-007"
import { Inputgroup008 } from "@/registry/components/input-group/inputgroup-008/inputgroup-008"
import { Inputgroup009 } from "@/registry/components/input-group/inputgroup-009/inputgroup-009"
import { Inputgroup010 } from "@/registry/components/input-group/inputgroup-010/inputgroup-010"
import { Inputgroup011 } from "@/registry/components/input-group/inputgroup-011/inputgroup-011"
import { Inputgroup012 } from "@/registry/components/input-group/inputgroup-012/inputgroup-012"
import { Inputgroup013 } from "@/registry/components/input-group/inputgroup-013/inputgroup-013"
import { Inputgroup014 } from "@/registry/components/input-group/inputgroup-014/inputgroup-014"
import { Inputgroup015 } from "@/registry/components/input-group/inputgroup-015/inputgroup-015"
import { Inputgroup016 } from "@/registry/components/input-group/inputgroup-016/inputgroup-016"
import { Inputgroup017 } from "@/registry/components/input-group/inputgroup-017/inputgroup-017"
import { Inputgroup018 } from "@/registry/components/input-group/inputgroup-018/inputgroup-018"
import { Inputgroup019 } from "@/registry/components/input-group/inputgroup-019/inputgroup-019"
import { Inputgroup020 } from "@/registry/components/input-group/inputgroup-020/inputgroup-020"
import { Inputgroup021 } from "@/registry/components/input-group/inputgroup-021/inputgroup-021"
import { Inputgroup022 } from "@/registry/components/input-group/inputgroup-022/inputgroup-022"
import { Inputgroup023 } from "@/registry/components/input-group/inputgroup-023/inputgroup-023"
import { Inputgroup024 } from "@/registry/components/input-group/inputgroup-024/inputgroup-024"
import { Inputgroup025 } from "@/registry/components/input-group/inputgroup-025/inputgroup-025"
import { Inputgroup026 } from "@/registry/components/input-group/inputgroup-026/inputgroup-026"
import { Inputgroup027 } from "@/registry/components/input-group/inputgroup-027/inputgroup-027"
import { Inputgroup028 } from "@/registry/components/input-group/inputgroup-028/inputgroup-028"
import { Inputgroup029 } from "@/registry/components/input-group/inputgroup-029/inputgroup-029"
import { Inputgroup030 } from "@/registry/components/input-group/inputgroup-030/inputgroup-030"
import { Inputgroup031 } from "@/registry/components/input-group/inputgroup-031/inputgroup-031"
import { Inputgroup032 } from "@/registry/components/input-group/inputgroup-032/inputgroup-032"
import { Inputgroup033 } from "@/registry/components/input-group/inputgroup-033/inputgroup-033"
import { Inputgroup034 } from "@/registry/components/input-group/inputgroup-034/inputgroup-034"
import { Inputgroup035 } from "@/registry/components/input-group/inputgroup-035/inputgroup-035"
import { Inputgroup036 } from "@/registry/components/input-group/inputgroup-036/inputgroup-036"
import { Inputgroup037 } from "@/registry/components/input-group/inputgroup-037/inputgroup-037"
import { Inputgroup038 } from "@/registry/components/input-group/inputgroup-038/inputgroup-038"
import { Inputgroup039 } from "@/registry/components/input-group/inputgroup-039/inputgroup-039"
import { Inputgroup040 } from "@/registry/components/input-group/inputgroup-040/inputgroup-040"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 108

export const CHECKS: LabCheck[] = [
  {
    name: "inputgroup-001",
    title: "Слитая кнопка",
    notes: ["Подпись: Что дальше", "Кнопка: Черновик", "Акцент: #854867"],
    node: (
      <Inputgroup001 label="Что дальше" action="Черновик" accent="#854867" />
    ),
  },
  {
    name: "inputgroup-002",
    title: "Код страны",
    notes: ["Подпись: Смена", "Акцент: #cf8de3", "Формат номера: Что дальше"],
    node: (
      <Inputgroup002 label="Смена" accent="#cf8de3" placeholder="Что дальше" />
    ),
  },
  {
    name: "inputgroup-003",
    title: "Действия по краям",
    notes: ["Подпись: Черновик", "Приставка: Что дальше", "Акцент: #4bb1f1"],
    node: <Inputgroup003 label="Черновик" base="Что дальше" accent="#4bb1f1" />,
  },
  {
    name: "inputgroup-004",
    title: "Валюта у поля",
    notes: ["Подпись: Что дальше", "Сумма: 0", "Акцент: #3f678f"],
    node: (
      <Inputgroup004 label="Что дальше" defaultValue={0} accent="#3f678f" />
    ),
  },
  {
    name: "inputgroup-005",
    title: "Поиск с областью",
    notes: [
      "Подпись: Черновик",
      "Подсказка в поле: Смена",
      "Кнопка: Что дальше",
      "Акцент: #f600a6",
    ],
    node: (
      <Inputgroup005
        label="Черновик"
        placeholder="Смена"
        action="Что дальше"
        accent="#f600a6"
      />
    ),
  },
  {
    name: "inputgroup-006",
    title: "Пара полей диапазона",
    notes: [
      "Подпись: Подпись: тест",
      "От: 238262",
      "До: 401139",
      "Акцент: #ebd933",
    ],
    node: (
      <Inputgroup006
        legend="Подпись: тест"
        from={238262}
        to={401139}
        accent="#ebd933"
      />
    ),
  },
  {
    name: "inputgroup-007",
    title: "Иконка и очистка",
    notes: ["Подпись: Смена", "Подсказка в поле: Смена", "Акцент: #2b54c3"],
    node: <Inputgroup007 label="Смена" placeholder="Смена" accent="#2b54c3" />,
  },
  {
    name: "inputgroup-008",
    title: "Группа в столбик",
    notes: ["Подпись: Что дальше", "Кнопка: Черновик", "Акцент: #d73985"],
    node: (
      <Inputgroup008 label="Что дальше" action="Черновик" accent="#d73985" />
    ),
  },
  {
    name: "inputgroup-009",
    title: "Ошибка группы",
    notes: [
      "Подпись: Что дальше",
      "Текст ошибки: Подпись: тест",
      "Акцент: #3703a2",
    ],
    node: (
      <Inputgroup009
        label="Что дальше"
        error="Подпись: тест"
        accent="#3703a2"
      />
    ),
  },
  {
    name: "inputgroup-010",
    title: "Префикс домена",
    notes: [
      "Подпись: Смена",
      "Приставка: Проверка",
      "Предел длины: 61",
      "Акцент: #cda0dc",
    ],
    node: (
      <Inputgroup010
        label="Смена"
        prefix="Проверка"
        limit={61}
        accent="#cda0dc"
      />
    ),
  },
  {
    name: "inputgroup-011",
    title: "Выбор валюты",
    notes: ["Подпись: Проверка", "Сумма: 0", "Акцент: #798c6e"],
    node: <Inputgroup011 label="Проверка" defaultValue={0} accent="#798c6e" />,
  },
  {
    name: "inputgroup-012",
    title: "Поиск с фильтром",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка в поле: Черновик",
      "Акцент: #e2760e",
    ],
    node: (
      <Inputgroup012
        label="Подпись: тест"
        placeholder="Черновик"
        accent="#e2760e"
      />
    ),
  },
  {
    name: "inputgroup-013",
    title: "Копирование ссылки",
    notes: ["Акцент: #f4a0be"],
    node: <Inputgroup013 accent="#f4a0be" />,
  },
  {
    name: "inputgroup-014",
    title: "Счётчик с единицей",
    notes: ["Значение: 2", "Шаг: 5", "Акцент: #13338d"],
    node: <Inputgroup014 defaultValue={2} step={5} accent="#13338d" />,
  },
  {
    name: "inputgroup-015",
    title: "Протокол и домен",
    notes: ["Акцент: #3a597d"],
    node: <Inputgroup015 accent="#3a597d" />,
  },
  {
    name: "inputgroup-016",
    title: "Генератор пароля",
    notes: ["Акцент: #4613e6"],
    node: <Inputgroup016 accent="#4613e6" />,
  },
  {
    name: "inputgroup-017",
    title: "Выбор файла",
    notes: ["Акцент: #fe23ba"],
    node: <Inputgroup017 accent="#fe23ba" />,
  },
  {
    name: "inputgroup-018",
    title: "Промежуток дат",
    notes: ["Акцент: #12009f"],
    node: <Inputgroup018 accent="#12009f" />,
  },
  {
    name: "inputgroup-019",
    title: "Живой поиск по области",
    notes: ["Акцент: #548725"],
    node: <Inputgroup019 accent="#548725" />,
  },
  {
    name: "inputgroup-020",
    title: "Добавление тегов списком",
    notes: ["Предел: 5", "Акцент: #ab00bb"],
    node: <Inputgroup020 max={5} accent="#ab00bb" />,
  },
  {
    name: "inputgroup-021",
    title: "Страна списком",
    notes: ["Акцент: #8476ff"],
    node: <Inputgroup021 accent="#8476ff" />,
  },
  {
    name: "inputgroup-022",
    title: "Пояснение к полю",
    notes: ["Акцент: #55db7c"],
    node: <Inputgroup022 accent="#55db7c" />,
  },
  {
    name: "inputgroup-023",
    title: "Быстрые суммы",
    notes: ["Акцент: #a0348f"],
    node: <Inputgroup023 accent="#a0348f" />,
  },
  {
    name: "inputgroup-024",
    title: "Статус промокода",
    notes: ["Акцент: #5b48de"],
    node: <Inputgroup024 accent="#5b48de" />,
  },
  {
    name: "inputgroup-025",
    title: "Вставка из буфера",
    notes: [
      "Подпись поля: Подпись: тест",
      "Текст кнопки: Что дальше",
      "Акцент: #24e514",
    ],
    node: (
      <Inputgroup025
        label="Подпись: тест"
        buttonLabel="Что дальше"
        accent="#24e514"
      />
    ),
  },
  {
    name: "inputgroup-026",
    title: "История поиска",
    notes: ["Подпись поля: Что дальше", "Размер истории: 8", "Акцент: #5d8ee4"],
    node: <Inputgroup026 label="Что дальше" maxHistory={8} accent="#5d8ee4" />,
  },
  {
    name: "inputgroup-027",
    title: "Переключатель скидки",
    notes: [
      "Подпись поля: Что дальше",
      "Единица: currency",
      "Значение: 1",
      "Предел процента: 85",
      "Акцент: #e4b539",
    ],
    node: (
      <Inputgroup027
        label="Что дальше"
        defaultUnit="currency"
        defaultValue={1}
        maxPercent={85}
        accent="#e4b539"
      />
    ),
  },
  {
    name: "inputgroup-028",
    title: "Город и адрес",
    notes: ["Подпись поля: Проверка", "Плейсхолдер: Смена", "Акцент: #52d26e"],
    node: (
      <Inputgroup028 label="Проверка" placeholder="Смена" accent="#52d26e" />
    ),
  },
  {
    name: "inputgroup-029",
    title: "Статус автосохранения",
    notes: [
      "Подпись поля: Смена",
      "Пауза до сохранения: 1840",
      "Акцент: #d2d5e1",
    ],
    node: <Inputgroup029 label="Смена" delay={1840} accent="#d2d5e1" />,
  },
  {
    name: "inputgroup-030",
    title: "Очистить и применить",
    notes: [
      "Подпись поля: Черновик",
      "Кнопка очистки: Черновик",
      "Кнопка применения: Смена",
      "Акцент: #e2076b",
    ],
    node: (
      <Inputgroup030
        label="Черновик"
        clearLabel="Черновик"
        applyLabel="Смена"
        accent="#e2076b"
      />
    ),
  },
  {
    name: "inputgroup-031",
    title: "Счётчик обязательных",
    notes: [
      "Подпись поля: Что дальше",
      "Лимит символов: 40",
      "Обязательное: true",
      "Акцент: #49defe",
    ],
    node: (
      <Inputgroup031
        label="Что дальше"
        maxLength={40}
        required={true}
        accent="#49defe"
      />
    ),
  },
  {
    name: "inputgroup-032",
    title: "Сканирование устройством",
    notes: [
      "Подпись поля: Проверка",
      "Сканер подключён: false",
      "Длительность съёмки: 547",
      "Акцент: #427933",
    ],
    node: (
      <Inputgroup032
        label="Проверка"
        connected={false}
        scanDelay={547}
        accent="#427933"
      />
    ),
  },
  {
    name: "inputgroup-033",
    title: "Единица длительности",
    notes: [
      "Подпись поля: Подпись: тест",
      "Единица: day",
      "Значение: Тест",
      "Акцент: #e5b8b6",
    ],
    node: (
      <Inputgroup033
        label="Подпись: тест"
        defaultUnit="day"
        defaultValue="Тест"
        accent="#e5b8b6"
      />
    ),
  },
  {
    name: "inputgroup-034",
    title: "Показ ключа",
    notes: [
      "Подпись поля: Проверка",
      "Значение: Подпись: тест",
      "Акцент: #449263",
    ],
    node: (
      <Inputgroup034
        label="Проверка"
        defaultValue="Подпись: тест"
        accent="#449263"
      />
    ),
  },
  {
    name: "inputgroup-035",
    title: "Проверка ника",
    notes: [
      "Подпись поля: Смена",
      "Плейсхолдер: Что дальше",
      "Задержка проверки, мс: 2816",
      "Акцент: #ae09b5",
    ],
    node: (
      <Inputgroup035
        label="Смена"
        placeholder="Что дальше"
        checkDelay={2816}
        accent="#ae09b5"
      />
    ),
  },
  {
    name: "inputgroup-036",
    title: "Защита диапазона",
    notes: ["Подпись сцепки: Черновик", "От: 83", "До: 62", "Акцент: #267d6e"],
    node: (
      <Inputgroup036
        legend="Черновик"
        defaultFrom={83}
        defaultTo={62}
        accent="#267d6e"
      />
    ),
  },
  {
    name: "inputgroup-037",
    title: "Шаблоны ответа",
    notes: [
      "Подпись поля: Смена",
      "Плейсхолдер: Что дальше",
      "Кнопка шаблонов: Проверка",
      "Акцент: #185fc8",
    ],
    node: (
      <Inputgroup037
        label="Смена"
        placeholder="Что дальше"
        triggerText="Проверка"
        accent="#185fc8"
      />
    ),
  },
  {
    name: "inputgroup-038",
    title: "Определение по геолокации",
    notes: ["Подпись поля: Смена", "Плейсхолдер: Смена", "Акцент: #1e9ae9"],
    node: <Inputgroup038 label="Смена" placeholder="Смена" accent="#1e9ae9" />,
  },
  {
    name: "inputgroup-039",
    title: "Чип файла",
    notes: [
      "Подпись поля: Смена",
      "Кнопка выбора: Черновик",
      "Акцент: #440e9a",
    ],
    node: (
      <Inputgroup039 label="Смена" triggerText="Черновик" accent="#440e9a" />
    ),
  },
  {
    name: "inputgroup-040",
    title: "Копирование команды",
    notes: [
      "Подпись поля: Смена",
      "Команда: Смена",
      "Приставка: Ня",
      "Акцент: #610e7e",
    ],
    node: (
      <Inputgroup040
        label="Смена"
        defaultValue="Смена"
        prefix="Ня"
        accent="#610e7e"
      />
    ),
  },
]
