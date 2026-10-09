import { loadConfig, requireDatabaseUrl } from "./config.js";
import { connectDatabase } from "./database.js";
import { migrate } from "./migrate.js";
import { runWorker } from "./worker.js";
import { startAdminServer } from "./admin-server.js";
import { discoverYouTube } from "./discovery/youtube.js";
import { discoverTelegram } from "./discovery/telegram.js";
import { discoverVk } from "./discovery/vk.js";
import { importCreators } from "./import-creators.js";
import { prepareDrafts } from "./prepare-drafts.js";
import { maintain } from "./maintenance.js";
import { discoverHabr } from "./discovery/habr.js";
import { discoverRutube } from "./discovery/rutube.js";
import { discoverDevto } from "./discovery/devto.js";
import { searchTelegramChannels } from "./discovery/telegram-search.js";
import { runScheduler } from "./scheduler.js";
import { resolve } from "node:path";
import { configureModelProvider } from "./model-provider.js";

const command = process.argv[2];
const config = loadConfig();
configureModelProvider(config);

// Login needs no database: it only prints the session string for TELEGRAM_SESSION.
if (command === "telegram-login") {
  const { createInterface } = await import("node:readline/promises");
  const { loginTelegram } = await import("./discovery/telegram-search.js");
  if (!config.telegramApiId || !config.telegramApiHash) throw new Error("Set TELEGRAM_API_ID and TELEGRAM_API_HASH first (my.telegram.org)");
  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  const session = await loginTelegram(config.telegramApiId, config.telegramApiHash, (question) => terminal.question(question));
  terminal.close();
  console.log(`
TELEGRAM_SESSION=${session}`);
  process.exit(0);
}

const database = connectDatabase(requireDatabaseUrl(config));

if (command === "migrate") {
  await migrate(database);
  await database.end();
} else if (command === "worker") {
  await runWorker(database, config);
  await database.end();
} else if (command === "admin") {
  startAdminServer(database, config);
} else if (command === "discover" && process.argv[3] === "youtube") {
  const market = process.argv[4];
  const query = process.argv[5];
  const maxResults = Number.parseInt(process.argv[6] ?? "25", 10);
  if ((market !== "ru" && market !== "en") || !query) {
    throw new Error('Usage: tsx src/cli.ts discover youtube <ru|en> "<query>" [maxResults]');
  }
  console.log(await discoverYouTube(database, config.youtubeApiKey, market, query, maxResults));
  await database.end();
} else if (command === "discover" && process.argv[3] === "telegram") {
  const maxChannels = Number.parseInt(process.argv[4] ?? "30", 10);
  const seeds = process.argv.slice(5);
  console.log(await discoverTelegram(database, seeds, { maxChannels, maxDepth: 2 }));
  await database.end();
} else if (command === "discover" && process.argv[3] === "vk") {
  const maxGroups = Number.parseInt(process.argv[4] ?? "30", 10);
  console.log(await discoverVk(database, config.vkServiceToken, process.argv.slice(5), { maxGroups, maxDepth: 2 }));
  await database.end();
} else if (command === "discover" && ["habr", "rutube", "devto", "telegram-search"].includes(process.argv[3] ?? "")) {
  const query = process.argv[4];
  if (!query) throw new Error('Usage: tsx src/cli.ts discover habr|rutube|devto|telegram-search "<hub|query|tag>"');
  const source = process.argv[3];
  if (source === "habr") console.log(await discoverHabr(database, query, { maxAuthors: 15 }));
  if (source === "rutube") console.log(await discoverRutube(database, query, { maxChannels: 15 }));
  if (source === "devto") console.log(await discoverDevto(database, query, { maxAuthors: 15 }));
  if (source === "telegram-search") console.log(await discoverTelegram(database, await searchTelegramChannels(config, query), { maxChannels: 30, maxDepth: 1 }));
  await database.end();
} else if (command === "schedule") {
  console.log(await runScheduler(database, config));
  await database.end();
} else if (command === "import") {
  const path = process.argv[3];
  if (!path) throw new Error("Usage: tsx src/cli.ts import <creators.json>");
  console.log(await importCreators(database, resolve(process.cwd(), path)));
  await database.end();
} else if (command === "maintain") {
  console.log(await maintain(database, { websites: !process.argv.includes("--no-websites"), rescore: process.argv.includes("--rescore") }));
  await database.end();
} else if (command === "send-test") {
  const [messageId, to] = process.argv.slice(3);
  if (!messageId || !to) throw new Error("Usage: tsx src/cli.ts send-test <messageId> <email>");
  const { sendGmail } = await import("./email/gmail.js");
  const { randomUUID } = await import("node:crypto");
  const [message] = await database<{ subject: string; body: string }[]>`SELECT subject, body FROM outreach_messages WHERE id = ${messageId}`;
  if (!message) throw new Error(`Message ${messageId} not found`);
  // A test copy never changes the draft: status, thread and statistics stay untouched.
  console.log(await sendGmail(config, { to, subject: `[ТЕСТ] ${message.subject}`, text: message.body, messageId: `<test-${randomUUID()}@vibeui.club>` }));
  await database.end();
} else if (command === "prepare-drafts") {
  console.log({ draftsQueued: await prepareDrafts(database) });
  await database.end();
} else {
  await database.end();
  throw new Error("Usage: migrate | worker | admin | discover youtube ... | discover telegram|vk [max] [seed...] | discover habr|rutube|devto|telegram-search <query> | schedule | telegram-login | import <file> | maintain [--rescore] [--no-websites] | prepare-drafts");
}
