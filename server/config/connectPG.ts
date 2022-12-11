import { DataSource } from 'typeorm';
require('dotenv').config()

const pgDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    logging: true,
    maxQueryExecutionTime: 10_000,
    entities: ['server/api/entities/*.ts'],
    synchronize: false,
    migrations: ['server/migrations/*.ts']
})

export default pgDataSource