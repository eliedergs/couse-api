import { EXAMPLE } from '@/application/utils/constants';
import { InteractionType } from '@/domain/entities/interaction.entity';
import LiteratureEntity from '@/domain/entities/literature.entity';
import PericopeEntity from '@/domain/entities/pericope.entity';
import UserEntity from '@/domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import {
    initiateAndFeedLiteratures,
    initiateLiteratures,
    registerUser,
} from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import * as supertest from 'supertest';
import { DataSource, Repository } from 'typeorm';

describe('Pericope endpoints tests', () => {
    let app: INestApplication;
    let server: any;
    let api: supertest.SuperTest<supertest.Test>;
    let userRepository: Repository<UserEntity>;
    let pericopeRepository: Repository<PericopeEntity>;
    let dataSource: DataSource;
    let token = '';

    beforeAll(async () => {
        app = await setup();
        server = app.getHttpServer();
        api = supertest(server);
        dataSource = app.get('database');
        userRepository = dataSource.getRepository(UserEntity);
        pericopeRepository = dataSource.getRepository(PericopeEntity);

        ({ token } = await registerUser(app));
    });

    describe('POST', () => {
        let literatures: LiteratureEntity[];
        let user: UserEntity;

        beforeAll(async () => {
            ({ literatures, user } = await initiateLiteratures(app));
        });

        describe('[/pericopes]', () => {
            it('Should create a pericope and add it to a literature as a draft', async () => {
                const { status, body } = await api
                    .post(`/pericopes`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        text: EXAMPLE.GENERIC_TEXT(),
                        literature: literatures[0].id,
                    });

                expect(status).toBe(201);
                expect(body?.id).toBeDefined();
            });
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    describe('GET', () => {
        let literatures: LiteratureEntity[];
        let user: UserEntity;
        let token = '';

        beforeAll(async () => {
            ({ literatures, user, token } = await initiateAndFeedLiteratures(
                app,
            ));
        });

        describe('GET - [/pericopes/:id]', () => {
            it('Should get a pericope by its id', async () => {
                const { status, body } = await api
                    .get(`/pericopes/${literatures[0].pericopes[0].id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(status).toBe(200);
                expect(body?.id).toBeDefined();
                expect(body?.id).toEqual(literatures[0].pericopes[0].id);
            });
        });

        describe('[/pericopes/self]', () => {
            it('Should get all pericopes from logged user', async () => {
                const { status, body } = await api
                    .get(`/pericopes/self`)
                    .set('Authorization', `Bearer ${token}`);

                const pericopes = literatures.reduce(
                    (acum, current) => [...acum, ...current.pericopes],
                    [],
                );

                expect(status).toBe(200);
                expect(body?.length).toBe(pericopes.length);
            });
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    describe('PATCH', () => {
        let literatures: LiteratureEntity[];
        let user: UserEntity;

        beforeAll(async () => {
            ({ literatures, user } = await initiateAndFeedLiteratures(app, 1));
        });

        describe('[/pericopes/timeline/:id]', () => {
            let literature: LiteratureEntity;

            beforeAll(async () => {
                literature = literatures[0];
            });

            it('Should add pericope to literature timeline', async () => {
                const { status } = await api
                    .patch(`/pericopes/timeline/${literature.pericopes[0].id}`)
                    .set('Authorization', `Bearer ${token}`);

                const lastIndex = literature.pericopes.filter(
                    (p) => p.order > 0,
                ).length;
                const pericope = await pericopeRepository.findOne({
                    where: { id: literature.pericopes[0].id },
                });

                expect(status).toBe(200);
                expect(pericope.order).toBe(lastIndex + 1);
            });
        });

        describe('[/pericopes/view/:id]', () => {
            let literature: LiteratureEntity;

            beforeAll(async () => {
                literature = literatures[0];
            });

            it('Should register a view interaction to a pericope and return 200', async () => {
                let pericope = literature.pericopes[0];

                const { status } = await api
                    .patch(`/pericopes/view/${pericope.id}`)
                    .set('Authorization', `Bearer ${token}`);

                pericope = await pericopeRepository.findOne({
                    where: { id: pericope.id },
                    relations: ['interactions'],
                });

                const interactions = (pericope?.interactions || []).filter(
                    (i) => i.type === InteractionType.VIEW,
                );

                expect(status).toBe(200);
                expect(interactions.length).toBe(1);
            });
        });

        describe('[/pericopes/like/:id]', () => {
            let literature: LiteratureEntity;

            beforeAll(async () => {
                literature = literatures[0];
            });

            it('Should register a like interaction to a pericope and return 200', async () => {
                let pericope = literature.pericopes[0];

                const { status, ...response } = await supertest(
                    app.getHttpServer(),
                )
                    .patch(`/pericopes/like/${pericope.id}`)
                    .set('Authorization', `Bearer ${token}`);

                pericope = await pericopeRepository.findOne({
                    where: { id: pericope.id },
                    relations: ['interactions'],
                });

                const interactions = (pericope?.interactions || []).filter(
                    (i) => i.type === InteractionType.LIKE,
                );

                expect(status).toBe(200);
                expect(interactions.length).toBe(1);
            });
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    describe('DELETE', () => {
        let literatures: LiteratureEntity[];
        let user: UserEntity;

        beforeAll(async () => {
            ({ literatures, user } = await initiateAndFeedLiteratures(app));
        });

        describe('DELETE - [/pericopes/:id]', () => {
            it('Should delete a pericope draft', async () => {
                const { status } = await api
                    .delete(`/pericopes/${literatures[0].pericopes[0].id}`)
                    .set('Authorization', `Bearer ${token}`);

                const pericope = await pericopeRepository.findOne({
                    where: { id: literatures[0].pericopes[0].id },
                });

                expect(status).toBe(204);
                expect(pericope).toBe(null);
            });
        });

        afterAll(async () => await userRepository.delete(user.id));
    });

    afterAll(async () => {
        if (app) await app.close();
        if (server) server.close();
    });
});
