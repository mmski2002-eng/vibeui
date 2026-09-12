import type { ComponentProps, CSSProperties } from "react"

export type Devices002Notification = {
  title: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  body: string
  meta: string
}

export type Devices002Props = Omit<ComponentProps<"section">, "children"> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  notifications?: Devices002Notification[]
  /** Лента уведомлений бесконечно скроллится вверх. false — лента статична. */
  autoScroll?: boolean
  /** Изометрический наклон рамки. */
  isometric?: boolean
}

// Идея: рамка смартфона с чёлкой, статус-баром и лентой уведомлений на
// экране. Карточки ленты бесконечно едут вверх (дублированный список,
// translateY по кругу, без JS) — это и есть анимация категории. Рамку можно
// наклонить в изометрию через проп isometric.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="devices-002"]){
--vibeui-devices-002-bg:light-dark(oklch(0.99 0.002 200),oklch(0.14 0.012 200));
--vibeui-devices-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-devices-002-muted:color-mix(in oklab,var(--vibeui-devices-002-fg) 58%,transparent);
--vibeui-devices-002-border:light-dark(oklch(0.9 0.006 200),oklch(0.3 0.012 200));
--vibeui-devices-002-shell:light-dark(oklch(0.83 0.006 200),oklch(0.42 0.012 200));
--vibeui-devices-002-card:light-dark(oklch(0.965 0.006 200),oklch(0.2 0.012 200));
--vibeui-devices-002-accent:light-dark(oklch(0.62 0.15 175),oklch(0.75 0.13 175));
--vibeui-devices-002-accent-fg:oklch(from var(--vibeui-devices-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-devices-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="devices-002"]{color-scheme:dark}
[data-vibeui-block="devices-002"]{
display:block;box-sizing:border-box;width:100%;max-width:14.5rem;margin:0;
color:var(--vibeui-devices-002-fg);font-family:var(--vibeui-devices-002-font);
}
[data-vibeui-block="devices-002"] *{box-sizing:border-box}
[data-vibeui-block="devices-002"] [data-part="stage"]{padding:1rem 0.5rem;perspective:1600px}
[data-vibeui-block="devices-002"] [data-part="frame"]{
position:relative;transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="devices-002"] [data-part="button"]{
position:absolute;border-radius:0.125rem 0 0 0.125rem;
background:var(--vibeui-devices-002-shell);
}
[data-vibeui-block="devices-002"] [data-part="button"][data-side="left"]{
left:-0.09375rem;top:2.75rem;width:0.1875rem;height:1.5rem;
}
[data-vibeui-block="devices-002"] [data-part="button"][data-side="right"]{
right:-0.09375rem;top:4.5rem;width:0.1875rem;height:2.25rem;
border-radius:0 0.125rem 0.125rem 0;
}
/* Корпус телефона: тёмная рамка вокруг светлого экрана. */
[data-vibeui-block="devices-002"] [data-part="phone"]{
position:relative;isolation:isolate;overflow:hidden;
border-radius:1.75rem;padding:0.5rem;
background:var(--vibeui-devices-002-shell);
box-shadow:0 1.5rem 2.5rem -1.5rem oklch(0 0 0 / 0.4);
}
[data-vibeui-block="devices-002"] [data-part="screen"]{
position:relative;overflow:hidden;border-radius:1.25rem;
aspect-ratio:9/18.5;
display:flex;flex-direction:column;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="devices-002"] [data-part="screen"][data-empty="true"]{background:var(--vibeui-devices-002-bg);}
[data-vibeui-block="devices-002"] [data-part="screen"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="devices-002"] [data-part="notch"]{
position:absolute;top:0.4375rem;left:50%;width:2.375rem;height:0.5625rem;
border-radius:9999px;background:oklch(0.08 0 0);transform:translateX(-50%);z-index:2;
}
[data-vibeui-block="devices-002"] [data-part="status"]{
display:flex;align-items:center;justify-content:space-between;
padding:0.625rem 0.75rem 0.375rem;flex:none;
}
[data-vibeui-block="devices-002"] [data-part="time"]{
font-size:0.5625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="devices-002"] [data-part="icons"]{
display:flex;align-items:flex-end;gap:0.125rem;
}
[data-vibeui-block="devices-002"] [data-part="signal"]{
width:0.125rem;border-radius:1px;background:var(--vibeui-devices-002-fg);
}
[data-vibeui-block="devices-002"] [data-part="signal"]:nth-child(1){height:0.1875rem}
[data-vibeui-block="devices-002"] [data-part="signal"]:nth-child(2){height:0.25rem}
[data-vibeui-block="devices-002"] [data-part="signal"]:nth-child(3){height:0.3125rem}
/* Окно ленты: маска гасит верх и низ, внутри едет продублированный список. */
[data-vibeui-block="devices-002"] [data-part="viewport"]{
position:relative;flex:1;overflow:hidden;padding:0.125rem 0.5rem 0.5rem;
-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 12%,#000 88%,transparent 100%);
mask-image:linear-gradient(to bottom,transparent 0,#000 12%,#000 88%,transparent 100%);
}
[data-vibeui-block="devices-002"] [data-part="feed"]{
display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0;list-style:none;
animation:vibeui-devices-002-scroll 14s linear infinite;
}
[data-vibeui-block="devices-002"][data-scroll="false"] [data-part="feed"]{animation:none}
[data-vibeui-block="devices-002"] [data-part="card"]{
display:flex;align-items:flex-start;gap:0.375rem;flex:none;
padding:0.4375rem;border-radius:0.625rem;
background:var(--vibeui-devices-002-card);
border:1px solid var(--vibeui-devices-002-border);
}
[data-vibeui-block="devices-002"] [data-part="avatar"]{
position:relative;flex:none;width:1.125rem;height:1.125rem;border-radius:9999px;color:var(--vibeui-devices-002-accent-fg);
display:flex;align-items:center;justify-content:center;
font-size:0.5rem;font-weight:700;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="devices-002"] [data-part="avatar"][data-empty="true"]{background:var(--vibeui-devices-002-accent);color:oklch(from var(--vibeui-devices-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="devices-002"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="devices-002"] [data-part="text"]{min-width:0;flex:1}
[data-vibeui-block="devices-002"] [data-part="title"]{
margin:0;font-size:0.5625rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="devices-002"] [data-part="body"]{
margin:0.0625rem 0 0;font-size:0.5rem;line-height:1.35;
color:var(--vibeui-devices-002-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="devices-002"] [data-part="meta"]{
flex:none;font-size:0.4375rem;font-weight:600;
color:var(--vibeui-devices-002-muted);
}
[data-vibeui-block="devices-002"] [data-part="home"]{
margin:0.375rem auto 0.1875rem;width:2.125rem;height:0.1875rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-devices-002-fg) 22%,transparent);
}
@keyframes vibeui-devices-002-scroll{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="devices-002"] [data-part="feed"]{animation:none}
}
`

const DEFAULT_NOTIFICATIONS: Devices002Notification[] = [
  { title: "Sara Ruiz", body: "Обедаем в час?", meta: "сейчас" },
  { title: "Команда", body: "Спринт-ревью перенесли", meta: "2 мин" },
  { title: "Календарь", body: "Созвон через 15 минут", meta: "5 мин" },
  { title: "Банк", body: "Платёж выполнен", meta: "12 мин" },
]

/**
 * Рамка смартфона с чёлкой и бесконечно едущей вверх лентой уведомлений.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Devices002({
  label = "Смартфон с лентой уведомлений на экране",
  image = "",
  accent,
  notifications = DEFAULT_NOTIFICATIONS,
  autoScroll = true,
  isometric = false,
  className,
  style,
  ...props
}: Devices002Props) {
  const palette = {
    ...(accent ? { "--vibeui-devices-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(34deg) rotateZ(-30deg) scale(0.92)" }
    : undefined

  const items = [...notifications, ...notifications]

  return (
    <>
      <style href="vibeui-devices-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="devices-002"
        data-slot="device-phone"
        data-scroll={autoScroll ? "true" : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <span data-part="button" data-side="left" aria-hidden="true" />
            <span data-part="button" data-side="right" aria-hidden="true" />
            <div data-part="phone">
              <div data-part="screen" data-empty={image ? undefined : "true"}>
                {image ? (
                  <img src={image} alt="" loading="lazy" decoding="async" />
                ) : null}
                <span data-part="notch" aria-hidden="true" />
                <div data-part="status">
                  <span data-part="time">9:41</span>
                  <div data-part="icons" aria-hidden="true">
                    <span data-part="signal" />
                    <span data-part="signal" />
                    <span data-part="signal" />
                  </div>
                </div>
                <div data-part="viewport">
                  <ul data-part="feed">
                    {items.map((item, index) => (
                      <li data-part="card" key={`${item.title}-${index}`}>
                        <span
                          data-part="avatar"
                          data-empty={item.image ? undefined : "true"}
                          aria-hidden="true"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                          ) : null}
                          {item.title.charAt(0)}
                        </span>
                        <div data-part="text">
                          <p data-part="title">{item.title}</p>
                          <p data-part="body">{item.body}</p>
                        </div>
                        <span data-part="meta">{item.meta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <span data-part="home" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
