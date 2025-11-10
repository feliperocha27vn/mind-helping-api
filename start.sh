#!/bin/sh
set -e

# Timeout for migrations to prevent hanging
MIGRATION_TIMEOUT=${MIGRATION_TIMEOUT:-120}

echo "Running Prisma migrations (timeout: ${MIGRATION_TIMEOUT}s)..."
if timeout "$MIGRATION_TIMEOUT" pnpm prisma migrate deploy; then
  echo "✓ Migrations completed successfully"
else
  echo "⚠ Migrations timed out or failed, but attempting to start application"
fi

echo "Starting the application..."
exec "$@"