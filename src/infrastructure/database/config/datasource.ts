import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/domain/entities/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/infrastructure/database/migrations/**/*.js'],
    migrationsRun: process.env.NODE_ENV !== 'production',
};

export default new DataSource(options);
