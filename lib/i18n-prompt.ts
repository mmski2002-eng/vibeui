import type { Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"

/**
 * Каркас инструкций для агента. Содержательная часть приходит из metadata
 * item'а, здесь — только обвязка, одинаковая для всех items.
 *
 * Обе версии написаны отдельно. Промпт читает не человек, а модель, и
 * калька с русского на английский даёт формулировки, которым агент следует
 * хуже, чем идиоматичным.
 */
type PromptCopy = {
  brief: {
    noun: Record<ItemKind, string>
    rules: string
    install: (noun: string) => string
    installHeading: string
    noCommand: string
    registryItem: string
    curl: string
    file: string
    export: string
    npmDeps: string
    npmNone: string
    usage: string
    configured: string
    preserve: string
    placement: Record<ItemKind, string>
    readFile: string
    page: string
  }
  full: {
    heading: (name: string, title: string) => string
    installHeading: string
    runExact: string
    unavailable: string
    registryItem: string
    installsTo: (target: string) => string
    npmDeps: string
    npmNone: string
    registryDeps: string
    registryNone: string
    doNotRecreate: string[]
    whatHeading: string
    howHeading: string
    readForProps: string
    blockHow: string[]
    componentHow: string[]
    whereHeading: string
    where: Record<ItemKind, string[]>
    placementSlot: string[]
    keepHeading: string
    changeHeading: string
    rulesHeading: string
    verifyHeading: string
    verify: string[]
  }
}

const RU: PromptCopy = {
  brief: {
    noun: {
      block: "блок",
      component: "компонент",
      animation: "компонент",
      template: "шаблон",
    },
    rules: "Правила:",
    install: (noun) =>
      `Установи ${noun} командой ниже. Не пиши код сам и не пересоздавай его по описанию.`,
    installHeading: "Установка:",
    noCommand: "Команда установки не сконфигурирована.",
    registryItem: "Registry item:",
    curl: "Если shadcn CLI в проекте нет — скачай файл, не переписывай его руками:",
    file: "Файл:",
    export: "Экспорт:",
    npmDeps: "npm-зависимости:",
    npmNone: "npm-зависимости: нет",
    usage: "Использование:",
    configured:
      "Пропсы в сниппете выбрал пользователь — вставляй компонент именно с ними.",
    preserve: "Сохрани как установлено:",
    placement: {
      component:
        "Это inline-компонент: поставь его туда, куда просил пользователь, внутрь существующей разметки.",
      animation:
        "Это inline-компонент: поставь его туда, куда просил пользователь, внутрь существующей разметки.",
      block:
        "Это полноширинная секция: поставь её прямым потомком разметки страницы, не внутрь карточки или сайдбара.",
      template:
        "Это целая страница: используй её как корень содержимого, не вкладывай в чужой layout.",
    },
    readFile: "Полный список пропсов и правил — в установленном файле.",
    page: "Страница компонента:",
  },
  full: {
    heading: (name, title) =>
      `# Установка и размещение «${name}» (${title}) из VibeUI`,
    installHeading: "## 1. Сначала установка — не пропускай, не пересоздавай",
    runExact: "Выполни эту команду до того, как писать код:",
    unavailable:
      "Команда установки недоступна: URL реестра VibeUI не сконфигурирован.",
    registryItem: "Registry item:",
    installsTo: (target) =>
      `Ставится в: ${target} (точный путь следует алиасам components.json этого проекта).`,
    npmDeps: "npm-зависимости:",
    npmNone: "npm-зависимости: нет.",
    registryDeps: "Registry-зависимости:",
    registryNone: "Registry-зависимости: нет.",
    doNotRecreate: [
      "Ставь из реестра. Не пересоздавай по описанию, не подменяй похожим",
      "компонентом из другой библиотеки и не переписывай под стиль проекта.",
    ],
    whatHeading: "## 2. Что это",
    howHeading: "## 3. Как использовать",
    readForProps: "Полный список пропсов — в установленном файле.",
    blockHow: [
      "Это целая секция страницы. Вставляй её одним куском — не вынимай из",
      "неё фрагменты и не собирай заново из мелких компонентов.",
      "Имя экспорта и пропсы смотри в установленном файле.",
    ],
    componentHow: [
      "Имя экспорта, пропсы и способ вставки смотри в установленном файле.",
      "Не угадывай API.",
    ],
    whereHeading: "## 4. Куда поставить",
    where: {
      component: [
        "Это мелкий inline-компонент. Поставь его ровно туда, куда просил",
        "пользователь, внутрь существующей разметки. Не создавай ради него",
        "новую страницу, секцию или обёртку. Если на этом месте уже стоит похожий",
        "контрол — замени его, а не добавляй второй.",
      ],
      animation: [
        "Это мелкий inline-компонент. Поставь его ровно туда, куда просил",
        "пользователь, внутрь существующей разметки. Не создавай ради него",
        "новую страницу, секцию или обёртку. Если на этом месте уже стоит похожий",
        "контрол — замени его, а не добавляй второй.",
      ],
      block: [
        "Это полноширинная секция страницы. Поставь её прямым потомком",
        "разметки страницы, в том порядке, который назвал пользователь. Не",
        "вкладывай внутрь карточки, сайдбара, модального окна или другого",
        "узкого контейнера: секция меряет собственную ширину и разложится",
        "неправильно.",
      ],
      template: [
        "Это целая страница. Используй её как корень содержимого той страницы,",
        "которую назвал пользователь. Не вкладывай в layout другой страницы.",
      ],
    },
    placementSlot: [
      "Куда поставить: ___",
      "(Эту строку заполняет пользователь. Если она осталась пустой — спроси,",
      "а не угадывай.)",
    ],
    keepHeading: "## 5. Сохранить как установлено",
    changeHeading: "## 6. Можно менять",
    rulesHeading: "## 7. Правила",
    verifyHeading: "## 8. Проверка",
    verify: [
      "- рендерится без ошибок в консоли;",
      "- выглядит так же, как превью на странице VibeUI, откуда взята ссылка;",
      "- если нет — ты изменил что-то из раздела 5, верни как было.",
    ],
  },
}

const EN: PromptCopy = {
  brief: {
    noun: {
      block: "section",
      component: "component",
      animation: "component",
      template: "page",
    },
    rules: "Rules:",
    install: (noun) =>
      `Install this ${noun} with the command below. Do not write the code yourself and do not recreate it from the description.`,
    installHeading: "Install:",
    noCommand: "The install command is not configured.",
    registryItem: "Registry item:",
    curl: "No shadcn CLI in this project? Download the file — do not retype it:",
    file: "File:",
    export: "Export:",
    npmDeps: "npm dependencies:",
    npmNone: "npm dependencies: none",
    usage: "Usage:",
    configured:
      "The props in the snippet were chosen by the user — render the component with exactly those.",
    preserve: "Keep as installed:",
    placement: {
      component:
        "This is an inline component: put it where the user asked, inside the existing markup.",
      animation:
        "This is an inline component: put it where the user asked, inside the existing markup.",
      block:
        "This is a full-width section: place it as a direct child of the page layout, never inside a card or sidebar.",
      template:
        "This is a whole page: use it as the content root, do not nest it in another layout.",
    },
    readFile: "The full prop list and rules are in the installed file.",
    page: "Component page:",
  },
  full: {
    heading: (name, title) =>
      `# Install and place "${name}" (${title}) from VibeUI`,
    installHeading: "## 1. Install first — do not skip, do not recreate",
    runExact: "Run this exact command before writing any code:",
    unavailable:
      "Install command is unavailable: the VibeUI registry URL is not configured.",
    registryItem: "Registry item:",
    installsTo: (target) =>
      `Installs to: ${target} (the exact path follows this project's components.json aliases).`,
    npmDeps: "npm dependencies:",
    npmNone: "npm dependencies: none.",
    registryDeps: "Registry dependencies:",
    registryNone: "Registry dependencies: none.",
    doNotRecreate: [
      "Install it from the registry. Do not recreate it from the description,",
      "do not substitute a similar component from another library, and do not",
      "rewrite it to match the project's existing style.",
    ],
    whatHeading: "## 2. What it is",
    howHeading: "## 3. How to use it",
    readForProps: "Read the installed file for the full prop list.",
    blockHow: [
      "This is a whole page section. Render it as one piece — do not copy",
      "fragments out of it and do not rebuild it from smaller components.",
      "Read the installed file for the export name and its props.",
    ],
    componentHow: [
      "Read the installed file for the export name, its props and how to",
      "render it. Do not guess the API.",
    ],
    whereHeading: "## 4. Where to place it",
    where: {
      component: [
        "This is a small inline component. Put it exactly where the user asked,",
        "inside the existing markup. Do not create a new page, section or",
        "wrapper for it. If a similar control already sits in that spot,",
        "replace it instead of adding a second one.",
      ],
      animation: [
        "This is a small inline component. Put it exactly where the user asked,",
        "inside the existing markup. Do not create a new page, section or",
        "wrapper for it. If a similar control already sits in that spot,",
        "replace it instead of adding a second one.",
      ],
      block: [
        "This is a full-width page section. Place it as a direct child of the",
        "page layout, in the section order the user asked for. Do not nest it",
        "inside a card, sidebar, modal or any narrow inline container: the",
        "section measures its own width and will lay out wrong there.",
      ],
      template: [
        "This is a whole page. Use it as the content root of the page the user",
        "named. Do not nest it inside another page's layout.",
      ],
    },
    placementSlot: [
      "Placement: ___",
      "(The user fills this line in. If it is still blank, ask where to put it",
      "instead of guessing.)",
    ],
    keepHeading: "## 5. Keep exactly as installed",
    changeHeading: "## 6. You may change",
    rulesHeading: "## 7. Rules",
    verifyHeading: "## 8. Verify",
    verify: [
      "- it renders with no console errors;",
      "- it looks like the preview on the VibeUI page you copied this from;",
      "- if it does not, you changed something listed in section 5 — put it back.",
    ],
  },
}

export const PROMPT_COPY: Record<Locale, PromptCopy> = { ru: RU, en: EN }
