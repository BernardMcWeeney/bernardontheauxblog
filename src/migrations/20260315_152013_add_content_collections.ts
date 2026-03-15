import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`reviews\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`review_type\` text DEFAULT 'album',
  	\`artist\` text,
  	\`review_date\` text NOT NULL,
  	\`listened_on\` text,
  	\`rating\` numeric NOT NULL,
  	\`format\` text,
  	\`label\` text,
  	\`release_year\` numeric,
  	\`standout_tracks\` text,
  	\`venue\` text,
  	\`city\` text,
  	\`event_date\` text,
  	\`cover_id\` integer,
  	\`excerpt\` text,
  	\`content\` text,
  	\`published\` integer DEFAULT true,
  	\`featured\` integer,
  	\`pinned\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`reviews_slug_idx\` ON \`reviews\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`reviews_cover_idx\` ON \`reviews\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_texts_order_parent\` ON \`reviews_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`gigs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`artist\` text NOT NULL,
  	\`venue\` text NOT NULL,
  	\`city\` text NOT NULL,
  	\`event_date\` text NOT NULL,
  	\`tour\` text,
  	\`support\` text,
  	\`highlights\` text,
  	\`cover_id\` integer,
  	\`excerpt\` text,
  	\`content\` text,
  	\`published\` integer DEFAULT true,
  	\`featured\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`gigs_slug_idx\` ON \`gigs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`gigs_cover_idx\` ON \`gigs\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`gigs_updated_at_idx\` ON \`gigs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gigs_created_at_idx\` ON \`gigs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gigs_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`gigs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`gigs_texts_order_parent\` ON \`gigs_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`deep_dives\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`published_on\` text NOT NULL,
  	\`topic\` text,
  	\`era\` text,
  	\`cover_id\` integer,
  	\`excerpt\` text,
  	\`content\` text,
  	\`published\` integer DEFAULT true,
  	\`featured\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`deep_dives_slug_idx\` ON \`deep_dives\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`deep_dives_cover_idx\` ON \`deep_dives\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`deep_dives_updated_at_idx\` ON \`deep_dives\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`deep_dives_created_at_idx\` ON \`deep_dives\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`deep_dives_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`deep_dives\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`deep_dives_texts_order_parent\` ON \`deep_dives_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`playlists\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`published_on\` text NOT NULL,
  	\`platform\` text NOT NULL,
  	\`playlist_url\` text NOT NULL,
  	\`embed_url\` text,
  	\`mood\` text,
  	\`duration\` numeric,
  	\`cover_id\` integer,
  	\`excerpt\` text,
  	\`content\` text,
  	\`published\` integer DEFAULT true,
  	\`featured\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`playlists_slug_idx\` ON \`playlists\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`playlists_cover_idx\` ON \`playlists\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`playlists_updated_at_idx\` ON \`playlists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`playlists_created_at_idx\` ON \`playlists\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`playlists_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`playlists\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`playlists_texts_order_parent\` ON \`playlists_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`notes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`listened_on\` text NOT NULL,
  	\`artist\` text,
  	\`source\` text,
  	\`cover_id\` integer,
  	\`excerpt\` text,
  	\`content\` text,
  	\`published\` integer DEFAULT true,
  	\`featured\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`notes_slug_idx\` ON \`notes\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`notes_cover_idx\` ON \`notes\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`notes_updated_at_idx\` ON \`notes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`notes_created_at_idx\` ON \`notes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`notes_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`notes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`notes_texts_order_parent\` ON \`notes_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`reviews_id\` integer REFERENCES reviews(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`gigs_id\` integer REFERENCES gigs(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`deep_dives_id\` integer REFERENCES deep_dives(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`playlists_id\` integer REFERENCES playlists(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`notes_id\` integer REFERENCES notes(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gigs_id_idx\` ON \`payload_locked_documents_rels\` (\`gigs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_deep_dives_id_idx\` ON \`payload_locked_documents_rels\` (\`deep_dives_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_playlists_id_idx\` ON \`payload_locked_documents_rels\` (\`playlists_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_notes_id_idx\` ON \`payload_locked_documents_rels\` (\`notes_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`reviews_texts\`;`)
  await db.run(sql`DROP TABLE \`gigs\`;`)
  await db.run(sql`DROP TABLE \`gigs_texts\`;`)
  await db.run(sql`DROP TABLE \`deep_dives\`;`)
  await db.run(sql`DROP TABLE \`deep_dives_texts\`;`)
  await db.run(sql`DROP TABLE \`playlists\`;`)
  await db.run(sql`DROP TABLE \`playlists_texts\`;`)
  await db.run(sql`DROP TABLE \`notes\`;`)
  await db.run(sql`DROP TABLE \`notes_texts\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
}
