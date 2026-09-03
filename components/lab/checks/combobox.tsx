import type { LabCheck } from "@/components/lab/check-types"

import { Combobox001 } from "@/registry/components/combobox/combobox-001/combobox-001"
import { Combobox002 } from "@/registry/components/combobox/combobox-002/combobox-002"
import { Combobox003 } from "@/registry/components/combobox/combobox-003/combobox-003"
import { Combobox004 } from "@/registry/components/combobox/combobox-004/combobox-004"
import { Combobox005 } from "@/registry/components/combobox/combobox-005/combobox-005"
import { Combobox006 } from "@/registry/components/combobox/combobox-006/combobox-006"
import { Combobox007 } from "@/registry/components/combobox/combobox-007/combobox-007"
import { Combobox008 } from "@/registry/components/combobox/combobox-008/combobox-008"
import { Combobox009 } from "@/registry/components/combobox/combobox-009/combobox-009"
import { Combobox010 } from "@/registry/components/combobox/combobox-010/combobox-010"
import { Combobox011 } from "@/registry/components/combobox/combobox-011/combobox-011"
import { Combobox012 } from "@/registry/components/combobox/combobox-012/combobox-012"
import { Combobox013 } from "@/registry/components/combobox/combobox-013/combobox-013"
import { Combobox014 } from "@/registry/components/combobox/combobox-014/combobox-014"
import { Combobox015 } from "@/registry/components/combobox/combobox-015/combobox-015"
import { Combobox016 } from "@/registry/components/combobox/combobox-016/combobox-016"
import { Combobox017 } from "@/registry/components/combobox/combobox-017/combobox-017"
import { Combobox018 } from "@/registry/components/combobox/combobox-018/combobox-018"
import { Combobox019 } from "@/registry/components/combobox/combobox-019/combobox-019"
import { Combobox020 } from "@/registry/components/combobox/combobox-020/combobox-020"
import { Combobox021 } from "@/registry/components/combobox/combobox-021/combobox-021"
import { Combobox022 } from "@/registry/components/combobox/combobox-022/combobox-022"
import { Combobox023 } from "@/registry/components/combobox/combobox-023/combobox-023"
import { Combobox024 } from "@/registry/components/combobox/combobox-024/combobox-024"
import { Combobox025 } from "@/registry/components/combobox/combobox-025/combobox-025"
import { Combobox026 } from "@/registry/components/combobox/combobox-026/combobox-026"
import { Combobox027 } from "@/registry/components/combobox/combobox-027/combobox-027"
import { Combobox028 } from "@/registry/components/combobox/combobox-028/combobox-028"

/** Seed прогона: с ним набор воспроизводится один в один. */
export const SEED = 76351

