import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ── Create artists table ──
  await db.run(sql`CREATE TABLE \`artists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`bio\` text,
  	\`image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`artists_slug_idx\` ON \`artists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`artists_image_idx\` ON \`artists\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`artists_updated_at_idx\` ON \`artists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`artists_created_at_idx\` ON \`artists\` (\`created_at\`);`)

  // ── Create labels table ──
  await db.run(sql`CREATE TABLE \`labels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`labels_name_idx\` ON \`labels\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`labels_updated_at_idx\` ON \`labels\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`labels_created_at_idx\` ON \`labels\` (\`created_at\`);`)

  // ── Migrate artists data from text fields ──
  // Insert distinct artist names from reviews
  await db.run(sql`INSERT OR IGNORE INTO \`artists\` (\`name\`, \`slug\`)
    SELECT DISTINCT \`artist\`,
      REPLACE(REPLACE(REPLACE(REPLACE(LOWER(\`artist\`), ' ', '-'), '.', ''), '''', ''), ',', '')
    FROM \`reviews\` WHERE \`artist\` IS NOT NULL AND \`artist\` != '';`)
  // Insert distinct artist names from gigs
  await db.run(sql`INSERT OR IGNORE INTO \`artists\` (\`name\`, \`slug\`)
    SELECT DISTINCT \`artist\`,
      REPLACE(REPLACE(REPLACE(REPLACE(LOWER(\`artist\`), ' ', '-'), '.', ''), '''', ''), ',', '')
    FROM \`gigs\` WHERE \`artist\` IS NOT NULL AND \`artist\` != ''
    AND \`artist\` NOT IN (SELECT \`name\` FROM \`artists\`);`)
  // Insert distinct artist names from notes
  await db.run(sql`INSERT OR IGNORE INTO \`artists\` (\`name\`, \`slug\`)
    SELECT DISTINCT \`artist\`,
      REPLACE(REPLACE(REPLACE(REPLACE(LOWER(\`artist\`), ' ', '-'), '.', ''), '''', ''), ',', '')
    FROM \`notes\` WHERE \`artist\` IS NOT NULL AND \`artist\` != ''
    AND \`artist\` NOT IN (SELECT \`name\` FROM \`artists\`);`)

  // ── Migrate labels data from text fields ──
  await db.run(sql`INSERT OR IGNORE INTO \`labels\` (\`name\`)
    SELECT DISTINCT \`label\` FROM \`reviews\` WHERE \`label\` IS NOT NULL AND \`label\` != '';`)

  // ── Add new columns to reviews ──
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`headline\` text;`)
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`artist_id\` integer REFERENCES \`artists\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`label_id\` integer REFERENCES \`labels\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`reviews\` ADD COLUMN \`meta_image_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`reviews_artist_idx\` ON \`reviews\` (\`artist_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_label_idx\` ON \`reviews\` (\`label_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_meta_meta_image_idx\` ON \`reviews\` (\`meta_image_id\`);`)

  // Populate FK references from text values
  await db.run(sql`UPDATE \`reviews\` SET \`artist_id\` = (SELECT \`id\` FROM \`artists\` WHERE \`artists\`.\`name\` = \`reviews\`.\`artist\`) WHERE \`artist\` IS NOT NULL AND \`artist\` != '';`)
  await db.run(sql`UPDATE \`reviews\` SET \`label_id\` = (SELECT \`id\` FROM \`labels\` WHERE \`labels\`.\`name\` = \`reviews\`.\`label\`) WHERE \`label\` IS NOT NULL AND \`label\` != '';`)

  // ── Add new columns to gigs ──
  await db.run(sql`ALTER TABLE \`gigs\` ADD COLUMN \`headline\` text;`)
  await db.run(sql`ALTER TABLE \`gigs\` ADD COLUMN \`artist_id\` integer NOT NULL DEFAULT 0 REFERENCES \`artists\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`ALTER TABLE \`gigs\` ADD COLUMN \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`gigs\` ADD COLUMN \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`gigs\` ADD COLUMN \`meta_image_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`gigs_artist_idx\` ON \`gigs\` (\`artist_id\`);`)
  await db.run(sql`CREATE INDEX \`gigs_meta_meta_image_idx\` ON \`gigs\` (\`meta_image_id\`);`)

  // Populate FK references
  await db.run(sql`UPDATE \`gigs\` SET \`artist_id\` = (SELECT \`id\` FROM \`artists\` WHERE \`artists\`.\`name\` = \`gigs\`.\`artist\`) WHERE \`artist\` IS NOT NULL AND \`artist\` != '';`)

  // ── Add new columns to notes ──
  await db.run(sql`ALTER TABLE \`notes\` ADD COLUMN \`headline\` text;`)
  await db.run(sql`ALTER TABLE \`notes\` ADD COLUMN \`artist_id\` integer REFERENCES \`artists\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`ALTER TABLE \`notes\` ADD COLUMN \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`notes\` ADD COLUMN \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`notes\` ADD COLUMN \`meta_image_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`notes_artist_idx\` ON \`notes\` (\`artist_id\`);`)
  await db.run(sql`CREATE INDEX \`notes_meta_meta_image_idx\` ON \`notes\` (\`meta_image_id\`);`)

  // Populate FK references
  await db.run(sql`UPDATE \`notes\` SET \`artist_id\` = (SELECT \`id\` FROM \`artists\` WHERE \`artists\`.\`name\` = \`notes\`.\`artist\`) WHERE \`artist\` IS NOT NULL AND \`artist\` != '';`)

  // ── Add new columns to deep_dives ──
  await db.run(sql`ALTER TABLE \`deep_dives\` ADD COLUMN \`headline\` text;`)
  await db.run(sql`ALTER TABLE \`deep_dives\` ADD COLUMN \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`deep_dives\` ADD COLUMN \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`deep_dives\` ADD COLUMN \`meta_image_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`deep_dives_meta_meta_image_idx\` ON \`deep_dives\` (\`meta_image_id\`);`)

  // ── Add new columns to playlists ──
  await db.run(sql`ALTER TABLE \`playlists\` ADD COLUMN \`headline\` text;`)
  await db.run(sql`ALTER TABLE \`playlists\` ADD COLUMN \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`playlists\` ADD COLUMN \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`playlists\` ADD COLUMN \`meta_image_id\` integer REFERENCES \`media\`(\`id\`) ON DELETE set null;`)
  await db.run(sql`CREATE INDEX \`playlists_meta_meta_image_idx\` ON \`playlists\` (\`meta_image_id\`);`)

  // ── Update payload_locked_documents_rels for new collections ──
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`artists_id\` integer REFERENCES \`artists\`(\`id\`) ON DELETE cascade;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD COLUMN \`labels_id\` integer REFERENCES \`labels\`(\`id\`) ON DELETE cascade;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_artists_id_idx\` ON \`payload_locked_documents_rels\` (\`artists_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_labels_id_idx\` ON \`payload_locked_documents_rels\` (\`labels_id\`);`)

  // ── Note: old text `artist` and `label` columns remain in place ──
  // SQLite does not support DROP COLUMN before 3.35.0.
  // The old columns are harmless — Payload ignores them since they're
  // no longer in the collection config. They can be cleaned up in a
  // future migration if desired.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop new indexes
  await db.run(sql`DROP INDEX IF EXISTS \`reviews_artist_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`reviews_label_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`reviews_meta_meta_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`gigs_artist_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`gigs_meta_meta_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`notes_artist_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`notes_meta_meta_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`deep_dives_meta_meta_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`playlists_meta_meta_image_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_artists_id_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`payload_locked_documents_rels_labels_id_idx\`;`)

  // Drop new tables
  await db.run(sql`DROP TABLE IF EXISTS \`artists\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`labels\`;`)
}
