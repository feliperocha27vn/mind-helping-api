"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_child_process_1 = require("node:child_process");
const node_crypto_1 = require("node:crypto");
function generateDatabaseUrl(schema) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL env variable');
    }
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schema);
    return url.toString();
}
exports.default = {
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        const schema = (0, node_crypto_1.randomUUID)();
        const databaseUrl = generateDatabaseUrl(schema);
        process.env.DATABASE_URL = databaseUrl;
        // Use db push to create the schema but skip client generation
        // Prisma Client should already be generated before running tests (via package.json script)
        (0, node_child_process_1.execSync)('npx prisma db push --force-reset --skip-generate', {
            stdio: 'ignore', // Suppress output to avoid cluttering test results
        });
        return {
            async teardown() {
                // Import prisma here to use the correct instance with the test schema
                const { prisma } = await import('../../src/lib/prisma.js');
                try {
                    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
                }
                catch (error) {
                    // Ignore errors during cleanup
                    console.warn(`Failed to cleanup schema ${schema}:`, error);
                }
                finally {
                    await prisma.$disconnect();
                }
            },
        };
    },
};
