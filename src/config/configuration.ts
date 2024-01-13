import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    database: process.env.DATABASE_NAME || 'kupipodariday',
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    entities: [__dirname + '/../**/*.entity.js'],
    schema: process.env.DATABASE_SCHEMA || 'public',
    synchronize: true
  } as PostgresConnectionOptions
});
