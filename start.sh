#!/bin/sh
set -e

echo "Running Prisma migrations..."
pnpm prisma migrate deploy

echo "Starting the application..."
exec "$@"