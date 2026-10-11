import assert from "node:assert/strict";
import test from "node:test";
import { letterText } from "../src/telegram.js";
import { splitText } from "../src/translate.js";

test("splits long text on whitespace within the limit", () => {
  const parts = splitText("word ".repeat(2000).trim(), 4000);
  assert.ok(parts.length === 3);
  assert.ok(parts.every((part) => part.length <= 4000));
  assert.equal(parts.join(" "), "word ".repeat(2000).trim());
});

test("letter shows original and translation only when given", () => {
  const withTranslation = letterText("🔴 Нужен вы", "Re: hi", "Hello", "Привет");
  assert.match(withTranslation, /— Оригинал —\nHello\n\n— Перевод —\nПривет/);
  assert.doesNotMatch(letterText("t", null, "Привет", null), /Перевод/);
});
