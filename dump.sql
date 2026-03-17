PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE `users_sessions` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`created_at` text,
  	`expires_at` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
INSERT INTO "users_sessions" ("_order","_parent_id","id","created_at","expires_at") VALUES(1,1,'5a6e0914-aee0-4d96-9466-dd23cafcd5b8','2026-03-17T11:14:16.773Z','2026-03-17T13:14:16.773Z');
CREATE TABLE `users` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`email` text NOT NULL,
  	`reset_password_token` text,
  	`reset_password_expiration` text,
  	`salt` text,
  	`hash` text,
  	`login_attempts` numeric DEFAULT 0,
  	`lock_until` text
  );
INSERT INTO "users" ("id","updated_at","created_at","email","reset_password_token","reset_password_expiration","salt","hash","login_attempts","lock_until") VALUES(1,'2026-03-15T21:18:43.809Z','2026-03-15T14:32:49.608Z','me@bernardontheaux.com',NULL,NULL,'9d8d5fa37130ebf90a6d5471fb503b49fb3393a07f0565a4521ccf6af7b24126','6be6ee97a5353c4e6371956aa4b1eb654787681f030627ddcf0643f4c313fd6facd286ceed83abbcf826a554dcd25e16379f8fb258f76351355f7afe904f1181afdfad34308247ce0d1fbdc3b776cb5bce823e1536792db5b6d47020a6c600ca1680b3a57f817d8e04a3320f300d080412e883eb0ce92b397aa0bdaee47b1755e383089b3a36a79802eb82b85cdde3278a8f3777952341c3b4f457a7214dbf99b0505722bc27bfc08b809dae7d654d1958c36b056da8afa5057aa980dce31f47d24682b5a411b0a8fedfdd48f90bb02250481342fc031f9d55e818ffdc4d039c868d28ba702ab90c729fa3320689cd20167ab15f2b4a0366c601b2890ff942983aa4686c04ec21e682f3a51b00965479b0b5bc230f5f516a61c41879bfabae58ac45831852049783e1c2fb9eefee87006dc6c655b86df951f4847dc013269b5175217a96edc1f720201bbe75aa6f30de55115a9422f85a977835647b33dc7183cb6c2b8979d1304f4ed2024405b4f7c5b5271a7676755e9788e12181181a252301c74ac29e73d5262ce3c83c345a16793f9cc3a2d1a0f39ace03dd4d165fd9fc3bc7a73b0554395f82ce593f023aaf72e2acdbe15501e2b09371a1e1e96ac47dd36f2b7234fb7be3f7d156b94dc8fcba09eccd98b0d09a0b59e0e08f53c3473ade76c5f818e5b137d98fe1071bd8024c68c7bd6758edb68f83f50036ed7fcaad',0,NULL);
CREATE TABLE `media` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`alt` text NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`url` text,
  	`thumbnail_u_r_l` text,
  	`filename` text,
  	`mime_type` text,
  	`filesize` numeric,
  	`width` numeric,
  	`height` numeric
  );
