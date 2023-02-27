import { DataSource } from 'typeorm';
require('dotenv').config()

const pgDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    logging: true,
    maxQueryExecutionTime: 10_000,
    entities: [__dirname + '/../api/entities/*.{js,ts}'],
    synchronize: false,
    migrations: [__dirname + '/../migrations/**/*.ts'],
    migrationsRun: true
})

export default pgDataSource