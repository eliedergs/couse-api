import LiteraturePericopesInteractionCountingDto from '@/application/dtos/literature/literature-pericopes-interactions-counting.dto';
import LiteraturePreviewDto from '@/application/dtos/literature/literature-preview.dto';
import { InteractionType } from '@/domain/entities/interaction.entity';
import LiteratureEntity from '@/domain/entities/literature.entity';
import UserEntity from '@/domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import LiteratureMock from '@test/_fixtures/mocks/literature.mock';
import {
    initiateAndFeedLiteratures,
    initiateLiteratures,
    registerUser,
} from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import { countDrafts, countTimeline } from '@test/_fixtures/utils';
import { assertLiterature } from '@test/_fixtures/utils/asserts';
import * as supertest from 'supertest';
import { DataSource, Repository } from 'typeorm';

describe('Literature endpoints tests', () => {
    let app: INestApplication;
    let server: any;
    let api: supertest.SuperTest<supertest.Test>;
    let userRepository: Repository<UserEntity>;
    let literatureRepository: Repository<LiteratureEntity>;
    let dataSource: DataSource;
    let token = '';

    beforeAll(async () => {
        app = await setup();
        server = app.getHttpServer();
        api = supertest(server);
        dataSource = app.get('database');
        userRepository = dataSource.getRepository(UserEntity);
        literatureRepository = dataSource.getRepository(LiteratureEntity);

        ({ token } = await registerUser(app));
    });

    describe('POST', () => {
        describe('[/literatures]', () => {
            it('Should create a literature and return 201', async () => {
                const literatureDto = LiteratureMock.createLiteratureDto();

                const { status, body } = await api
                    .post('/literatures')
                    .set('Authorization', `Bearer ${token}`)
                    .send(literatureDto);

                expect(status).toBe(201);
                expect(body).toBeDefined();
            });
        });

        afterEach(async () => {
            await literatureRepository.delete({});
        });
    });

    describe('GET', () => {
        describe('[/literatures]', () => {
            let literatures: LiteratureEntity[] = [];
            let user: UserEntity;

            beforeAll(async () => {
                ({ literatures, user } = await initiateAndFeedLiteratures(app));
            });

            it('Should get all literatures with all its pericopes and counted interactions', async () => {
                type Response = {
                    status: number;
                    body: LiteraturePreviewDto[];
                };

                const { status, body }: Response = await api
                    .get('/literatures')
                    .set('Authorization', `Bearer ${token}`);

                expect(status).toBe(200);
                body.forEach((literatureDto) => {
                    const literature = literatures.find(
                        (l) => l.id === literatureDto.id,
                    );
                    const timelineCount = countTimeline(literature?.pericopes);
                    const draftsCount = countDrafts(literature?.pericopes);

                    expect(literatureDto.preview).toBeDefined();
                    expect(literatureDto.timeline).toBe(timelineCount);
                    expect(literatureDto.drafts).toBe(draftsCount);
                });
            });

            afterAll(async () => {
                await userRepository.delete(user.id);
            });
        });

        describe('[/literatures/self]', () => {
            let literatures: LiteratureEntity[] = [];
            let user: UserEntity;

            beforeAll(async () => {
                ({ literatures, user } = await initiateAndFeedLiteratures(
                    app,
                    3,
                    3,
                ));
            });

            it('Should get all user literatures with just preview of the initial pericope and counted interactions', async () => {
                const {
                    status,
                    body,
                }: {
                    status: number;
                    body: LiteraturePreviewDto[];
                } = await api
                    .get('/literatures/self')
                    .set('Authorization', `Bearer ${token}`);

                expect(status).toBe(200);
                body.forEach((literatureDto) => {
                    const literature = literatures.find(
                        (l) => l.id === literatureDto.id,
                    );
                    const timelineCount = countTimeline(literature?.pericopes);
                    const draftsCount = countDrafts(literature?.pericopes);

                    expect(literatureDto.preview).toBeDefined();
                    expect(literatureDto.timeline).toBe(timelineCount);
                    expect(literatureDto.drafts).toBe(draftsCount);
                });
            });

            afterAll(async () => {
                await userRepository.delete(user.id);
            });
        });

        describe('[/literatures/:id]', () => {
            let literatures: LiteratureEntity[] = [];
            let user: UserEntity;

            beforeAll(async () => {
                ({ literatures, user } = await initiateAndFeedLiteratures(app));
            });

            it('Should get a literature by id with all pericopes and counted interactions', async () => {
                type Response = {
                    status: number;
                    body: LiteraturePericopesInteractionCountingDto;
                };

                const { status, body }: Response = await api
                    .get(`/literatures/${literatures[0].id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(status).toBe(200);
                assertLiterature(body, literatures[0]);
            });

            afterAll(async () => {
                await userRepository.delete(user.id);
            });
        });
    });

    describe('PATCH', () => {
        let literature: LiteratureEntity;

        beforeAll(async () => {
            const { literatures } = await initiateLiteratures(app, 1);
            literature = literatures[0];
        });

        describe('[/literatures/view/:id]', () => {
            it('Should register a view interaction to a literature and return 200', async () => {
                const { status } = await api
                    .patch(`/literatures/view/${literature.id}`)
                    .set('Authorization', `Bearer ${token}`);

                literature = await literatureRepository.findOne({
                    where: { id: literature.id },
                    relations: ['interactions'],
                });

                const interactions = (literature?.interactions || []).filter(
                    (i) => i.type === InteractionType.VIEW,
                );

                expect(status).toBe(200);
                expect(interactions.length).toBe(1);
            });
        });

        describe('[/literatures/like/:id]', () => {
            it('Should register a like interaction to a literature and return 200', async () => {
                const { status } = await api
                    .patch(`/literatures/like/${literature.id}`)
                    .set('Authorization', `Bearer ${token}`);

                literature = await literatureRepository.findOne({
                    where: { id: literature.id },
                    relations: ['interactions'],
                });

                const interactions = (literature?.interactions || []).filter(
                    (i) => i.type === InteractionType.LIKE,
                );

                expect(status).toBe(200);
                expect(interactions.length).toBe(1);
            });
        });

        afterAll(async () => {
            await literatureRepository.delete({});
        });
    });

    afterAll(async () => {
        await userRepository.delete({});
        if (app) await app.close();
        if (server) server.close();
    });
});
