// Aplica supabase/schema.sql no banco do projeto.
// Uso:  DATABASE_URL="postgresql://postgres:SENHA@db.<ref>.supabase.co:5432/postgres" node scripts/apply-schema.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Defina DATABASE_URL (connection string do Supabase).");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, "..", "supabase", "schema.sql"), "utf8");

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("Conectado. Aplicando schema…");
  await client.query(sql);
  console.log("Schema aplicado com sucesso ✔");
} catch (e) {
  console.error("Erro ao aplicar schema:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
