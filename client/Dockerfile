FROM node:latest
WORKDIR /usr/app
COPY package*.json tsconfig.json ./

RUN npm install

RUN chown -R node:node /usr/app

USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]