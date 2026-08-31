"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, UIEvent } from "react"

export type Checkbox020Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange" | "title"
> & {
  title?: string
  paragraphs?: string[]
  label?: string
  onChange?: (accepted: boolean) => void
  accent?: string
}

// Идея компонента: длинный юридический текст в прокручиваемой рамке, а
// галочка согласия включается только после прокрутки до конца. Пока текст
// не дочитан, чекбокс выключен и рядом написано почему; внизу рамки лежит
// градиентная тень-подсказка, что текст продолжается.
const STYLES = `
:where([data-vibeui-block="checkbox-020"]){
--vibeui-checkbox-020-bg:oklch(1 0 0);
--vibeui-checkbox-020-fg:oklch(0.24 0.012 265);
--vibeui-checkbox-020-muted:oklch(0.55 0.014 265);
--vibeui-checkbox-020-border:oklch(0.9 0.006 265);
--vibeui-checkbox-020-paper:oklch(0.985 0.003 90);
--vibeui-checkbox-020-accent:oklch(0.45 0.11 260);
--vibeui-checkbox-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-checkbox-020-serif:ui-serif,Georgia,"Times New Roman",serif;
}
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
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-020-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-020-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-020"] input:disabled{background:oklch(0.95 0.004 265)}
[data-vibeui-block="checkbox-020"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-020-accent)}
[data-vibeui-block="checkbox-020"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 260);border-bottom:2px solid oklch(0.99 0.01 260);
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
 * Согласие с длинным документом: галочка включается только после прокрутки
 * текста до конца. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox020({
  title = "Пользовательское соглашение",
  paragraphs = DEFAULT_PARAGRAPHS,
  label = "Я прочитал соглашение и согласен с его условиями",
  onChange,
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
            aria-label={`Текст: ${title}`}
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
          {read
            ? "Текст прочитан — галочку можно поставить."
            : "Долистайте текст до конца, чтобы поставить галочку."}
        </p>
      </section>
    </>
  )
}
