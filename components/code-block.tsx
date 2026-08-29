export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-muted/40 max-h-[32rem] overflow-auto rounded-lg border p-4 text-xs leading-relaxed">
      <code className="font-mono">{code}</code>
    </pre>
  )
}
