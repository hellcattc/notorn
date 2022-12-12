FROM node:19-alpine
WORKDIR /app
COPY package*.json tsconfig.json nodemon.json ./
RUN npm install
# ENTRYPOINT ["nodemon", "/app/app.ts"]  
CMD ["npm", "run", "dev"]
# CMD ["node", "app.ts"]
