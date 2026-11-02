// Gera app/data/real-pets.json a partir de apps/ml/datasets/raw/real_pets.csv.
// Uso (em apps/frontend): npm run generate:pets
// Colunas pessoais (e-mail, responsável, foto, nº do microchip) não são exportadas.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../ml/datasets/raw/real_pets.csv");
const target = resolve(here, "../app/data/real-pets.json");

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
const col = (name) => header.findIndex((h) => strip(h).startsWith(strip(name)));
const idx = {
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

const pets = rows
  .map((r, index) => ({
    id: `real-${index + 1}`,
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
  .filter((pet) => pet.size && pet.birthDate);

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(pets, null, 2)}\n`, "utf8");
console.log(`${pets.length} cães -> ${target}`);
