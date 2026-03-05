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
# to Nginx's default public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# 5. Copy your custom Nginx config to the correct location
# inside the container to handle the /api proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 6. Nginx inside the container listens on port 80 by default.
# We will map this to 8080 on your Mac when we 'docker run'.
EXPOSE 80

# 7. Start Nginx in the foreground so the container stays alive
CMD ["nginx", "-g", "daemon off;"]
