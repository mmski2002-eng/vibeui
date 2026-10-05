import postgres, { type Sql } from "postgres";

export type Database = Sql<Record<string, postgres.PostgresType>>;

export function connectDatabase(url: string): Database {
  return postgres(url, { max: 5, idle_timeout: 20, connect_timeout: 10 });
}
