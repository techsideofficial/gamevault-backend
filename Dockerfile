FROM node:20.6-slim AS base
# Default Variables
ENV PUID=1000
ENV PGID=1000
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# Build time variables
## Allow non-root usage
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV SERVER_PORT=8080
VOLUME /files /images /logs /db
# Install pnpm and other needed tools
RUN sed -i -e's/ main/ main non-free non-free-firmware contrib/g' /etc/apt/sources.list.d/debian.sources \ 
    && apt update \
    && apt install -y sudo tzdata curl p7zip-full p7zip-rar postgresql-client \
    && npm i -g pnpm
WORKDIR /app

FROM base AS build
# Copy files only needed for install
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Copy everything for building
COPY . .
RUN pnpm run build

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM base AS release
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
# Chown /app to the original node user (1000)
# As only read is needed this is fine when using --user or PUID
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
# Entry script for providing dynamic env changes like PUID
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE ${SERVER_PORT}/tcp
# Periodic Healthcheck on /api/v1/health
HEALTHCHECK CMD curl -f http://localhost:${SERVER_PORT}/api/health || exit
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD [ "dist/src/main" ]
