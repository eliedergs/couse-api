import FilterLiteratureDto from '@/application/dtos/literature/filter.dto';
import LiteratureEntity from '@/domain/entities/literature.entity';
import LiteratureService from '@/domain/services/literature.service';
import UserEntity from '@domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import LiteratureMock from '@test/_fixtures/mocks/literature.mock';
import {
    initiateLiteratures,
    registerUser,
} from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import { DataSource, Repository } from 'typeorm';

describe('Literature services tests', () => {
    let app: INestApplication;
    let literatureService: LiteratureService;
    let userRepository: Repository<UserEntity>;
    let dataSource: DataSource;

    beforeAll(async () => {
        app = await setup();
        literatureService = app.get(LiteratureService);

        dataSource = app.get('database');
        userRepository = dataSource.getRepository(UserEntity);
    });

    describe('Service: createLiterature', () => {
        let user: UserEntity;

        beforeAll(async () => {
            ({ user } = await registerUser(app));
        });

        it('Should initiate a literature', async () => {
            const literatureDto = LiteratureMock.createLiteratureDto();
            const createdLiterature = await literatureService.createLiterature(
                literatureDto,
                user.id,
            );

            expect(createdLiterature).toMatchObject(literatureDto);
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    describe('Service: findLiteraturesByFilter', () => {
        let literatures: LiteratureEntity[] = [];
        let user: UserEntity;

        beforeAll(async () => {
            ({ literatures, user } = await initiateLiteratures(app));
        });

        it('Should list all initiated literatures', async () => {
            const _literatures =
                await literatureService.findLiteraturesByFilter();

            expect(_literatures.length).toBe(literatures.length);
        });

        it('Should list literatures by title', async () => {
            const _literatures =
                await literatureService.findLiteraturesByFilter(
                    FilterLiteratureDto.toDto({ title: literatures[0].title }),
                );

            expect(_literatures.length).toBeGreaterThan(0);
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    describe('Service: findLiteraturesByUser', () => {
        let literatures: LiteratureEntity[] = [];
        let user: UserEntity;

        beforeAll(
            async () =>
                ({ literatures, user } = await initiateLiteratures(app)),
        );

        it('Should list all literatures from a user', async () => {
            const _literatures = await literatureService.findLiteraturesByUser(
                user.id,
            );

            expect(_literatures.length).toBe(literatures.length);
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    afterAll(async () => {
        if (app) app.close();
    });
});
