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
import { resolve } from "node:path";
import { configureModelProvider } from "./model-provider.js";

const command = process.argv[2];
const config = loadConfig();
configureModelProvider(config);
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
} else if (command === "import") {
  const path = process.argv[3];
  if (!path) throw new Error("Usage: tsx src/cli.ts import <creators.json>");
  console.log(await importCreators(database, resolve(process.cwd(), path)));
  await database.end();
} else if (command === "maintain") {
  console.log(await maintain(database, { websites: !process.argv.includes("--no-websites"), rescore: process.argv.includes("--rescore") }));
  await database.end();
} else if (command === "prepare-drafts") {
  console.log({ draftsQueued: await prepareDrafts(database) });
  await database.end();
} else {
  await database.end();
  throw new Error("Usage: migrate | worker | admin | discover youtube ... | discover telegram|vk [max] [seed...] | import <file> | maintain [--rescore] [--no-websites] | prepare-drafts");
}
