import { InteractionType } from '@/domain/entities/interaction.entity';
import LiteratureEntity from '@/domain/entities/literature.entity';
import PericopeEntity from '@/domain/entities/pericope.entity';
import InteractionService from '@/domain/services/interaction.service';
import UserEntity from '@domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import {
    initiateLiteratures,
    registerUser,
} from '@test/_fixtures/mocks/scenarios.mock';
import setup from '@test/_fixtures/setup';
import { DataSource, Repository } from 'typeorm';

describe('Literature services tests', () => {
    let app: INestApplication;
    let interactionService: InteractionService;
    let userRepository: Repository<UserEntity>;
    let literatureRepository: Repository<LiteratureEntity>;
    let pericopeRepository: Repository<PericopeEntity>;
    let dataSource: DataSource;

    beforeAll(async () => {
        app = await setup();
        interactionService = app.get(InteractionService);

        dataSource = app.get('database');
        userRepository = dataSource.getRepository(UserEntity);
        literatureRepository = dataSource.getRepository(LiteratureEntity);
        pericopeRepository = dataSource.getRepository(PericopeEntity);
    });

    describe('Service: registerInteraction', () => {
        let literatures: LiteratureEntity[];
        let user: UserEntity;

        beforeAll(async () => {
            ({ literatures } = await initiateLiteratures(app, 1));
            ({ user } = await registerUser(app));
        });

        it('Should register a view interaction on a literature', async () => {
            let literature = literatures[0];
            await interactionService.createInteraction({
                type: InteractionType.VIEW,
                user: user.id,
                literature: literature.id,
            });

            literature = await literatureRepository.findOne({
                where: { id: literature.id },
                relations: ['interactions'],
            });
            const interactions = literature.interactions.filter(
                (i) => i.type === InteractionType.VIEW,
            );

            expect(interactions?.length).toBe(1);
        });

        it('Should register a like interaction on a literature', async () => {
            let literature = literatures[0];
            await interactionService.createInteraction({
                type: InteractionType.LIKE,
                user: user.id,
                literature: literature.id,
            });

            literature = await literatureRepository.findOne({
                where: { id: literature.id },
                relations: ['interactions'],
            });
            const interactions = literature.interactions.filter(
                (i) => i.type === InteractionType.LIKE,
            );

            expect(interactions?.length).toBe(1);
        });

        it('Should register a view interaction on a pericope', async () => {
            let pericope = literatures[0].pericopes[0];
            await interactionService.createInteraction({
                type: InteractionType.VIEW,
                user: user.id,
                pericope: pericope.id,
            });

            pericope = await pericopeRepository.findOne({
                where: { id: pericope.id },
                relations: ['interactions'],
            });

            const interactions = pericope.interactions.filter(
                (i) => i.type === InteractionType.VIEW,
            );

            expect(interactions?.length).toBe(1);
        });

        it('Should register a like interaction on a pericope', async () => {
            let pericope = literatures[0].pericopes[0];
            await interactionService.createInteraction({
                type: InteractionType.LIKE,
                user: user.id,
                pericope: pericope.id,
            });

            pericope = await pericopeRepository.findOne({
                where: { id: pericope.id },
                relations: ['interactions'],
            });

            const interactions = pericope.interactions.filter(
                (i) => i.type === InteractionType.LIKE,
            );

            expect(interactions?.length).toBe(1);
        });
    });

    afterAll(async () => {
        await userRepository.delete({});
        if (app) app.close();
    });
});
