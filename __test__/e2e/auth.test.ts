import CreateUserDto from '@/application/dtos/user/create-user.dto';
import UserEntity from '@/domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import AuthMock from '@test/_fixtures/mocks/auth.mock';
import { registerUser } from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import * as supertest from 'supertest';
import { DataSource, Repository } from 'typeorm';

describe('Auth endpoints tests', () => {
    let app: INestApplication;
    let server: any;
    let api: supertest.SuperTest<supertest.Test>;
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;

    beforeAll(async () => {
        app = await setup();
        server = app.getHttpServer();
        api = supertest(server);
        dataSource = app.get('database');
        userRepository = dataSource.getRepository(UserEntity);
    });

    describe('POST', () => {
        describe('[/auth/register]', () => {
            let credentials: CreateUserDto;

            beforeAll(async () => {
                credentials = AuthMock.createCredentialsDto();
            });

            it('Should send credentials and return 201 with access token', async () => {
                const { status, body: token } = await api
                    .post('/auth/register')
                    .send(credentials);

                expect(status).toBe(201);
                expect(token).toBeDefined();
            });

            afterAll(async () => {
                await userRepository.delete({});
            });
        });

        describe('[/auth/login]', () => {
            let user: UserEntity;
            let password: string;

            beforeAll(async () => {
                ({ user, password } = await registerUser(app));
            });

            it('Should send login credentials and return 200 with access token', async () => {
                const { status, body: token } = await api
                    .post('/auth/login')
                    .send({
                        email: user.email,
                        password,
                    });

                expect(status).toBe(200);
                expect(token).toBeDefined();
            });

            afterAll(async () => {
                await userRepository.delete(user.id);
            });
        });
    });

    afterAll(async () => {
        if (app) await app.close();
        if (server) server.close();
    });
});
