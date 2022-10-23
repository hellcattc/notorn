export const options = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT as string),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    logging: true,
    maxQueryExecutionTime: 10_000,
    entities: ['server/api/entities/*.ts'],
    synchronize: false
}