// ============================================================================
// Publica uma atualização OTA: sobe a versão, faz o build, empacota o dist/
// em bundle-<versao>.zip e gera o app-manifest.json.
//
// Uso:
//   node scripts/release-ota.mjs                      # sobe o último número (1.0.2 -> 1.0.3)
//   node scripts/release-ota.mjs 1.1.0                # versão específica
//   node scripts/release-ota.mjs --notas "o que mudou"
//
// Para enviar direto ao Supabase Storage (bucket "downloads"), defina a chave
// de serviço antes de rodar — ela nunca entra no código:
//   SUPABASE_SERVICE_KEY=eyJ... node scripts/release-ota.mjs
//
// Sem a chave, o script só gera os arquivos e mostra o que subir na mão.
// ============================================================================

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { deflateRawSync } from "node:zlib";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://hywupnarvaztectxxbud.supabase.co";
const BUCKET = "downloads";

/* ---- argumentos ---------------------------------------------------------- */
const args = process.argv.slice(2);
const iNotas = args.indexOf("--notas");
const notas = iNotas >= 0 ? args[iNotas + 1] || "" : "";
const versaoArg = args.find((a) => /^\d+\.\d+\.\d+$/.test(a));

/* ---- versão -------------------------------------------------------------- */
const pkgPath = join(raiz, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const versao = versaoArg || subirPatch(pkg.version);

function subirPatch(v) {
  const [a, b, c] = String(v).split(".").map((n) => parseInt(n, 10) || 0);
  return `${a}.${b}.${c + 1}`;
}

console.log(`\nPublicando versão ${versao} (anterior: ${pkg.version})\n`);

pkg.version = versao;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

/* ---- build --------------------------------------------------------------- */
console.log("1/4  Gerando o build…");
execSync("npm run build", { cwd: raiz, stdio: "inherit" });

/* ---- zip do dist/ -------------------------------------------------------- */
console.log("\n2/4  Empacotando o dist/…");
const zipNome = `bundle-${versao}.zip`;
const zipPath = join(raiz, zipNome);
const arquivos = listar(join(raiz, "dist")).map((abs) => ({
  nome: relative(join(raiz, "dist"), abs).split("\\").join("/"), // ZIP usa "/"
  dados: readFileSync(abs),
}));
writeFileSync(zipPath, criarZip(arquivos));
console.log(`     ${zipNome} — ${arquivos.length} arquivos, ${(statSync(zipPath).size / 1024).toFixed(0)} KB`);

/* ---- manifesto ----------------------------------------------------------- */
console.log("\n3/4  Gerando o app-manifest.json…");
const manifesto = {
  version: versao,
  url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${zipNome}`,
  notes: notas || `Versão ${versao}`,
};
writeFileSync(join(raiz, "app-manifest.json"), JSON.stringify(manifesto) + "\n");
console.log("     " + JSON.stringify(manifesto));

/* ---- upload (opcional) --------------------------------------------------- */
const chave = process.env.SUPABASE_SERVICE_KEY;
if (!chave) {
  console.log(`\n4/4  Upload não feito (sem SUPABASE_SERVICE_KEY).

     Suba estes dois arquivos no bucket "${BUCKET}" do Supabase Storage,
     nesta ordem (o manifesto por último, senão o app aponta para um zip
     que ainda não existe):

       1) ${zipNome}
       2) app-manifest.json   (substituindo o que já está lá)

     Assim que o manifesto subir, os apps mostram o botão "Atualizar agora".\n`);
  process.exit(0);
}

console.log("\n4/4  Enviando ao Supabase Storage…");
await subir(zipNome, readFileSync(zipPath), "application/zip");
// O manifesto vai por último: é ele que "liga" a atualização para todo mundo.
await subir("app-manifest.json", Buffer.from(JSON.stringify(manifesto) + "\n"), "application/json");
console.log(`\nPronto. Versão ${versao} publicada — os apps já vão mostrar o botão de atualizar.\n`);

async function subir(nome, corpo, tipo) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${nome}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chave}`,
      "Content-Type": tipo,
      "x-upsert": "true",
      "cache-control": "no-cache",
    },
    body: corpo,
  });
  if (!res.ok) {
    console.error(`     falhou: ${nome} — ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`     ok: ${nome}`);
}

/* ---- utilidades ---------------------------------------------------------- */
function listar(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? listar(p) : [p];
  });
}

/* ZIP mínimo (deflate), sem dependências e com "/" nos caminhos. */
function criarZip(entradas) {
  const tabelaCrc = (() => {
    const t = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  const crc32 = (buf) => {
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = tabelaCrc[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };

  const locais = [];
  const central = [];
  let offset = 0;

  for (const { nome, dados } of entradas) {
    const nomeBuf = Buffer.from(nome, "utf8");
    const comp = deflateRawSync(dados, { level: 9 });
    const crc = crc32(dados);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);       // versão necessária
    local.writeUInt16LE(0x0800, 6);   // nomes em UTF-8
    local.writeUInt16LE(8, 8);        // deflate
    local.writeUInt16LE(0, 10);       // hora
    local.writeUInt16LE(0x21, 12);    // data (1980-01-01, build reproduzível)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(dados.length, 22);
    local.writeUInt16LE(nomeBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locais.push(local, nomeBuf, comp);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt16LE(0, 12);
    dir.writeUInt16LE(0x21, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(comp.length, 20);
    dir.writeUInt32LE(dados.length, 24);
    dir.writeUInt16LE(nomeBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, nomeBuf);

    offset += local.length + nomeBuf.length + comp.length;
  }

  const corpoCentral = Buffer.concat(central);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(entradas.length, 8);
  fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(corpoCentral.length, 12);
  fim.writeUInt32LE(offset, 16);

  return Buffer.concat([...locais, corpoCentral, fim]);
}
