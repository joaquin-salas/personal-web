# Production image: nginx serving the static build. No Node.js or source code in the final image.

# Build stage. It runs on the build machine's own CPU even when building for another architecture:
# its output is plain HTML/CSS, the same on any CPU.
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app
# Corepack installs the pnpm version pinned in package.json's "packageManager".
RUN corepack enable
# Dependencies first, so this layer is reused until package.json or the lockfile change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Runtime stage: nginx as a non-root user, listening on 8080.
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
