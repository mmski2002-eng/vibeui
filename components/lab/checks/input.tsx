import type { LabCheck } from "@/components/lab/check-types"

import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Input002 } from "@/registry/components/input/input-002/input-002"
import { Input003 } from "@/registry/components/input/input-003/input-003"
import { Input004 } from "@/registry/components/input/input-004/input-004"
import { Input005 } from "@/registry/components/input/input-005/input-005"
import { Input006 } from "@/registry/components/input/input-006/input-006"
import { Input007 } from "@/registry/components/input/input-007/input-007"
import { Input008 } from "@/registry/components/input/input-008/input-008"
import { Input009 } from "@/registry/components/input/input-009/input-009"
import { Input010 } from "@/registry/components/input/input-010/input-010"
import { Input011 } from "@/registry/components/input/input-011/input-011"
import { Input012 } from "@/registry/components/input/input-012/input-012"
import { Input013 } from "@/registry/components/input/input-013/input-013"
import { Input014 } from "@/registry/components/input/input-014/input-014"
import { Input015 } from "@/registry/components/input/input-015/input-015"
import { Input016 } from "@/registry/components/input/input-016/input-016"
import { Input017 } from "@/registry/components/input/input-017/input-017"
import { Input018 } from "@/registry/components/input/input-018/input-018"
import { Input019 } from "@/registry/components/input/input-019/input-019"
import { Input020 } from "@/registry/components/input/input-020/input-020"
import { Input021 } from "@/registry/components/input/input-021/input-021"
import { Input022 } from "@/registry/components/input/input-022/input-022"
import { Input023 } from "@/registry/components/input/input-023/input-023"
import { Input024 } from "@/registry/components/input/input-024/input-024"
import { Input025 } from "@/registry/components/input/input-025/input-025"
import { Input026 } from "@/registry/components/input/input-026/input-026"
import { Input027 } from "@/registry/components/input/input-027/input-027"
import { Input028 } from "@/registry/components/input/input-028/input-028"
import { Input029 } from "@/registry/components/input/input-029/input-029"
import { Input030 } from "@/registry/components/input/input-030/input-030"
import { Input031 } from "@/registry/components/input/input-031/input-031"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 52594

