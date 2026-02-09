# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate


# Build NestJS
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine

WORKDIR /app

# Copy only what we need
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
    