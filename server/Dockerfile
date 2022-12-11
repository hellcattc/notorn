FROM node:19-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
CMD ["npm", "run", "dev"]
