const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
};

// A person's name ("Владилен Минин") gives the surname, which the creator recognises at a glance;
// a one-word channel name defers to the platform handle.
export function referralWord(handles: string[], displayName: string): string {
  const handle = handles.map(slug).find((value) => value.length >= 3);
  const parts = displayName.trim().split(/\s+/);
  const surname = parts.length === 2 ? slug(parts[1] ?? "") : "";
  const base = (surname.length >= 3 ? surname : undefined) ?? handle ?? (slug(displayName) || "creator");
  return `for_${base}`.slice(0, 24).replace(/[-_]+$/, "");
}

function slug(value: string): string {
  return [...value.toLowerCase().replace(/^@/, "")].map((char) => CYRILLIC[char] ?? char).join("")
    .replace(/[^a-z0-9_-]+/g, "_").replace(/_+/g, "_").replace(/^[-_]+|[-_]+$/g, "");
}
