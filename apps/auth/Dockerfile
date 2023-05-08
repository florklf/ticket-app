# builder stage named "deps"
FROM docker.io/node:lts-alpine as deps

COPY dist/apps/auth/package*.json ./

# install extracted deps
RUN npm install --only=production

# install additional deps
RUN npm install reflect-metadata tslib rxjs sqlite3 mysql2 pg

# runner stage
FROM docker.io/node:lts-alpine as runner

# pull in packages from builder stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json

# copy local, compiled app
COPY dist/apps/auth .
RUN chown -R node:node .
USER node

CMD ["dumb-init", "node", "main.js"]