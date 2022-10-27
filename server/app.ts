import userResolver from './api/schema/UserResolver';
import express, { Application, Request, Response } from 'express';
require('dotenv').config();
import { graphqlHTTP, GraphQLParams, Options } from 'express-graphql';
import { pgDataSource, connectRedis } from "./config/database";
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import 'reflect-metadata'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'
import { contextBuilder, customAuthChecker } from './utils/authTools'

const port: Number = parseInt(process.env.PORT as string) || 5000

const bootstrap = async () => {
    const app: Application = express();

    let schema = await buildSchema({
        resolvers: [userResolver],
        authChecker: customAuthChecker
    })

    let graphQLOptions = {
        schema: schema,
        graphiql: process.env.NODE_ENV == 'development',
    } as any

    app.use(cors())

    app.use('/graphql', 
        graphqlHTTP(((req: Request, res: Response, _params: GraphQLParams) => {
            return { 
                ...graphQLOptions,
                context: contextBuilder(req, res)
            }
        }) as Options)
    )

    process.env.NODE_ENV == 'development' && app.use('/voyager', voyagerMiddleware({endpointUrl: '/graphql'}));

    app.listen(port, () => console.log(`Server port ${port}`));

    pgDataSource
        .initialize()
        .then(() => {
            console.log("Succesfully initialized DB")
        })
        .catch((err) => {
            console.log("Error initializing DB: %d", err )
        })

    connectRedis()
}

export default bootstrap();