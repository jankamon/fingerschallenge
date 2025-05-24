FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
WORKDIR /app/server
RUN npm install

WORKDIR /app
COPY server/ ./server/
COPY shared/ ./shared/

WORKDIR /app/server
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]