# Use the official Node.js 22 alpine image
FROM node:22-alpine AS base

# Instala pnpm globalmente
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies for this stage
RUN pnpm install --prod

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN pnpm prisma generate

# Build stage
FROM node:22-alpine AS build

# Instala pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies)
RUN pnpm install

# Copy source code and config files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Instala pnpm globalmente
RUN npm install -g pnpm

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy package.json for production dependencies
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN pnpm prisma generate

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Copy the start script
COPY start.sh ./
RUN chmod +x start.sh

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose the port the app runs on
EXPOSE 3333

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application with migrations
CMD ["./start.sh", "node", "dist/server.js"]

