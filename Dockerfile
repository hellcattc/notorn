FROM node:19-alpine
WORKDIR /server
COPY . .
RUN npm ci
EXPOSE 4000