PRAGMA foreign_keys=OFF;
DROP TABLE IF EXISTS __new_artists;
DROP TABLE IF EXISTS _songs_tmp;
CREATE TABLE _reviews_bak AS SELECT * FROM reviews;
CREATE TABLE _gigs_bak AS SELECT * FROM gigs;
CREATE TABLE _notes_bak AS SELECT * FROM notes;
CREATE TABLE _pldr_bak AS SELECT * FROM payload_locked_documents_rels;
