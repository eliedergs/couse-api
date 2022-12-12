import LiteratureEntity from '@/domain/entities/literature.entity';
import PericopeEntity from '@/domain/entities/pericope.entity';
import UserEntity from '@/domain/entities/user.entity';
import { AuthService } from '@/domain/services/auth.service';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import LiteratureMock from './literature.mock';
import PericopeMock from './pericope.mock';
import UserMock from './user.mock';

export const registerUser = async (app: INestApplication) => {
    const authService = app.get(AuthService);
    const dataSource: DataSource = app.get('database');
    const repository = dataSource.getRepository(UserEntity);

    const userEntity = UserMock.createUserEntity();
    const password = userEntity.password;
    const user = await repository.save(userEntity);

    const { token } = await authService.validateLogin({
        email: user.email,
        password,
    });

    return { user, password, token };
};

export const initiateLiteratures = async (
    app: INestApplication,
    totalLiteratures = 3,
    empty = false,
) => {
    const dataSource: DataSource = app.get('database');
    const literatureRepository = dataSource.getRepository(LiteratureEntity);
    const pericopeRepository = dataSource.getRepository(PericopeEntity);

    const { user, token } = await registerUser(app);

    const createLiteratures = Array.from(
        { length: totalLiteratures },
        async () => {
            const pericopes = !empty
                ? await pericopeRepository.save([
                      PericopeMock.createPericopeEntity({
                          user: user.id,
                          order: 1,
                      }),
                  ])
                : [];

            return await literatureRepository.save(
                LiteratureMock.createLiteratureEntity({
                    user: user.id,
                    pericopes,
                }),
            );
        },
    );

    const literatures = await Promise.all(createLiteratures);

    return { literatures, user, token };
};

export const initiateAndFeedLiteratures = async (
    app: INestApplication,
    totalLiteratures = 3,
    pericopesPerLiterature = 3,
) => {
    const dataSource: DataSource = app.get('database');
    const literatureRepository = dataSource.getRepository(LiteratureEntity);
    const pericopeRepository = dataSource.getRepository(PericopeEntity);

    const { literatures, user, token } = await initiateLiteratures(
        app,
        totalLiteratures,
        true,
    );

    const addPericopes = literatures.map(async (literature) => {
        const pericopes = await pericopeRepository.save(
            Array.from({ length: pericopesPerLiterature }, (_, i) =>
                PericopeMock.createPericopeEntity({
                    user: user.id,
                    order: i,
                }),
            ),
        );
        literature.pericopes = literature.pericopes.concat(pericopes);

        return await literatureRepository.save(literature);
    });

    return {
        literatures: await Promise.all(addPericopes),
        user,
        token,
    };
};
