import { DataSource } from 'typeorm';
require('dotenv').config()

const PGDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT as string),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    logging: true,
    maxQueryExecutionTime: 10_000,
    entities: ['../api/entities/*.ts'],
    synchronize: false
})

export default PGDataSource