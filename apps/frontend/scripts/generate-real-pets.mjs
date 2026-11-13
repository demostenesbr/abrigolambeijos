// Gera app/data/real-pets.json a partir de apps/ml/datasets/raw/real_pets.csv.
// Uso (em apps/frontend): npm run generate:pets
// Colunas pessoais (e-mail, responsável, nº do microchip) não são exportadas; da foto só o nome do WEBP em hash.
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../ml/datasets/raw/real_pets.csv");
const processedSource = resolve(here, "../../ml/datasets/processed/pets_processed.csv");
const target = resolve(here, "../app/data/real-pets.json");
// Fotos já convertidas para WEBP (apps/ml/src/data/convert_pet_photos.py), servidas em /pets/<hash>.webp.
const photoMap = resolve(here, "../../ml/datasets/processed/photo_map.json");
const photosDir = resolve(here, "../../admin/src/assets/pets/WEBP");
const publicPhotosDir = resolve(here, "../public/pets");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }
  return rows;
}

// Datas do formulário vêm como M/D/AAAA.
function toIsoDate(value) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(value.trim());
  if (!match) return null;
  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const strip = (value) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const sizeOf = (value) => {
  const key = strip(value);
  if (key.startsWith("pequeno")) return "pequeno";
  if (key.startsWith("medio")) return "medio";
  if (key.startsWith("grande")) return "grande";
  return null;
};

const [header, ...rows] = parseCsv(readFileSync(source, "utf8").replace(/^\uFEFF/, ""));
const [processedHeader, ...processedRows] = parseCsv(
  readFileSync(processedSource, "utf8").replace(/^\uFEFF/, ""),
);
const processedIdIndex = processedHeader.indexOf("id");
const sourceKeyIndex = processedHeader.indexOf("source_key");
if (processedIdIndex < 0 || sourceKeyIndex < 0) {
  throw new Error("pets_processed.csv precisa conter id e source_key.");
}
const sourceKeysById = new Map(
  processedRows.map((row) => [row[processedIdIndex], row[sourceKeyIndex]]),
);
const col = (name) => header.findIndex((h) => strip(h).startsWith(strip(name)));
const idx = {
  photo: col("Foto do Pet"),
  entry: col("Data de Entrada"),
  breed: col("Raça"),
  gender: col("Sexo"),
  microchipped: col("Microchipado"),
  neutered: col("Castrado"),
  coat: col("Tipo de Pelagem"),
  color: col("Cor Predominante"),
  signs: col("Sinais e Particularidades"),
  birth: col("Data de Nascimento"),
  size: col("Porte"),
  behavior: col("Perfil Comportamental"),
  health: col("Condições Gerais"),
  origin: col("Procedência"),
};

const yes = (value) => strip(value ?? "") === "sim";
const clean = (value) => (value ?? "").trim();
const sentence = (value) => {
  const text = clean(value);
  return text ? text[0].toUpperCase() + text.slice(1) : "";
};
const health = (value) =>
  strip(value ?? "").startsWith("saudavel") ? "Saudável" : sentence(value);

const photos = existsSync(photoMap) ? JSON.parse(readFileSync(photoMap, "utf8")) : {};
const photoOf = (url) => {
  const file = photos[/id=([\w-]+)/.exec(url ?? "")?.[1]];
  if (!file || !existsSync(resolve(photosDir, file))) return null;
  mkdirSync(publicPhotosDir, { recursive: true });
  copyFileSync(resolve(photosDir, file), resolve(publicPhotosDir, file));
  return file;
};

const pets = rows
  .map((r, index) => ({
    id: `real-${index + 1}`,
    rganimal: `REAL-${sourceKeysById.get(String(index + 1)) ?? ""}`,
    photo: photoOf(r[idx.photo]),
    breed: clean(r[idx.breed]),
    gender: clean(r[idx.gender]),
    size: sizeOf(r[idx.size] ?? ""),
    birthDate: toIsoDate(r[idx.birth] ?? ""),
    entryDate: toIsoDate(r[idx.entry] ?? ""),
    color: sentence(r[idx.color]),
    coat: sentence(r[idx.coat]),
    signs: sentence(r[idx.signs]),
    behavior: sentence(r[idx.behavior]),
    health: health(r[idx.health]),
    origin: sentence(r[idx.origin]),
    neutered: yes(r[idx.neutered]),
    microchipped: yes(r[idx.microchipped]),
  }))
  .filter((pet) => pet.size && pet.birthDate && !pet.rganimal.endsWith("-"));

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(pets, null, 2)}\n`, "utf8");
console.log(`${pets.length} cães -> ${target}`);
