import { randomBytes } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config';
import { Client } from 'pg';

const MIGRATIONS_DIR = join(__dirname, '../../../prisma/migrations');
const TARGET_MIGRATION =
  '20261102190000_add_status_fields_for_admin_indicators';

const migrationNames = () =>
  readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

const readMigration = (name: string) =>
  readFileSync(join(MIGRATIONS_DIR, name, 'migration.sql'), 'utf8');

describe('migration files', () => {
  it('has a migration.sql for every migration folder, in chronological order', () => {
    const names = migrationNames();
    expect(names).toContain(TARGET_MIGRATION);
    for (const name of names) {
      expect(existsSync(join(MIGRATIONS_DIR, name, 'migration.sql'))).toBe(
        true,
      );
    }
    expect(names[names.length - 1]).toBe(TARGET_MIGRATION);
  });
});

// Aplica as migrações em um schema temporário para não tocar nos dados reais.
// Pulado quando não há PostgreSQL acessível via DATABASE_URL.
const databaseUrl = process.env.DATABASE_URL;
const describeWithDb = databaseUrl ? describe : describe.skip;

describeWithDb('status fields migration (PostgreSQL)', () => {
  const schema = `migration_test_${randomBytes(4).toString('hex')}`;
  let client: Client;
  let reachable = true;

  const applyUntilBefore = async () => {
    for (const name of migrationNames()) {
      if (name === TARGET_MIGRATION) break;
      await client.query(readMigration(name));
    }
  };

  beforeAll(async () => {
    client = new Client({ connectionString: databaseUrl });
    try {
      await client.connect();
    } catch {
      reachable = false;
      return;
    }
    await client.query(`CREATE SCHEMA "${schema}"`);
    await client.query(`SET search_path TO "${schema}"`);
    await applyUntilBefore();
  });

  afterAll(async () => {
    if (!reachable) return;
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await client.end();
  });

  const columnInfo = async (table: string, column: string) => {
    const { rows } = await client.query<{
      is_nullable: string;
      column_default: string | null;
    }>(
      `SELECT is_nullable, column_default FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
      [schema, table, column],
    );
    return rows[0];
  };

  it('applies cleanly on top of the previous schema and backfills existing rows', async () => {
    if (!reachable) return;

    await client.query(
      `INSERT INTO "Rescues" ("name", "location", "updatedAt") VALUES ('Antigo', 'SP', now())`,
    );
    await client.query(
      `INSERT INTO "Donations" ("donorName", "amount", "updatedAt") VALUES ('Legado', 25, now())`,
    );
    await client.query(
      `INSERT INTO "Partners" ("name","type","contact","email","phone","address","city","state","country","description","location","updatedAt")
       VALUES ('P','Vet','c','p@p.com','1','a','SP','SP','BR','d','SP', now())`,
    );

    await client.query(readMigration(TARGET_MIGRATION));

    const rescue = await client.query<{ status: string }>(
      `SELECT "status" FROM "Rescues"`,
    );
    expect(rescue.rows[0].status).toBe('recovered');

    const donation = await client.query(
      `SELECT "type","method","plan","status" FROM "Donations"`,
    );
    expect(donation.rows[0]).toEqual({
      type: 'one_time',
      method: 'pix',
      plan: null,
      status: 'confirmed',
    });

    const partner = await client.query<{ status: string }>(
      `SELECT "status" FROM "Partners"`,
    );
    expect(partner.rows[0].status).toBe('active');
  });

  it('creates the new columns with the expected nullability and defaults', async () => {
    if (!reachable) return;

    expect(await columnInfo('Rescues', 'status')).toMatchObject({
      is_nullable: 'NO',
      column_default: expect.stringContaining('triage') as string,
    });
    expect(await columnInfo('Donations', 'type')).toMatchObject({
      is_nullable: 'NO',
      column_default: expect.stringContaining('one_time') as string,
    });
    expect(await columnInfo('Donations', 'method')).toMatchObject({
      is_nullable: 'NO',
      column_default: expect.stringContaining('pix') as string,
    });
    expect(await columnInfo('Donations', 'plan')).toMatchObject({
      is_nullable: 'YES',
    });
    expect(await columnInfo('Donations', 'status')).toMatchObject({
      is_nullable: 'NO',
      column_default: expect.stringContaining('confirmed') as string,
    });
    expect(await columnInfo('Partners', 'status')).toMatchObject({
      is_nullable: 'NO',
      column_default: expect.stringContaining('active') as string,
    });
  });

  it('creates the supporting indexes', async () => {
    if (!reachable) return;

    const { rows } = await client.query<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes WHERE schemaname = $1`,
      [schema],
    );
    const names = rows.map((row) => row.indexname);
    expect(names).toEqual(
      expect.arrayContaining([
        'Rescues_status_idx',
        'Donations_status_idx',
        'Donations_createdAt_idx',
        'Partners_status_idx',
      ]),
    );
  });

  it('applies defaults to rows inserted after the migration', async () => {
    if (!reachable) return;

    await client.query(
      `INSERT INTO "Rescues" ("name", "location", "updatedAt") VALUES ('Novo', 'RJ', now())`,
    );
    const { rows } = await client.query<{ status: string }>(
      `SELECT "status" FROM "Rescues" WHERE "name" = 'Novo'`,
    );
    expect(rows[0].status).toBe('triage');
  });
});
