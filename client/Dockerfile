FROM node:19-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./

RUN npm install

RUN chown -R node:node /app

# RUN chmod -R 777  /app/node_modules

# RUN mkdir app/node_modules/.vite \
#     && chown -R node:node /app/node_modules/.vite

USER node

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]