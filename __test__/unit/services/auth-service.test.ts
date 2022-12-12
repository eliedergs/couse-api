import AuthDto from '@/application/dtos/auth/auth.dto';
import UserEntity from '@domain/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { INestApplication } from '@nestjs/common';
import AuthMock from '@test/_fixtures/mocks/auth.mock';
import { registerUser } from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import { DataSource, Repository } from 'typeorm';

describe('Authentication service tests', () => {
    let app: INestApplication;
    let authService: AuthService;
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;

    beforeAll(async () => {
        app = await setup();
        dataSource = app.get('database');
        authService = app.get(AuthService);
        userRepository = dataSource.getRepository(UserEntity);
    });

    describe('Service: registerUser', () => {
        it('Should register a user successfully and return access token', async () => {
            const credentials = AuthMock.createCredentialsDto();
            const token = await authService.registerUser(credentials);

            expect(token).toBeDefined();
        });

        afterAll(async () => await userRepository.delete({}));
    });

    describe('Service: validateLogin', () => {
        let user: UserEntity;
        let password = '';

        beforeAll(async () => ({ user, password } = await registerUser(app)));

        it('Should send credentials and return access token', async () => {
            const credentials: AuthDto = {
                email: user.email,
                password,
            };

            const { id, token } = await authService.validateLogin(credentials);

            expect(token).toBeDefined();
            expect(id).toBeDefined();
        });

        afterAll(async () => await userRepository.delete({}));
    });

    afterAll(async () => {
        if (app) app.close();
    });
});
