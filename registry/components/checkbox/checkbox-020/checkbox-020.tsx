"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, UIEvent } from "react"

export type Checkbox020Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange" | "title"
> & {
  title?: string
  paragraphs?: string[]
  label?: string
  /** Доступное имя прокручиваемой рамки. {title} — заголовок документа. */
  regionLabel?: string
  /** Подсказка под галочкой после дочитывания. */
  readHint?: string
  /** Подсказка под галочкой, пока текст не дочитан. */
  unreadHint?: string
  onChange?: (accepted: boolean) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный юридический текст в прокручиваемой рамке, а
// галочка согласия включается только после прокрутки до конца. Пока текст
// не дочитан, чекбокс выключен и рядом написано почему; внизу рамки лежит
// градиентная тень-подсказка, что текст продолжается.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-020"]){
--vibeui-checkbox-020-bg:transparent;
--vibeui-checkbox-020-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-checkbox-020-muted:color-mix(in oklab,var(--vibeui-checkbox-020-fg) 68%,transparent);
--vibeui-checkbox-020-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-checkbox-020-paper:light-dark(oklch(0.985 0.003 90),oklch(0.25 0.006 90));
--vibeui-checkbox-020-off:light-dark(oklch(0.95 0 265),oklch(0.31 0 265));
--vibeui-checkbox-020-accent:light-dark(oklch(0.263 0 0),oklch(0.886 0 0));
--vibeui-checkbox-020-on-accent:oklch(from var(--vibeui-checkbox-020-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-checkbox-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-checkbox-020-serif:ui-serif,Georgia,"Times New Roman",serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-020"]{color-scheme:dark}
[data-vibeui-block="checkbox-020"]{
display:block;width:100%;max-width:24rem;box-sizing:border-box;
padding:0.9375rem;border:1px solid var(--vibeui-checkbox-020-border);border-radius:0.9375rem;
background:var(--vibeui-checkbox-020-bg);
font-family:var(--vibeui-checkbox-020-font);color:var(--vibeui-checkbox-020-fg);
}
[data-vibeui-block="checkbox-020"] [data-part="title"]{
margin:0 0 0.5rem;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="checkbox-020"] [data-part="paper"]{position:relative}
/* Прокручиваемая рамка с tabindex: текст должен листаться и с клавиатуры,
   иначе согласие недостижимо без мыши. */
[data-vibeui-block="checkbox-020"] [data-part="scroll"]{
max-height:9rem;overflow-y:auto;overscroll-behavior:contain;
padding:0.75rem;border:1px solid var(--vibeui-checkbox-020-border);border-radius:0.625rem;
background:var(--vibeui-checkbox-020-paper);
font-family:var(--vibeui-checkbox-020-serif);font-size:0.8125rem;line-height:1.55;
}
[data-vibeui-block="checkbox-020"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-checkbox-020-accent);outline-offset:2px}
[data-vibeui-block="checkbox-020"] [data-part="scroll"] p{margin:0 0 0.625rem}
[data-vibeui-block="checkbox-020"] [data-part="scroll"] p:last-child{margin-bottom:0}
/* Тень у нижнего края говорит, что текст продолжается; после дочитывания
   она убирается, и это вторая, невербальная отметка о конце. */
[data-vibeui-block="checkbox-020"] [data-part="fade"]{
position:absolute;left:1px;right:1px;bottom:1px;height:2rem;pointer-events:none;
border-radius:0 0 0.625rem 0.625rem;
background:linear-gradient(to bottom,transparent,var(--vibeui-checkbox-020-paper));
transition:opacity .2s ease;
}
[data-vibeui-block="checkbox-020"][data-read="true"] [data-part="fade"]{opacity:0}
[data-vibeui-block="checkbox-020"] label{
display:grid;grid-template-columns:auto 1fr;gap:0.625rem;align-items:start;
margin-top:0.75rem;font-size:0.8125rem;line-height:1.45;cursor:pointer;
}
[data-vibeui-block="checkbox-020"] label:has(input:disabled){cursor:not-allowed;color:var(--vibeui-checkbox-020-muted)}
[data-vibeui-block="checkbox-020"] input{
appearance:none;position:relative;flex:none;cursor:inherit;margin:0.0625rem 0 0;
width:1.125rem;height:1.125rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-020-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-020-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-020"] input:disabled{background:var(--vibeui-checkbox-020-off)}
[data-vibeui-block="checkbox-020"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-020-accent);color:oklch(from var(--vibeui-checkbox-020-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="checkbox-020"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-020-on-accent);border-bottom:2px solid var(--vibeui-checkbox-020-on-accent);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-020"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-020-accent);outline-offset:2px}
[data-vibeui-block="checkbox-020"] [data-part="why"]{
margin:0.375rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-checkbox-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARAGRAPHS = [
  "1. Настоящее соглашение регулирует использование сервиса и заключается между вами и оператором сервиса в момент создания учётной записи.",
  "2. Оператор обрабатывает переданные вами данные исключительно для оказания услуги и хранит их на серверах в течение срока действия договора.",
  "3. Вы отвечаете за сохранность пароля и за все действия, совершённые под вашей учётной записью, включая действия приглашённых вами участников.",
  "4. Оператор вправе изменить условия, уведомив вас за тридцать дней. Продолжение использования сервиса после этого срока означает согласие с новой редакцией.",
  "5. Соглашение может быть расторгнуто вами в любой момент из настроек учётной записи; данные удаляются в течение девяноста дней.",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Согласие с длинным документом: галочка включается только после прокрутки
 * текста до конца. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox020({
  title = "Пользовательское соглашение",
  paragraphs = DEFAULT_PARAGRAPHS,
  label = "Я прочитал соглашение и согласен с его условиями",
  regionLabel = "Текст: {title}",
  readHint = "Текст прочитан — галочку можно поставить.",
  unreadHint = "Долистайте текст до конца, чтобы поставить галочку.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox020Props) {
  const [read, setRead] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const track = (event: UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget

    if (node.scrollTop + node.clientHeight >= node.scrollHeight - 8) {
      setRead(true)
    }
  }

  return (
    <>
      <style href="vibeui-checkbox-020" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-020"
        data-read={read}
        className={className}
        style={palette}
        aria-label={title}
      >
        <h3 data-part="title">{title}</h3>
        <div data-part="paper">
          <div
            ref={scrollRef}
            data-part="scroll"
            tabIndex={0}
            role="region"
            aria-label={regionLabel.replace("{title}", title)}
            onScroll={track}
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <span data-part="fade" aria-hidden="true" />
        </div>
        <label>
          <input
            type="checkbox"
            checked={accepted}
            disabled={!read}
            onChange={(event) => {
              setAccepted(event.target.checked)
              onChange?.(event.target.checked)
            }}
          />
          <span>{label}</span>
        </label>
        <p data-part="why" role="status">
          {read ? readHint : unreadHint}
        </p>
      </section>
    </>
  )
}
