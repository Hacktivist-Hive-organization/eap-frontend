# --- STAGE 1: Build (The "Builder" stage) ---
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Install dependencies first
# (If package.json hasn't changed, Docker will skip this slow step on the next build)
COPY package*.json ./
RUN npm install

# 2. Copy the source code into the container
COPY . .

# 3. Build the static files
# This runs "tsc -b && vite build" from package.json
RUN npm run build

# --- STAGE 2: Serve ---
FROM nginx:stable-alpine

# 4. Copy the static 'dist' folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# 5. REPLACE the main Nginx config with our custom one
# This avoids the "directive is not allowed here" error
COPY nginx.conf /etc/nginx/nginx.conf

# 6. Open ports for both HTTP and HTTPS
EXPOSE 80 443

# 7. Start Nginx in the foreground so the container stays alive
CMD ["nginx", "-g", "daemon off;"]
