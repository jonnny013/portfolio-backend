# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build the app
RUN npm run build
# expects output: /app/build/main.js


# ---- Runtime stage ----
FROM node:20-alpine

WORKDIR /app

# Copy only what we need from the builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install only production deps (if any)
RUN npm ci --omit=dev

EXPOSE 3001

CMD ["node", "build/main.js"]
