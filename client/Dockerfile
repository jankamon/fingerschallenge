FROM node:22-alpine

WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
WORKDIR /app/client
RUN npm install

WORKDIR /app
COPY client/ ./client/
COPY shared/ ./shared/

WORKDIR /app/client
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]