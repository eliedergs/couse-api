import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import setup from './_fixtures/setup';

describe('App tests', () => {
    describe('Database configurations', () => {
        let app: INestApplication;

        beforeAll(async () => {
            app = await setup();
        });

        it('Whether database is connected', () => {
            const dataSource: DataSource = app.get('database');
            expect(dataSource?.isInitialized).toBe(true);
        });

        afterAll(async () => {
            await app.close();
        });
    });
});
