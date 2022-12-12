import { EXAMPLE } from '@/application/utils/constants';
import User from '@/domain/interfaces/user';
import UserEntity from '@domain/entities/user.entity';
import UserService from '@domain/services/user.service';
import { INestApplication } from '@nestjs/common';
import { registerUser } from '@test/_fixtures/mocks/scenarios.mock';
import UserMock from '@test/_fixtures/mocks/user.mock';
import setup from '@test/_fixtures/setup';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';

describe('User services tests', () => {
    let app: INestApplication;
    let userService: UserService;

    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let user: User;

    beforeAll(async () => {
        app = await setup();
        dataSource = app.get('database');
        userRepository = dataSource.getRepository(UserEntity);
        userService = app.get(UserService);
    });

    beforeEach(async () => {
        ({ user } = await registerUser(app));
    });

    describe('Service: createUser', () => {
        it('Should create a user successfully', async () => {
            const userDto = UserMock.createUserDto();
            await userService.createUser(userDto);
            const createdUser = await userRepository.findOne({
                where: { email: userDto.email },
            });

            expect(createdUser).toBeDefined();
        });
    });

    describe('Service: findById', () => {
        it('Should find a user by its id', async () => {
            const _user = await userService.findById(user.id);

            expect(_user).toMatchObject(user);
        });
    });

    describe('Service: findByEmail', () => {
        it('Should find a user by its email', async () => {
            const _user = await userService.findByEmail(user.email);

            expect(_user).toMatchObject(user);
        });
    });

    describe('Service: findByFilter', () => {
        it('Should find a user by filter name', async () => {
            const _user = await userService.findByFilter({ name: user.name });

            expect(_user?.length).toBeGreaterThan(0);
            expect(_user[0]).toMatchObject(user);
        });
    });

    describe('Service: updateUser', () => {
        it('Should find a user by its id update its name', async () => {
            const newName = EXAMPLE.NAME();
            await userService.updateUserById(user.id, { name: newName });

            const _user = await userRepository.findOne({
                where: { id: user.id },
            });

            expect(_user.name).toBe(newName);
        });
    });

    describe('Service: updatePassword', () => {
        it('Should update a user password', async () => {
            const newPassword = EXAMPLE.PASSWORD();
            await userService.updatePassword(user.id, newPassword);

            const _user = await userRepository.findOne({
                where: { id: user.id },
            });
            const isValidPassword = await bcrypt.compare(
                newPassword,
                _user.password,
            );

            expect(isValidPassword).toBe(true);
        });
    });

    afterAll(async () => {
        await userRepository.delete({});
        if (app) app.close();
    });
});
