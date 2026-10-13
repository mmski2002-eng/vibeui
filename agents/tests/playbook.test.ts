import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { splitPlaybook, unknownFacts } from "../src/playbook.js";
import { worse } from "../src/learning.js";

test("seed file splits into locked facts and experience", async () => {
  const { locked, experience } = splitPlaybook(await readFile("policy/playbook.md", "utf8"));
  assert.match(locked, /## Факты/);
  assert.match(locked, /## Нельзя/);
  assert.match(experience, /## Типовые ситуации/);
  assert.doesNotMatch(experience, /## Факты/);
  assert.deepEqual(unknownFacts(locked, experience), []);
});

test("learning may not bring in money or links the owner never wrote", () => {
  const locked = "Партнёр получает 25%. Цена $9. Ссылка https://vibeui.club/start";
  assert.deepEqual(unknownFacts(locked, "Напомнить про 25% и https://vibeui.club/start."), []);
  assert.deepEqual(unknownFacts(locked, "Предложить 40% и $100 сверху, см. https://evil.example").sort(), ["$100", "40%", "https://evil.example"].sort());
});

test("rollback needs enough letters and a clear drop", () => {
  const metrics = (sent: number, answered: number) => ({ sent, answered, responseRate: sent ? answered / sent : null, partners: 0, publications: 0, declined: 0 });
  assert.equal(worse(metrics(10, 5), metrics(10, 2)), true);
  assert.equal(worse(metrics(10, 5), metrics(10, 4)), false);
  assert.equal(worse(metrics(3, 3), metrics(10, 0)), false);
});
