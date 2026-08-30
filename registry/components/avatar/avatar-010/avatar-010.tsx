import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar010Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string
  reason?: "deleted" | "anonymous" | "invited"
  size?: "sm" | "md" | "lg"
}

// Идея компонента: место человека, которого нет. Удалённый аккаунт, аноним и
// приглашённый по ссылке отличаются не только цветом: у каждого свой знак и
// своя подпись для скринридера. Пунктирная граница у приглашённого говорит,
// что место занято, но ещё пусто — сплошной круг обещал бы живого человека.
const STYLES = `
:where([data-vibeui-block="avatar-010"]){
--vibeui-avatar-010-size:2.75rem;
--vibeui-avatar-010-bg:oklch(0.95 0.004 265);
--vibeui-avatar-010-fg:oklch(0.58 0.014 265);
--vibeui-avatar-010-border:oklch(0.86 0.008 265);
--vibeui-avatar-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-010"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;vertical-align:middle;
width:var(--vibeui-avatar-010-size);height:var(--vibeui-avatar-010-size);
border-radius:9999px;box-sizing:border-box;
border:1px solid var(--vibeui-avatar-010-border);
background:var(--vibeui-avatar-010-bg);color:var(--vibeui-avatar-010-fg);
font-family:var(--vibeui-avatar-010-font);
font-size:calc(var(--vibeui-avatar-010-size) * 0.36);font-weight:650;line-height:1;
user-select:none;
}
[data-vibeui-block="avatar-010"][data-size="sm"]{--vibeui-avatar-010-size:2.25rem}
[data-vibeui-block="avatar-010"][data-size="lg"]{--vibeui-avatar-010-size:3.5rem}
/* Пунктир у приглашённого: место занято, но человека там ещё нет. */
[data-vibeui-block="avatar-010"][data-reason="invited"]{border-style:dashed;background:transparent}
[data-vibeui-block="avatar-010"][data-reason="deleted"]{--vibeui-avatar-010-fg:oklch(0.64 0.012 265)}
/* Силуэт анонима: голова и плечи двумя фигурами, без иконочного пакета. */
[data-vibeui-block="avatar-010"] [data-part="bust"]{
position:relative;
width:calc(var(--vibeui-avatar-010-size) * 0.46);
height:calc(var(--vibeui-avatar-010-size) * 0.46);
overflow:hidden;
}
[data-vibeui-block="avatar-010"] [data-part="bust"]::before{
content:"";position:absolute;left:50%;top:4%;
width:38%;height:38%;margin-left:-19%;
border-radius:9999px;background:currentColor;
}
[data-vibeui-block="avatar-010"] [data-part="bust"]::after{
content:"";position:absolute;left:50%;bottom:0;
width:78%;height:46%;margin-left:-39%;
border-radius:9999px 9999px 0 0;background:currentColor;
}
[data-vibeui-block="avatar-010"] [data-part="text"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-010"] *{animation:none!important;transition:none!important}}
`

const REASON_TEXT = {
  deleted: "Удалённый аккаунт",
  anonymous: "Аноним",
  invited: "Приглашение отправлено",
}

/**
 * Место человека, которого нет: удалённый, аноним или приглашённый.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar010({
  label,
  reason = "deleted",
  size = "md",
  className,
  style,
  ...props
}: Avatar010Props) {
  const text = label ?? REASON_TEXT[reason]

  return (
    <>
      <style href="vibeui-avatar-010" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-010"
        data-size={size}
        data-reason={reason}
        className={className}
        style={style as CSSProperties}
        role="img"
        aria-label={text}
      >
        {reason === "anonymous" ? (
          <span data-part="bust" aria-hidden="true" />
        ) : (
          <span aria-hidden="true">{reason === "invited" ? "+" : "?"}</span>
        )}
      </span>
    </>
  )
}
