// Unofficial free Google endpoint: no key, no model tokens. It may break; callers must survive a failure.
export async function translate(text: string, target: string): Promise<{ text: string; source: string }> {
  let source = "";
  const parts: string[] = [];
  for (const chunk of splitText(text, 4500)) {
    const response = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dt=t&tl=" + encodeURIComponent(target), {
      method: "POST", signal: AbortSignal.timeout(15_000),
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ q: chunk }),
    });
    if (!response.ok) throw new Error(`Translate ${response.status}`);
    const data = await response.json() as [Array<[string]> | null, unknown, string];
    source ||= data[2];
    parts.push((data[0] ?? []).map((segment) => segment[0]).join(""));
  }
  return { text: parts.join("\n"), source };
}

export function splitText(text: string, limit: number): string[] {
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > limit) {
    const window = rest.slice(0, limit);
    const cut = Math.max(window.lastIndexOf("\n"), window.lastIndexOf(" "));
    const end = cut > limit / 2 ? cut : limit;
    chunks.push(rest.slice(0, end));
    rest = rest.slice(end).replace(/^[\n ]/, "");
  }
  if (rest) chunks.push(rest);
  return chunks;
}
