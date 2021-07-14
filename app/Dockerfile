FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

# tools
COPY ./tools/initdb.ts ./src

RUN npm run build

COPY ./jwtRS256.key build
COPY ./tools/initdb.pgsql build

EXPOSE 8081
CMD [ "node", "build/server.js" ]
