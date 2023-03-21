import "reflect-metadata";
import userResolver from "./api/resolvers/UserResolver";
import express, { Application, Request, Response } from "express";
require("dotenv").config();
import { graphqlHTTP, GraphQLParams, Options } from "express-graphql";
import { pgDataSource, connectRedis } from "./config/database";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { express as voyagerMiddleware } from "graphql-voyager/middleware";
import { contextBuilder } from "./api/middleware/contextBuilder";
import customAuthChecker from "./api/middleware/customAuthChecker";
import { generalErrorType } from "./errConstants";
import { GraphQLError, locatedError } from "graphql";
const cookieParser = require("cookie-parser");

const port: Number = parseInt(process.env.SERVER_PORT as string) || 4000;

const bootstrap = async () => {
  const app: Application = express();

  let schema = await buildSchema({
    resolvers: [userResolver],
    authChecker: customAuthChecker,
  });

  let graphQLOptions = {
    schema: schema,
    graphiql: process.env.NODE_ENV == "development",
  } as any;

  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(
    "/graphql",
    graphqlHTTP(((req: Request, res: Response, _params: GraphQLParams) => {
      return {
        ...graphQLOptions,
        context: contextBuilder(req, res),
        customFormatErrorFn(error) {
          console.log(error);
          return error;
        },
      };
    }) as Options)
  );

  process.env.NODE_ENV == "development" &&
    app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));

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
