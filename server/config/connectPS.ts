import { DataSource } from 'typeorm';
require('dotenv').config()

const pgDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: parseInt(process.env.PGPORT as string),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    logging: true,
    maxQueryExecutionTime: 10_000,
    entities: ['server/api/entities/*.ts'],
    synchronize: false,
    migrations: ['server/migrations/*.ts']
})

export default pgDataSource