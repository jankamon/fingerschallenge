FROM node:22-alpine

WORKDIR /app

COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client/ .
COPY shared /shared

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]