FROM node:alpine
WORKDIR /usr/app
COPY package*.json tsconfig.json nodemon.json ./
RUN npm install
# ENTRYPOINT ["nodemon", "/app/app.ts"]  
CMD ["npm", "run", "dev"]
# CMD ["node", "app.ts"]
