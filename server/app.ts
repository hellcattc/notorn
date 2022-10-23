import userResolver from './api/schema/userResolver';
import express, { Application } from 'express';
require('dotenv').config();
import { graphqlHTTP } from 'express-graphql';
import PGDataSource from "./config/database";
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import 'reflect-metadata'

const port: Number = parseInt(process.env.PORT as string) || 5000

const bootstrap = async () => {
    const app: Application = express();

    let schema = await buildSchema({
        resolvers: [userResolver]
    })

    app.use(cors())

    app.use('/graphql', graphqlHTTP({
        schema, 
        graphiql: true
    }))

    app.listen(3000, () => console.log(`Server port ${3000}`));

    PGDataSource
        .initialize()
        .then(() => {
            console.log("Succesfully initialized DB")
            console.log(PGDataSource.options)
        })
        .catch((err) => {
            console.log("Error initializing DB: %d", err )
        })
}

export default bootstrap();