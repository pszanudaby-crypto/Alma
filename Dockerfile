FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=80
ENV MEDIA_DIR=/data/uploads

EXPOSE 80

CMD ["sh", "-c", "npm run migrate && npm start"]
