import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260315_152013_add_content_collections from './20260315_152013_add_content_collections';
import * as migration_20260316_120000_add_artists_labels_seo from './20260316_120000_add_artists_labels_seo';
import * as migration_20260316_180000_add_subscribers from './20260316_180000_add_subscribers';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260315_152013_add_content_collections.up,
    down: migration_20260315_152013_add_content_collections.down,
    name: '20260315_152013_add_content_collections'
  },
  {
    up: migration_20260316_120000_add_artists_labels_seo.up,
    down: migration_20260316_120000_add_artists_labels_seo.down,
    name: '20260316_120000_add_artists_labels_seo'
  },
  {
    up: migration_20260316_180000_add_subscribers.up,
    down: migration_20260316_180000_add_subscribers.down,
    name: '20260316_180000_add_subscribers'
  },
];
