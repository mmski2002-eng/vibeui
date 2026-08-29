export function CodeBlock({ code }: { code: string }) {
  return (
    // whitespace-pre-wrap вместо горизонтального скролла: строка кода шире
    // контейнера уезжала за правый край экрана на мобильном.
    <pre className="bg-shell-elevated border-shell-border text-shell-fg max-h-[32rem] overflow-y-auto rounded-lg border p-4 text-xs leading-relaxed whitespace-pre-wrap">
      <code className="font-mono break-words">{code}</code>
    </pre>
  )
}
