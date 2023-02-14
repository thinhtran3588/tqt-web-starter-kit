# use build image to optimize storage
FROM node:18-alpine as BUILD_IMAGE
WORKDIR /app

# restore pagackage first for better caching
COPY package.json package-lock.json ./
RUN npm i

COPY .env ./

COPY . .

# build app
RUN npm run build

# validate app
RUN npm run validate

# remove dev packages
RUN npm prune --omit=dev

# copy to production image
FROM node:18-alpine
WORKDIR /app

# make a dedicated node user for security
RUN chown -R node:node /app
USER node

# copy from build image
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/next-env.d.ts ./next-env.d.ts
COPY --from=BUILD_IMAGE /app/next.config.js ./next.config.js
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/.next ./.next

# run app
EXPOSE 3000
CMD npm start
