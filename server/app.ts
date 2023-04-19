import { IUserContext } from "./api/context/contextType";
import "reflect-metadata";
import userResolver from "./api/resolvers/UserResolver";
import express, { Application, Request, Response } from "express";
require("dotenv").config();
import { pgDataSource, connectRedis } from "./config/database";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { contextBuilder } from "./api/middleware/contextBuilder";
import customAuthChecker from "./api/middleware/customAuthChecker";
const cookieParser = require("cookie-parser");
import resolversLogger from "./api/middleware/resolversLogger";
import { ApolloServer } from "@apollo/server";
import { json } from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";

const port: Number = parseInt(process.env.SERVER_PORT as string) || 4000;

const bootstrap = async () => {
  const app: Application = express();

  let schema = await buildSchema({
    resolvers: [userResolver],
    globalMiddlewares: [resolversLogger],
  });

  const server = new ApolloServer<IUserContext>({
    schema,
  });

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(json());

  app.use(cookieParser());

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req, res }) => contextBuilder(req, res),
    })
  );

  app.listen(port, () => console.log(`Server port ${port}`));

  try {
    pgDataSource
      .initialize()
      .then(() => {
        console.log("Succesfully initialized DB");
      })
      .catch((err) => {
        console.log("Error initializing DB: %d", err);
      });
  } catch (err) {
    console.log(err);
  }

  connectRedis();
};

export default bootstrap();
