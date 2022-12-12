import LiteratureEntity from '@/domain/entities/literature.entity';
import PericopeEntity from '@/domain/entities/pericope.entity';
import { PericopeType } from '@/domain/interfaces/literature';
import PericopeService from '@/domain/services/pericope.service';
import UserEntity from '@domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import PericopeMock from '@test/_fixtures/mocks/pericope.mock';
import {
    initiateAndFeedLiteratures,
    initiateLiteratures,
    registerUser,
} from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import { DataSource, Repository } from 'typeorm';

describe('Pericope services tests', () => {
    let app: INestApplication;
    let pericopeService: PericopeService;

    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let literatureRepository: Repository<LiteratureEntity>;
    let pericopeRepository: Repository<PericopeEntity>;

    beforeAll(async () => {
        app = await setup();
        dataSource = app.get('database');
        pericopeService = app.get(PericopeService);

        userRepository = dataSource.getRepository(UserEntity);
        literatureRepository = dataSource.getRepository(LiteratureEntity);
        pericopeRepository = dataSource.getRepository(PericopeEntity);
    });

    describe('Service: createPericope', () => {
        let user: UserEntity;
        let literatures: LiteratureEntity[] = [];

        beforeAll(async () => {
            ({ user } = await registerUser(app));
            ({ literatures } = await initiateLiteratures(app));
        });

        it('Should create a pericope adding it to a literature', async () => {
            const pericopeDto = PericopeMock.createPericopeDto({
                literature: literatures[0].id,
                user: user.id,
            });
            const pericope = await pericopeService.createPericope(pericopeDto);

            expect(pericope).toMatchObject(pericopeDto);
        });

        afterAll(async () => await userRepository.delete({}));
    });

    describe('Service: findPericopeById', () => {
        let literatures: LiteratureEntity[] = [];

        beforeAll(async () => {
            ({ literatures } = await initiateLiteratures(app));
        });

        it('Should get a pericope by its id', async () => {
            const pericopeToSearch = literatures[0].pericopes[0];
            const _pericope = await pericopeService.findPericopeById(
                pericopeToSearch.id,
            );

            expect(_pericope.id).toBe(pericopeToSearch.id);
        });

        afterAll(async () => await userRepository.delete({}));
    });

    describe('Service: findPericopesByUser', () => {
        let user: UserEntity;
        let literatures: LiteratureEntity[] = [];
        let totalPericopes = 0;

        beforeAll(async () => {
            ({ literatures, user } = await initiateLiteratures(app));

            totalPericopes = literatures.reduce(
                (acum, current) => acum + current.pericopes.length,
                0,
            );
        });

        it('Should get all pericopes created by a given user', async () => {
            const _pericopes = await pericopeService.findPericopesByUser(
                user.id,
            );

            expect(_pericopes.length).toBe(totalPericopes);
            expect(_pericopes[0].user).toBe(user.id);
        });

        afterAll(async () => await userRepository.delete({}));
    });

    describe('Service: findPericopesByLiterature', () => {
        let literature: LiteratureEntity;

        beforeAll(async () => {
            const { literatures } = await initiateAndFeedLiteratures(app);
            literature = literatures[0];
        });

        it('Should get all pericopes of a literature', async () => {
            const _pericopes = await pericopeService.findPericopesByLiterature(
                literature.id,
            );

            expect(_pericopes.length).toBe(literature.pericopes.length);
        });

        it('Should get timeline of a literature ', async () => {
            const _pericopes = await pericopeService.findPericopesByLiterature(
                literature.id,
                { pericopeType: PericopeType.TIMELINE },
            );

            expect(_pericopes.length).toBe(literature.pericopes.length - 1);
        });

        it('Should get only drafts of a literature ', async () => {
            const _pericopes = await pericopeService.findPericopesByLiterature(
                literature.id,
                { pericopeType: PericopeType.DRAFT },
            );

            expect(_pericopes.length).toBe(1);
        });

        afterAll(async () => await literatureRepository.delete({}));
    });

    describe('Service: updatePericope', () => {
        let literature: LiteratureEntity;

        beforeAll(async () => {
            const { literatures } = await initiateAndFeedLiteratures(app, 1);
            literature = literatures[0];
        });

        it('Should update the order of a pericope', async () => {
            await pericopeService.addPericopeToTimeline(
                literature.pericopes[0].id,
            );
            const pericope = await pericopeRepository.findOne({
                where: { id: literature.pericopes[0].id },
            });

            const lastIndex = literature.pericopes.filter(
                (p) => p.order > 0,
            ).length;

            expect(pericope.order).toBe(lastIndex + 1);
        });

        afterAll(async () => await literatureRepository.delete({}));
    });

    describe('Service: deletePericope', () => {
        let literature: LiteratureEntity;

        beforeAll(async () => {
            const { literatures } = await initiateAndFeedLiteratures(app, 1);
            literature = literatures[0];
        });

        it('Should delete a draft pericope from a literature', async () => {
            const pericopeToRemove = literature.pericopes[0].id;
            await pericopeService.removePericopeById(pericopeToRemove);
            const pericope = await pericopeRepository.findOne({
                where: { id: pericopeToRemove },
            });

            expect(pericope).toBe(null);
        });

        afterAll(async () => await literatureRepository.delete({}));
    });

    afterAll(async () => {
        await userRepository.delete({});
        if (app) app.close();
    });
});