INSERT INTO "media" ("id","alt","updated_at","created_at","url","thumbnail_u_r_l","filename","mime_type","filesize","width","height") VALUES(1,'People Watching - Album Art','2026-03-16T10:52:54.109Z','2026-03-16T10:52:54.109Z','/api/media/file/sam-fender.png',NULL,'sam-fender.png','image/png',457758,1000,1000);
INSERT INTO "media" ("id","alt","updated_at","created_at","url","thumbnail_u_r_l","filename","mime_type","filesize","width","height") VALUES(2,'wetleg','2026-03-16T20:12:35.653Z','2026-03-16T20:12:35.653Z','/api/media/file/wetleg.avif',NULL,'wetleg.avif','image/avif',26752,465,372);
INSERT INTO "media" ("id","alt","updated_at","created_at","url","thumbnail_u_r_l","filename","mime_type","filesize","width","height") VALUES(3,'wet leg - mangetout','2026-03-16T20:15:21.779Z','2026-03-16T20:15:21.779Z','/api/media/file/wet%20leg%20-%20mangetout.jpeg',NULL,'wet leg - mangetout.jpeg','image/jpeg',94456,640,640);
INSERT INTO "media" ("id","alt","updated_at","created_at","url","thumbnail_u_r_l","filename","mime_type","filesize","width","height") VALUES(4,'Sam Fender by Sarah Louise Bennett','2026-03-16T21:59:08.270Z','2026-03-16T21:59:08.270Z','/api/media/file/Sam-Fender-by-Sarah-Louise-Bennett-scaled.jpg',NULL,'Sam-Fender-by-Sarah-Louise-Bennett-scaled.jpg','image/jpeg',850342,2560,1582);
INSERT INTO "media" ("id","alt","updated_at","created_at","url","thumbnail_u_r_l","filename","mime_type","filesize","width","height") VALUES(5,'Robert Smith of The Cure','2026-03-16T22:02:34.118Z','2026-03-16T22:02:34.118Z','/api/media/file/robert-smith-thecure.avif',NULL,'robert-smith-thecure.avif','image/avif',52469,1200,1200);
INSERT INTO "media" ("id","alt","updated_at","created_at","url","thumbnail_u_r_l","filename","mime_type","filesize","width","height") VALUES(6,'Songs of a Lost World','2026-03-17T11:15:57.075Z','2026-03-17T11:15:57.075Z','/api/media/file/Songs_of_a_Lost_World_the_Cure.jpg',NULL,'Songs_of_a_Lost_World_the_Cure.jpg','image/jpeg',78788,316,316);
CREATE TABLE `payload_locked_documents` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`global_slug` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
CREATE TABLE `payload_locked_documents_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`users_id` integer,
  	`media_id` integer, `reviews_id` integer REFERENCES reviews(id), `gigs_id` integer REFERENCES gigs(id), `deep_dives_id` integer REFERENCES deep_dives(id), `playlists_id` integer REFERENCES playlists(id), `notes_id` integer REFERENCES notes(id), `artists_id` integer REFERENCES `artists`(`id`) ON DELETE cascade, `labels_id` integer REFERENCES `labels`(`id`) ON DELETE cascade, `subscribers_id` integer REFERENCES `subscribers`(`id`) ON DELETE cascade,
  	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE `payload_preferences` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`key` text,
  	`value` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(1,'collection-users','{}','2026-03-15T14:35:16.862Z','2026-03-15T14:35:16.862Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(2,'collection-reviews','{"editViewType":"live-preview","limit":10}','2026-03-16T21:32:39.886Z','2026-03-15T20:41:04.036Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(3,'collection-playlists','{}','2026-03-15T21:19:19.169Z','2026-03-15T21:19:19.169Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(4,'collection-deep-dives','{}','2026-03-15T21:19:21.792Z','2026-03-15T21:19:21.792Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(5,'collection-gigs','{}','2026-03-15T21:19:25.158Z','2026-03-15T21:19:25.158Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(6,'collection-media','{}','2026-03-16T10:51:52.190Z','2026-03-16T10:51:52.190Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(7,'collection-notes','{}','2026-03-16T11:01:41.864Z','2026-03-16T11:01:41.864Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(8,'collection-artists','{"limit":10}','2026-03-16T21:57:55.630Z','2026-03-16T13:16:50.606Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(9,'collection-labels','{}','2026-03-16T17:53:47.273Z','2026-03-16T17:53:47.273Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(10,'collection-forms','{}','2026-03-16T17:54:21.714Z','2026-03-16T17:54:21.714Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(11,'collection-form-submissions','{}','2026-03-16T17:57:28.564Z','2026-03-16T17:57:28.564Z');
INSERT INTO "payload_preferences" ("id","key","value","updated_at","created_at") VALUES(12,'collection-subscribers','{"limit":10}','2026-03-16T21:46:07.995Z','2026-03-16T21:15:36.350Z');
CREATE TABLE `payload_preferences_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`users_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(1,NULL,1,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(3,NULL,3,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(4,NULL,4,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(5,NULL,5,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(7,NULL,6,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(8,NULL,7,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(10,NULL,9,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(11,NULL,10,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(12,NULL,11,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(14,NULL,2,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(15,NULL,2,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(16,NULL,12,'user',1);
INSERT INTO "payload_preferences_rels" ("id","order","parent_id","path","users_id") VALUES(17,NULL,8,'user',1);
CREATE TABLE `payload_migrations` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text,
  	`batch` numeric,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO "payload_migrations" ("id","name","batch","updated_at","created_at") VALUES(1,'20250929_111647',1,'2026-03-11T19:43:37.110Z','2026-03-11T19:43:37.109Z');
INSERT INTO "payload_migrations" ("id","name","batch","updated_at","created_at") VALUES(2,'20260315_152013_add_content_collections',2,'2026-03-15T20:36:50.781Z','2026-03-15T20:36:50.780Z');
INSERT INTO "payload_migrations" ("id","name","batch","updated_at","created_at") VALUES(3,'20260316_120000_add_artists_labels_seo',3,'2026-03-16T13:09:55.422Z','2026-03-16T13:09:55.422Z');
INSERT INTO "payload_migrations" ("id","name","batch","updated_at","created_at") VALUES(4,'20260316_180000_add_subscribers',4,'2026-03-16T19:59:56.497Z','2026-03-16T19:59:56.497Z');
INSERT INTO "payload_migrations" ("id","name","batch","updated_at","created_at") VALUES(5,'20260316_213000_fix_subscribers_locked_docs',5,'2026-03-16T21:40:02.860Z','2026-03-16T21:40:02.859Z');
ANALYZE sqlite_schema;
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_migrations','payload_migrations_created_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_migrations','payload_migrations_updated_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('_cf_KV','_cf_KV','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('users','users_email_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('users','users_created_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('users','users_updated_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('users_sessions','users_sessions_parent_id_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('users_sessions','users_sessions_order_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('users_sessions','sqlite_autoindex_users_sessions_1','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_meta_meta_image_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_label_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_artist_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_created_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_updated_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_cover_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('reviews','reviews_slug_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('artists','artists_created_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('artists','artists_updated_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('artists','artists_image_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('artists','artists_slug_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('media','media_filename_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('media','media_created_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('media','media_updated_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('labels','labels_created_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('labels','labels_updated_at_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('labels','labels_name_idx','1 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences','payload_preferences_created_at_idx','12 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences','payload_preferences_updated_at_idx','12 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences','payload_preferences_key_idx','12 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences_rels','payload_preferences_rels_users_id_idx','13 13');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences_rels','payload_preferences_rels_path_idx','13 13');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences_rels','payload_preferences_rels_parent_idx','13 1');
INSERT INTO "sqlite_stat1" ("tbl","idx","stat") VALUES('payload_preferences_rels','payload_preferences_rels_order_idx','13 13');
CREATE TABLE `reviews` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text NOT NULL,
  	`review_type` text DEFAULT 'album',
  	`review_date` text NOT NULL,
  	`listened_on` text,
  	`rating` numeric NOT NULL,
  	`format` text,
  	`release_year` numeric,
  	`standout_tracks` text,
  	`venue` text,
  	`city` text,
  	`event_date` text,
  	`cover_id` integer,
  	`excerpt` text,
  	`content` text,
  	`published` integer DEFAULT true,
  	`featured` integer,
  	`pinned` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL, `headline` text, `artist_id` integer REFERENCES `artists`(`id`) ON DELETE set null, `label_id` integer REFERENCES `labels`(`id`) ON DELETE set null, `meta_title` text, `meta_description` text, `meta_image_id` integer REFERENCES `media`(`id`) ON DELETE set null,
  	FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
INSERT INTO "reviews" ("id","title","slug","review_type","review_date","listened_on","rating","format","release_year","standout_tracks","venue","city","event_date","cover_id","excerpt","content","published","featured","pinned","updated_at","created_at","headline","artist_id","label_id","meta_title","meta_description","meta_image_id") VALUES(1,'People Watching','People-Watching-sam-fender','album','2026-03-01T12:00:00.000Z','2025-02-28T12:00:00.000Z',10,'Stream',2025,'People Watching, Arm''s Length, Little Bit Closer',NULL,NULL,NULL,1,'People Watching is arguably one of Sam Fender’s finest pieces of work to date. The album feels confident, expansive, and deeply human, blending his sharp storytelling with sweeping, anthemic production. Fender’s gift for observing ordinary lives and turning them into powerful narratives is at its peak here, with songs that balance vulnerability, social commentary, and soaring indie-rock energy. It’s an album that sounds both intimate and stadium-ready — proof that Sam Fender continues to grow not just as a songwriter, but as one of the most compelling voices in modern British music.','{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',1,0,0,'2026-03-16T18:16:22.678Z','2026-03-16T10:51:01.364Z','People Watching - The best thing Sam has produced!',1,1,'The best thing Sam has produced | Bernard on the Aux','People Watching is arguably one of Sam Fender’s finest pieces of work to date. The album feels confident, expansive, and deeply human.',1);
INSERT INTO "reviews" ("id","title","slug","review_type","review_date","listened_on","rating","format","release_year","standout_tracks","venue","city","event_date","cover_id","excerpt","content","published","featured","pinned","updated_at","created_at","headline","artist_id","label_id","meta_title","meta_description","meta_image_id") VALUES(4,'Mangetout','Mangetout-wetleg','album','2026-03-16T12:00:00.000Z','2026-03-16T12:00:00.000Z',9,'Stream',2025,'Mangetout',NULL,NULL,NULL,3,'A blast of wiry guitars, half-spoken swagger and deadpan wit, “Mangetout” feels like Wet Leg fully leaning into the messy, playful energy that made them so compelling in the first place. It’s punchy, strange and instantly memorable — the kind of track that sounds like it could fall apart at any moment but somehow holds together perfectly.',NULL,1,NULL,NULL,'2026-03-16T21:49:24.342Z','2026-03-16T21:49:24.342Z','Wet Leg return with a bang on “Mangetout” — sharp, chaotic and irresistibly fun',3,1,'Wet Leg return with a bang on “Mangetout” — sharp, chaotic and irresistibly fun | Bernard on the Aux','A blast of wiry guitars, half-spoken swagger and deadpan wit, “Mangetout” feels like Wet Leg fully leaning into the messy, playful energy that made them so compelling in the first place. It’s punchy, strange and instantly memorable — the kind of track that sounds like it could fall apart at any moment but somehow holds together perfectly.',NULL);
INSERT INTO "reviews" ("id","title","slug","review_type","review_date","listened_on","rating","format","release_year","standout_tracks","venue","city","event_date","cover_id","excerpt","content","published","featured","pinned","updated_at","created_at","headline","artist_id","label_id","meta_title","meta_description","meta_image_id") VALUES(5,'Songs of a Lost World','the-cure-songs-of-a-lost-world','album','2026-03-17T12:00:00.000Z','2026-03-17T12:00:00.000Z',10,'Digital',2024,'Alone, All I Ever Was, Endsong, I Can Never Say Goodbye',NULL,NULL,NULL,6,'There’s a quiet confidence running through Songs of a Lost World — no urgency, no need to prove anything. Just expansive, immersive songwriting that pulls you under and refuses to let go, track after track.',NULL,1,NULL,NULL,'2026-03-17T11:20:18.478Z','2026-03-17T11:20:18.478Z','The Cure Deliver Perfection - “Songs of a Lost World” Is a Masterpiece and Proof They’re Still Untouchable',4,1,'The Cure Deliver Perfection - “Songs of a Lost World” Is a Masterpiece and Proof They’re Still Untouchable | Bernard on the Aux','There’s a quiet confidence running through Songs of a Lost World — no urgency, no need to prove anything. Just expansive, immersive songwriting that pulls you under and refuses to let go, track after track.',6);
CREATE TABLE `reviews_texts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer NOT NULL,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`text` text,
  	FOREIGN KEY (`parent_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE `gigs` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text NOT NULL,
  	`artist` text NOT NULL,
  	`venue` text NOT NULL,
  	`city` text NOT NULL,
  	`event_date` text NOT NULL,
  	`tour` text,
  	`support` text,
  	`highlights` text,
  	`cover_id` integer,
  	`excerpt` text,
  	`content` text,
  	`published` integer DEFAULT true,
  	`featured` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL, `headline` text, `artist_id` integer NOT NULL DEFAULT 0 REFERENCES `artists`(`id`) ON DELETE set null, `meta_title` text, `meta_description` text, `meta_image_id` integer REFERENCES `media`(`id`) ON DELETE set null,
  	FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE `gigs_texts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer NOT NULL,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`text` text,
  	FOREIGN KEY (`parent_id`) REFERENCES `gigs`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE `deep_dives` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text NOT NULL,
  	`published_on` text NOT NULL,
  	`topic` text,
  	`era` text,
  	`cover_id` integer,
  	`excerpt` text,
  	`content` text,
  	`published` integer DEFAULT true,
  	`featured` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL, `headline` text, `meta_title` text, `meta_description` text, `meta_image_id` integer REFERENCES `media`(`id`) ON DELETE set null,
  	FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE `deep_dives_texts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer NOT NULL,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`text` text,
  	FOREIGN KEY (`parent_id`) REFERENCES `deep_dives`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE `playlists` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text NOT NULL,
  	`published_on` text NOT NULL,
  	`platform` text NOT NULL,
  	`playlist_url` text NOT NULL,
  	`embed_url` text,
  	`mood` text,
  	`duration` numeric,
  	`cover_id` integer,
  	`excerpt` text,
  	`content` text,
  	`published` integer DEFAULT true,
  	`featured` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL, `headline` text, `meta_title` text, `meta_description` text, `meta_image_id` integer REFERENCES `media`(`id`) ON DELETE set null,
  	FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE `playlists_texts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer NOT NULL,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`text` text,
  	FOREIGN KEY (`parent_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE `notes` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text NOT NULL,
  	`listened_on` text NOT NULL,
  	`artist` text,
  	`source` text,
  	`cover_id` integer,
  	`excerpt` text,
  	`content` text,
  	`published` integer DEFAULT true,
  	`featured` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL, `headline` text, `artist_id` integer REFERENCES `artists`(`id`) ON DELETE set null, `meta_title` text, `meta_description` text, `meta_image_id` integer REFERENCES `media`(`id`) ON DELETE set null,
  	FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE `notes_texts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer NOT NULL,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`text` text,
  	FOREIGN KEY (`parent_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE `payload_kv` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`key` text NOT NULL,
  	`data` text NOT NULL
  );
CREATE TABLE `artists` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`slug` text NOT NULL,
  	`bio` text,
  	`image_id` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
INSERT INTO "artists" ("id","name","slug","bio","image_id","updated_at","created_at") VALUES(1,'Sam Fender','sam-fender',replace('Sam Fender is an English singer-songwriter from North Shields in northeast England, known for his powerful voice, widescreen indie rock sound, and socially observant lyrics. Drawing influence from artists like Bruce Springsteen and The War on Drugs, Fender blends anthemic guitar music with storytelling that often explores working-class life, politics, and personal struggles.\n\nHe broke through in 2018 with the single Play God, before releasing his acclaimed debut album Hypersonic Missiles in 2019, which debuted at number one in the UK. His second album Seventeen Going Under (2021) further established him as one of Britain’s leading rock songwriters of his generation, praised for its emotional honesty and expansive sound.\n\nFender won the Critics’ Choice award at the Brit Awards in 2019 and has built a reputation for huge, passionate live performances that mix stadium-sized choruses with deeply personal songwriting.','\n',char(10)),4,'2026-03-16T22:00:01.230Z','2026-03-16T13:09:50.324Z');
INSERT INTO "artists" ("id","name","slug","bio","image_id","updated_at","created_at") VALUES(3,'Wet Leg','Wet Leg',replace('Wet Leg are a British indie rock band formed in 2019 on the Isle of Wight by childhood friends Rhian Teasdale and Hester Chambers. The band quickly became one of the most talked-about new acts in British indie music thanks to their sharp humour, minimal but punchy guitar sound, and playful, deadpan lyric style.\n\nThey first gained widespread attention in 2021 with their debut single Chaise Longue, whose witty spoken-word delivery and instantly memorable hook went viral online and introduced their offbeat personality to a global audience.\n\nIn 2022 they released their self-titled debut album Wet Leg, which topped the UK Albums Chart and was praised for blending indie rock, post-punk energy, and sarcastic storytelling. The album won Best Alternative Music Album at the Grammy Awards and also earned multiple awards at the Brit Awards, cementing the band as one of the defining indie acts of the early 2020s.\n\nAlthough Teasdale and Chambers remain the creative core, Wet Leg perform live as a full band alongside touring members on bass, drums, and guitar. Their music is known for its blend of jagged indie riffs, surreal humour, and an intentionally chaotic, tongue-in-cheek attitude.\n\nSince their breakthrough, Wet Leg have continued to build a reputation for energetic live shows and clever, irreverent songwriting that mixes punk spirit with modern indie pop sensibilities.','\n',char(10)),2,'2026-03-16T20:13:01.796Z','2026-03-16T20:13:01.796Z');
INSERT INTO "artists" ("id","name","slug","bio","image_id","updated_at","created_at") VALUES(4,'The Cure','the-cure',replace('The Cure are an English rock band formed in 1978 in Crawley, West Sussex, by singer, guitarist and principal songwriter Robert Smith. Over more than four decades the band have become one of the most influential alternative rock acts in the world, known for blending melancholy atmospheres with bright pop melodies.\n\nEmerging from the late-1970s post-punk scene, The Cure developed a distinctive sound that moved between dark, introspective albums and euphoric pop singles. Records such as Disintegration, Pornography, and Kiss Me, Kiss Me, Kiss Me helped define the gothic and alternative rock movements of the 1980s, while songs like Just Like Heaven, Friday I''m in Love, and Boys Don''t Cry became enduring classics.\n\nLed consistently by Robert Smith, whose distinctive voice, guitar style and iconic appearance became synonymous with the band, The Cure have sold tens of millions of records worldwide and were inducted into the Rock and Roll Hall of Fame in 2019. Their influence continues to span generations of alternative, indie and gothic artists.','\n',char(10)),5,'2026-03-16T22:02:35.470Z','2026-03-16T22:02:35.470Z');
CREATE TABLE `labels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO "labels" ("id","name","updated_at","created_at") VALUES(1,'Polydor','2026-03-16T13:09:50.586Z','2026-03-16T13:09:50.586Z');
CREATE TABLE `subscribers` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`email` text NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO "subscribers" ("id","email","updated_at","created_at") VALUES(1,'office@greenberry.ie','2026-03-16T21:53:55.397Z','2026-03-16T21:53:55.397Z');
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE UNIQUE INDEX `reviews_slug_idx` ON `reviews` (`slug`);
CREATE INDEX `reviews_cover_idx` ON `reviews` (`cover_id`);
CREATE INDEX `reviews_updated_at_idx` ON `reviews` (`updated_at`);
CREATE INDEX `reviews_created_at_idx` ON `reviews` (`created_at`);
CREATE INDEX `reviews_texts_order_parent` ON `reviews_texts` (`order`,`parent_id`);
CREATE UNIQUE INDEX `gigs_slug_idx` ON `gigs` (`slug`);
CREATE INDEX `gigs_cover_idx` ON `gigs` (`cover_id`);
CREATE INDEX `gigs_updated_at_idx` ON `gigs` (`updated_at`);
CREATE INDEX `gigs_created_at_idx` ON `gigs` (`created_at`);
CREATE INDEX `gigs_texts_order_parent` ON `gigs_texts` (`order`,`parent_id`);
CREATE UNIQUE INDEX `deep_dives_slug_idx` ON `deep_dives` (`slug`);
CREATE INDEX `deep_dives_cover_idx` ON `deep_dives` (`cover_id`);
CREATE INDEX `deep_dives_updated_at_idx` ON `deep_dives` (`updated_at`);
CREATE INDEX `deep_dives_created_at_idx` ON `deep_dives` (`created_at`);
CREATE INDEX `deep_dives_texts_order_parent` ON `deep_dives_texts` (`order`,`parent_id`);
CREATE UNIQUE INDEX `playlists_slug_idx` ON `playlists` (`slug`);
CREATE INDEX `playlists_cover_idx` ON `playlists` (`cover_id`);
CREATE INDEX `playlists_updated_at_idx` ON `playlists` (`updated_at`);
CREATE INDEX `playlists_created_at_idx` ON `playlists` (`created_at`);
CREATE INDEX `playlists_texts_order_parent` ON `playlists_texts` (`order`,`parent_id`);
CREATE UNIQUE INDEX `notes_slug_idx` ON `notes` (`slug`);
CREATE INDEX `notes_cover_idx` ON `notes` (`cover_id`);
CREATE INDEX `notes_updated_at_idx` ON `notes` (`updated_at`);
CREATE INDEX `notes_created_at_idx` ON `notes` (`created_at`);
CREATE INDEX `notes_texts_order_parent` ON `notes_texts` (`order`,`parent_id`);
CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);
CREATE INDEX `payload_locked_documents_rels_reviews_id_idx` ON `payload_locked_documents_rels` (`reviews_id`);
CREATE INDEX `payload_locked_documents_rels_gigs_id_idx` ON `payload_locked_documents_rels` (`gigs_id`);
CREATE INDEX `payload_locked_documents_rels_deep_dives_id_idx` ON `payload_locked_documents_rels` (`deep_dives_id`);
CREATE INDEX `payload_locked_documents_rels_playlists_id_idx` ON `payload_locked_documents_rels` (`playlists_id`);
CREATE INDEX `payload_locked_documents_rels_notes_id_idx` ON `payload_locked_documents_rels` (`notes_id`);
CREATE UNIQUE INDEX `artists_slug_idx` ON `artists` (`slug`);
CREATE INDEX `artists_image_idx` ON `artists` (`image_id`);
CREATE INDEX `artists_updated_at_idx` ON `artists` (`updated_at`);
CREATE INDEX `artists_created_at_idx` ON `artists` (`created_at`);
CREATE UNIQUE INDEX `labels_name_idx` ON `labels` (`name`);
CREATE INDEX `labels_updated_at_idx` ON `labels` (`updated_at`);
CREATE INDEX `labels_created_at_idx` ON `labels` (`created_at`);
CREATE INDEX `reviews_artist_idx` ON `reviews` (`artist_id`);
CREATE INDEX `reviews_label_idx` ON `reviews` (`label_id`);
CREATE INDEX `reviews_meta_meta_image_idx` ON `reviews` (`meta_image_id`);
CREATE INDEX `gigs_artist_idx` ON `gigs` (`artist_id`);
CREATE INDEX `gigs_meta_meta_image_idx` ON `gigs` (`meta_image_id`);
CREATE INDEX `notes_artist_idx` ON `notes` (`artist_id`);
CREATE INDEX `notes_meta_meta_image_idx` ON `notes` (`meta_image_id`);
CREATE INDEX `deep_dives_meta_meta_image_idx` ON `deep_dives` (`meta_image_id`);
CREATE INDEX `playlists_meta_meta_image_idx` ON `playlists` (`meta_image_id`);
CREATE INDEX `payload_locked_documents_rels_artists_id_idx` ON `payload_locked_documents_rels` (`artists_id`);
CREATE INDEX `payload_locked_documents_rels_labels_id_idx` ON `payload_locked_documents_rels` (`labels_id`);
CREATE UNIQUE INDEX `subscribers_email_idx` ON `subscribers` (`email`);
CREATE INDEX `subscribers_updated_at_idx` ON `subscribers` (`updated_at`);
CREATE INDEX `subscribers_created_at_idx` ON `subscribers` (`created_at`);
CREATE INDEX `payload_locked_documents_rels_subscribers_id_idx` ON `payload_locked_documents_rels` (`subscribers_id`);
