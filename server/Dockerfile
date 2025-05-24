FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY server/ .
COPY shared ./shared

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]