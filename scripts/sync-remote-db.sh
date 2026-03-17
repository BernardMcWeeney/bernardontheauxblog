#!/bin/bash
set -e

# Sync remote D1 database to local
# Usage: npm run db:sync
#
# How it works:
# 1. Exports data-only from remote (no schema/indexes)
# 2. Boots Payload briefly to create clean local schema
# 3. Imports remote data into the local tables

DB_NAME="d1-bernardontheauxblog"
DUMP_FILE="dump-data.sql"
CLEAN_FILE="dump-data-clean.sql"
D1_DIR=".wrangler/state/v3/d1"
PORT=3399

echo "==> Cleaning local state..."
rm -rf "$D1_DIR" .next

echo "==> Exporting data from remote (no schema)..."
npx wrangler d1 export "$DB_NAME" --remote --no-schema --output="$DUMP_FILE"

echo "==> Filtering out internal tables..."
grep -v 'sqlite_stat' "$DUMP_FILE" | grep -v 'payload_migrations' > "$CLEAN_FILE"

echo "==> Booting dev server to create schema..."
npx cross-env NODE_OPTIONS=--no-deprecation next dev --port $PORT &
DEV_PID=$!

for i in $(seq 1 60); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null)
  if [ "$CODE" != "000" ]; then
    echo "    Schema created (HTTP $CODE)"
    break
  fi
  sleep 1
done

sleep 2
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null

echo "==> Clearing empty tables..."
TABLES=$(npx wrangler d1 execute "$DB_NAME" --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'sqlite_%' AND name != 'payload_migrations';" --json 2>/dev/null | python3 -c "import json,sys; [print(r['name']) for r in json.load(sys.stdin)[0]['results']]")

DELETE_CMD="PRAGMA defer_foreign_keys=TRUE;"
for t in $TABLES; do
  DELETE_CMD="$DELETE_CMD DELETE FROM \"$t\";"
done
npx wrangler d1 execute "$DB_NAME" --local --command="$DELETE_CMD" > /dev/null 2>&1

echo "==> Importing remote data..."
npx wrangler d1 execute "$DB_NAME" --local --file="$CLEAN_FILE"

echo "==> Cleaning up..."
rm -f "$DUMP_FILE" "$CLEAN_FILE"

echo "==> Done! Run 'npm run dev' to start."
