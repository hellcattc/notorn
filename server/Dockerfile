FROM node:19-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
ENTRYPOINT ["nodemon", "/app/app.ts"]  
CMD ["npm", "run", "dev"]