export const CHECKS: LabCheck[] = [
  {
    name: "combobox-001",
    title: "Поле с фильтрацией",
    notes: [
      "Подпись: Что дальше",
      "Заглушка: Что дальше",
      "Панель открыта: false",
      "Акцент: #78cec8",
    ],
    node: (
      <Combobox001
        label="Что дальше"
        placeholder="Что дальше"
        defaultOpen={false}
        accent="#78cec8"
      />
    ),
  },
  {
    name: "combobox-002",
    title: "Сгруппированные разделы",
    notes: ["Подпись: Проверка", "Заглушка: Черновик", "Акцент: #05ddc0"],
    node: (
      <Combobox002 label="Проверка" placeholder="Черновик" accent="#05ddc0" />
    ),
  },
  {
    name: "combobox-003",
    title: "Множественный выбор чипами",
    notes: ["Предел выбора: 7", "Подпись: Что дальше", "Акцент: #f47b16"],
    node: <Combobox003 maxSelected={7} label="Что дальше" accent="#f47b16" />,
  },
  {
    name: "combobox-004",
    title: "Выбор людей",
    notes: [
      "Подпись: Черновик",
      "Выбран по умолчанию: Что дальше",
      "Акцент: #f9f357",
    ],
    node: (
      <Combobox004
        label="Черновик"
        defaultValue="Что дальше"
        accent="#f9f357"
      />
    ),
  },
  {
    name: "combobox-005",
    title: "Создание значения",
    notes: [
      "Подпись действия: Проверка",
      "Отметка нового: Подпись: тест",
      "Акцент: #8e4942",
    ],
    node: (
      <Combobox005
        createLabel="Проверка"
        newBadge="Подпись: тест"
        accent="#8e4942"
      />
    ),
  },
  {
    name: "combobox-006",
    title: "Недавние сверху",
    notes: ["Сколько недавних: 1", "Заголовок блока: Смена", "Акцент: #7eeba3"],
    node: <Combobox006 recentLimit={1} recentLabel="Смена" accent="#7eeba3" />,
  },
  {
    name: "combobox-007",
    title: "Оконный список",
    notes: ["Размер окна: 83", "Подсказка счётчика: Смена", "Акцент: #0403c4"],
    node: <Combobox007 visibleLimit={83} hintLabel="Смена" accent="#0403c4" />,
  },
  {
    name: "combobox-008",
    title: "Загрузка и пустота",
    notes: [
      "Пауза, мс: 2963",
      "Пустая выдача: Подпись: тест",
      "Акцент: #267ae9",
    ],
    node: (
      <Combobox008 delay={2963} emptyLabel="Подпись: тест" accent="#267ae9" />
    ),
  },
  {
    name: "combobox-009",
    title: "Строки со статусом",
    notes: [
      "Подпись: Что дальше",
      "Выбран по умолчанию: Черновик",
      "Акцент: #cdfff5",
    ],
    node: (
      <Combobox009
        label="Что дальше"
        defaultValue="Черновик"
        accent="#cdfff5"
      />
    ),
  },
  {
    name: "combobox-010",
    title: "Обязательный выбор",
    notes: [
      "Текст ошибки: Проверка",
      "Подпись кнопки: Подпись: тест",
      "Акцент: #362e44",
    ],
    node: (
      <Combobox010
        errorText="Проверка"
        submitLabel="Подпись: тест"
        accent="#362e44"
      />
    ),
  },
  {
    name: "combobox-011",
    title: "Очищаемое значение",
    notes: [
      "Подпись очистки: Черновик",
      "Подпись возврата: Смена",
      "Акцент: #dfc14e",
    ],
    node: (
      <Combobox011 clearLabel="Черновик" undoLabel="Смена" accent="#dfc14e" />
    ),
  },
  {
    name: "combobox-012",
    title: "Поле формы",
    notes: [
      "Имя поля: Смена",
      "Подпись кнопки: Подпись: тест",
      "Акцент: #c8c129",
    ],
    node: (
      <Combobox012 name="Смена" submitLabel="Подпись: тест" accent="#c8c129" />
    ),
  },
  {
    name: "combobox-013",
    title: "Сначала раздел, потом значение",
    notes: ["Подпись: Черновик", "Подсказка: Проверка", "Акцент: #b70e96"],
    node: (
      <Combobox013 label="Черновик" placeholder="Проверка" accent="#b70e96" />
    ),
  },
  {
    name: "combobox-014",
    title: "Варианты с миниатюрами",
    notes: [
      "Подпись: Черновик",
      "Выбранный вариант: Проверка",
      "Акцент: #52b4bd",
    ],
    node: (
      <Combobox014 label="Черновик" defaultValue="Проверка" accent="#52b4bd" />
    ),
  },
  {
    name: "combobox-015",
    title: "Совпадения по релевантности",
    notes: ["Запрос: Тест", "Подпись: Подпись: тест", "Акцент: #e77d1e"],
    node: (
      <Combobox015 defaultQuery="Тест" label="Подпись: тест" accent="#e77d1e" />
    ),
  },
  {
    name: "combobox-016",
    title: "Множественный выбор с лимитом",
    notes: ["Предел: 8", "Подпись: Что дальше", "Акцент: #a33b43"],
    node: <Combobox016 maxItems={8} label="Что дальше" accent="#a33b43" />,
  },
  {
    name: "combobox-017",
    title: "Закреплённое избранное",
    notes: [
      "Подпись: Черновик",
      "Выбранный счёт: Что дальше",
      "Акцент: #c8888e",
    ],
    node: (
      <Combobox017
        label="Черновик"
        defaultValue="Что дальше"
        accent="#c8888e"
      />
    ),
  },
  {
    name: "combobox-018",
    title: "Проверка на сервере",
    notes: [
      "Задержка ответа: 2557",
      "Подпись: Подпись: тест",
      "Акцент: #1a9ee3",
    ],
    node: <Combobox018 delay={2557} label="Подпись: тест" accent="#1a9ee3" />,
  },
  {
    name: "combobox-019",
    title: "Недоступные варианты",
    notes: ["Кнопка запроса: Смена", "Подпись: Черновик", "Акцент: #e1e901"],
    node: (
      <Combobox019 requestLabel="Смена" label="Черновик" accent="#e1e901" />
    ),
  },
  {
    name: "combobox-020",
    title: "Узкая колонка",
    notes: [
      "Символов в начале: 29",
      "Символов в хвосте: 25",
      "Акцент: #c4793d",
    ],
    node: <Combobox020 headChars={29} tailChars={25} accent="#c4793d" />,
  },
  {
    name: "combobox-021",
    title: "Создание первым пунктом",
    notes: [
      "Подпись действия: Черновик",
      "Отметка нового: Что дальше",
      "Акцент: #48bc38",
    ],
    node: (
      <Combobox021
        createLabel="Черновик"
        newBadge="Что дальше"
        accent="#48bc38"
      />
    ),
  },
  {
    name: "combobox-022",
    title: "Разделитель недавних",
    notes: ["Сколько недавних: 2", "Метка строки: Черновик", "Акцент: #987df4"],
    node: <Combobox022 recentLimit={2} recentTag="Черновик" accent="#987df4" />,
  },
  {
    name: "combobox-023",
    title: "Подсветка всех совпадений",
    notes: ["Запрос: Ок", "Подпись: Проверка", "Акцент: #7c9cd4"],
    node: <Combobox023 defaultQuery="Ок" label="Проверка" accent="#7c9cd4" />,
  },
  {
    name: "combobox-024",
    title: "Переполнение чипов",
    notes: ["Видимых фишек: 2", "Подпись: Проверка", "Акцент: #09c151"],
    node: <Combobox024 visibleChips={2} label="Проверка" accent="#09c151" />,
  },
  {
    name: "combobox-025",
    title: "Панель предпросмотра",
    notes: [
      "Подпись: Подпись: тест",
      "Выбран по умолчанию: Черновик",
      "Акцент: #13d51a",
    ],
    node: (
      <Combobox025
        label="Подпись: тест"
        defaultValue="Черновик"
        accent="#13d51a"
      />
    ),
  },
  {
    name: "combobox-026",
    title: "Поиск с задержкой",
    notes: [
      "Символов до поиска: 3",
      "Пауза набора, мс: 1933",
      "Акцент: #61f3fe",
    ],
    node: <Combobox026 minChars={3} delay={1933} accent="#61f3fe" />,
  },
  {
    name: "combobox-027",
    title: "Присутствие в команде",
    notes: ["Подпись: Смена", "Заглушка: Что дальше", "Акцент: #bf292a"],
    node: (
      <Combobox027 label="Смена" placeholder="Что дальше" accent="#bf292a" />
    ),
  },
  {
    name: "combobox-028",
    title: "Открытие горячей клавишей",
    notes: [
      "Подпись сочетания: Черновик",
      "Подпись поля: Смена",
      "Акцент: #d5ad5a",
    ],
    node: <Combobox028 hotkeyLabel="Черновик" label="Смена" accent="#d5ad5a" />,
  },
]
