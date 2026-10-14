import postgres, { type Sql } from "postgres";

export type Database = Sql<Record<string, postgres.PostgresType>>;

export function connectDatabase(url: string): Database {
  // "Today" in limits, budgets and the dashboard is the owner's Moscow day, not the server's UTC day.
  return postgres(url, { max: 5, idle_timeout: 20, connect_timeout: 10, connection: { TimeZone: "Europe/Moscow" } });
}
