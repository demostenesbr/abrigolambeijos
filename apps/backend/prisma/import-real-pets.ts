import 'dotenv/config';
import { readFileSync } from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Importa apps/ml/datasets/processed/pets_processed.csv (gerado por `python -m src.data.export_real_pets`)
const CSV_PATH =
  process.env.REAL_PETS_PROCESSED_CSV ??
  path.resolve(
    __dirname,
    '..',
    '..',
    'ml',
    'datasets',
    'processed',
    'pets_processed.csv',
  );

const connectionString = process.env.DATABASE_URL ?? '';
if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(header.map((name, index) => [name, values[index]])),
  );
}

async function main() {
  const rows = parseCsv(readFileSync(CSV_PATH, 'utf-8').replace(/^\uFEFF/, ''));

  for (const r of rows) {
    const rganimal = `REAL-${r.source_key}`;
    const data = {
      animalname: r.name,
      rganimal,
      dateentry: new Date(r.entry_date),
      name: r.name,
      race: r.breed,
      gender: r.gender,
      microchipped: r.microchipped === 'True',
      castrated: r.neutered === 'True',
      coattypecoloration: r.coat_type,
      predominantcoatcolor: r.coat_color,
      signsanddistinctive: 'Não informado',
      estimatedchronologicalage: Math.round(Number(r.age)),
      birthdate: new Date(r.birth_date),
      size: r.size,
      behavioralprofile: r.behavior_profile,
      healthcondition: r.health_condition,
      species: r.species,
      energyLevel: r.energy_level,
      temperament: r.temperament,
      sociability: r.sociability,
      exerciseNeed: r.exercise_need,
      apartmentAdaptability: r.apartment_adaptability,
      childrenCompatibility: r.children_compatibility === 'True',
      dogsCompatibility: r.dogs_compatibility === 'True',
      catsCompatibility: r.cats_compatibility === 'True',
    };

    const existing = await prisma.pets.findFirst({ where: { rganimal } });
    if (existing) {
      await prisma.pets.update({ where: { id: existing.id }, data });
    } else {
      await prisma.pets.create({ data });
    }
  }
  console.log(`${rows.length} pets reais importados/atualizados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