export const CHECKS: LabCheck[] = [
  {
    name: "input-001",
    title: "Поле с плавающей подписью",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка: Подпись: тест",
      "Ошибка: Черновик",
      "Размер: lg",
      "Акцент: #8b676b",
      "Выключено: true",
    ],
    node: (
      <Input001
        label="Подпись: тест"
        hint="Подпись: тест"
        error="Черновик"
        size="lg"
        accent="#8b676b"
        disabled={true}
      />
    ),
  },
  {
    name: "input-002",
    title: "Группа полей",
    notes: [
      "Подпись: Смена",
      "Приставка: Что дальше",
      "Окончание: Что дальше",
      "Плейсхолдер: Смена",
      "Акцент: #6f09f8",
      "Выключено: true",
    ],
    node: (
      <Input002
        label="Смена"
        prefix="Что дальше"
        suffix="Что дальше"
        placeholder="Смена"
        accent="#6f09f8"
        disabled={true}
      />
    ),
  },
  {
    name: "input-003",
    title: "Поле пароля",
    notes: ["Подпись: Подпись: тест", "Плейсхолдер: Смена", "Акцент: #af002f"],
    node: (
      <Input003 label="Подпись: тест" placeholder="Смена" accent="#af002f" />
    ),
  },
  {
    name: "input-004",
    title: "Поле поиска",
    notes: ["Подпись: Проверка", "Горячая клавиша: 42", "Акцент: #92de12"],
    node: <Input004 label="Проверка" shortcut="42" accent="#92de12" />,
  },
  {
    name: "input-005",
    title: "Поле телефона",
    notes: [
      "Подпись: Проверка",
      "Код страны: 42",
      "Подсказка: Проверка",
      "Акцент: #3e0ca7",
    ],
    node: (
      <Input005 label="Проверка" prefix="42" hint="Проверка" accent="#3e0ca7" />
    ),
  },
  {
    name: "input-006",
    title: "Защита от опечатки в почте",
    notes: ["Подпись: Что дальше", "Значение: Проверка", "Акцент: #471fac"],
    node: (
      <Input006 label="Что дальше" defaultValue="Проверка" accent="#471fac" />
    ),
  },
  {
    name: "input-007",
    title: "Автоподстановка протокола",
    notes: ["Подпись: Черновик", "Схема: http", "Акцент: #8bacfb"],
    node: <Input007 label="Черновик" scheme="http" accent="#8bacfb" />,
  },
  {
    name: "input-008",
    title: "Маска карты",
    notes: ["Подпись: Черновик", "Номер: Что дальше", "Акцент: #f07fcf"],
    node: (
      <Input008 label="Черновик" defaultValue="Что дальше" accent="#f07fcf" />
    ),
  },
  {
    name: "input-009",
    title: "Поиск по горячей клавише",
    notes: ["Подсказка в поле: Смена", "Клавиша: Тест", "Акцент: #a11f7e"],
    node: <Input009 placeholder="Смена" shortcut="Тест" accent="#a11f7e" />,
  },
  {
    name: "input-010",
    title: "Единица списком",
    notes: ["Подпись: Проверка", "Значение: 2", "Акцент: #ebb618"],
    node: <Input010 label="Проверка" defaultValue={2} accent="#ebb618" />,
  },
  {
    name: "input-011",
    title: "Правила пароля",
    notes: ["Подпись: Черновик", "Минимум символов: 19", "Акцент: #bf17d1"],
    node: <Input011 label="Черновик" minLength={19} accent="#bf17d1" />,
  },
  {
    name: "input-012",
    title: "Подсказки из истории",
    notes: ["Подпись: Подпись: тест", "Акцент: #9eae1f"],
    node: <Input012 label="Подпись: тест" accent="#9eae1f" />,
  },
  {
    name: "input-013",
    title: "Промокод",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка в поле: Подпись: тест",
      "Акцент: #9db103",
    ],
    node: (
      <Input013
        label="Подпись: тест"
        placeholder="Подпись: тест"
        accent="#9db103"
      />
    ),
  },
  {
    name: "input-014",
    title: "Проверка ника",
    notes: ["Подпись: Смена", "Подсказка в поле: Проверка", "Акцент: #23f03c"],
    node: <Input014 label="Смена" placeholder="Проверка" accent="#23f03c" />,
  },
  {
    name: "input-015",
    title: "Разряды на лету",
    notes: [
      "Подпись: Проверка",
      "Валюта: Ня",
      "Лимит: 4843644",
      "Акцент: #61e053",
    ],
    node: (
      <Input015 label="Проверка" suffix="Ня" max={4843644} accent="#61e053" />
    ),
  },
  {
    name: "input-016",
    title: "Генератор пароля",
    notes: [
      "Подпись: Черновик",
      "Подсказка в поле: Что дальше",
      "Длина генерации: 22",
      "Акцент: #1cabab",
    ],
    node: (
      <Input016
        label="Черновик"
        placeholder="Что дальше"
        length={22}
        accent="#1cabab"
      />
    ),
  },
  {
    name: "input-017",
    title: "Поиск с сервера",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Подпись: тест",
      "Акцент: #bf338a",
    ],
    node: (
      <Input017
        label="Подпись: тест"
        placeholder="Подпись: тест"
        accent="#bf338a"
      />
    ),
  },
  {
    name: "input-018",
    title: "Поле IBAN",
    notes: ["Подпись: Черновик", "Номер: Подпись: тест", "Акцент: #2ef754"],
    node: (
      <Input018
        label="Черновик"
        defaultValue="Подпись: тест"
        accent="#2ef754"
      />
    ),
  },
  {
    name: "input-019",
    title: "Поле с мягким лимитом",
    notes: [
      "Подпись: Смена",
      "Плейсхолдер: Что дальше",
      "Начальное значение: Что дальше",
      "Мягкий лимит: 177",
      "Жёсткий лимит: 189",
      "Акцент: #8ef3bd",
    ],
    node: (
      <Input019
        label="Смена"
        placeholder="Что дальше"
        defaultValue="Что дальше"
        softLimit={177}
        hardLimit={189}
        accent="#8ef3bd"
      />
    ),
  },
  {
    name: "input-020",
    title: "Проверка адреса пространства",
    notes: [
      "Подпись: Что дальше",
      "Приставка: Что дальше",
      "Значение: Что дальше",
      "Акцент: #a151c8",
    ],
    node: (
      <Input020
        label="Что дальше"
        prefix="Что дальше"
        defaultValue="Что дальше"
        accent="#a151c8"
      />
    ),
  },
  {
    name: "input-021",
    title: "Маска ключа купона",
    notes: [
      "Подпись: Подпись: тест",
      "Подсказка в поле: Смена",
      "Акцент: #951a1d",
    ],
    node: (
      <Input021 label="Подпись: тест" placeholder="Смена" accent="#951a1d" />
    ),
  },
  {
    name: "input-022",
    title: "Переключатель единиц веса",
    notes: [
      "Подпись: 42",
      "Единица А: Ок",
      "Единица Б: Черновик",
      "Значение: 0",
      "Акцент: #00475d",
    ],
    node: (
      <Input022
        label="42"
        unitA="Ок"
        unitB="Черновик"
        defaultValue={0}
        accent="#00475d"
      />
    ),
  },
  {
    name: "input-023",
    title: "История отправленных значений",
    notes: ["Подпись: Черновик", "Плейсхолдер: Черновик", "Акцент: #c05e6b"],
    node: <Input023 label="Черновик" placeholder="Черновик" accent="#c05e6b" />,
  },
  {
    name: "input-024",
    title: "Дополнение домена по Tab",
    notes: ["Подпись: Проверка", "Значение: Проверка", "Акцент: #6fd40e"],
    node: (
      <Input024 label="Проверка" defaultValue="Проверка" accent="#6fd40e" />
    ),
  },
  {
    name: "input-025",
    title: "Проверка ИНН",
    notes: ["Подпись: 42", "Значение: Смена", "Акцент: #4ce103"],
    node: <Input025 label="42" defaultValue="Смена" accent="#4ce103" />,
  },
  {
    name: "input-026",
    title: "Время по четверти часа",
    notes: ["Подпись: Проверка", "Значение: Подпись: тест", "Акцент: #5c6335"],
    node: (
      <Input026
        label="Проверка"
        defaultValue="Подпись: тест"
        accent="#5c6335"
      />
    ),
  },
  {
    name: "input-027",
    title: "Поле цвета в hex",
    notes: ["Подпись: Черновик", "Значение: Что дальше", "Акцент: #e64d46"],
    node: (
      <Input027 label="Черновик" defaultValue="Что дальше" accent="#e64d46" />
    ),
  },
  {
    name: "input-028",
    title: "Причина блокировки поля",
    notes: [
      "Подпись: Черновик",
      "Значение: Черновик",
      "Причина блокировки: Проверка",
      "Акцент: #94d879",
    ],
    node: (
      <Input028
        label="Черновик"
        defaultValue="Черновик"
        reason="Проверка"
        accent="#94d879"
      />
    ),
  },
  {
    name: "input-029",
    title: "Голосовой ввод",
    notes: ["Подпись: Что дальше", "Плейсхолдер: Смена", "Акцент: #858a18"],
    node: <Input029 label="Что дальше" placeholder="Смена" accent="#858a18" />,
  },
  {
    name: "input-030",
    title: "Подсказка адреса снизу",
    notes: [
      "Подпись: Подпись: тест",
      "Плейсхолдер: Что дальше",
      "Акцент: #13998b",
    ],
    node: (
      <Input030
        label="Подпись: тест"
        placeholder="Что дальше"
        accent="#13998b"
      />
    ),
  },
  {
    name: "input-031",
    title: "Ошибка обязательного поля",
    notes: [
      "Подпись: Что дальше",
      "Плейсхолдер: Что дальше",
      "Текст ошибки: Смена",
      "Акцент: #d091f7",
    ],
    node: (
      <Input031
        label="Что дальше"
        placeholder="Что дальше"
        errorText="Смена"
        accent="#d091f7"
      />
    ),
  },
]
