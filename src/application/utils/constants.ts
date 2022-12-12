import { Genre } from '@/domain/entities/literature.entity';
import faker from '@faker-js/faker';

export const FORMAT = {
    DATETIME: 'dd/MM/yyyy - HH:mm',
    DATE: 'dd/MM/yyyy',
};

export const EXAMPLE = {
    UUID: 'f8f03dee-dc6a-460e-96de-5b7e2c13ffc5',
    TOKEN: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF5bGFuQGJvc2Nhcmluby5jb20iLCJwYXNzd29yZCI6InlhMGdzcWh5NHd6dnV2YjQifQ.yN_8-Mge9mFgsnYHnPEh_ZzNP7YKvSbQ3Alug9HMCsM`,
    NAME: faker.name.firstName,
    EMAIL: faker.internet.email,
    URL: faker.internet.url,
    PASSWORD: faker.internet.password,
    GENERIC_TITLE: () => faker.lorem.words(3),
    GENERIC_TEXT: faker.lorem.paragraph,
    GENRE: () => (Math.random() < 0.5 ? Genre.LYRIC : Genre.NARRATIVE),
    DATE: new Date(),
};

export const I18N = {
    NOT_FOUND: (prop, g = 'o') => `${prop} não encontrad${g}`,
    LOGIN_ERROR:
        'Ops, algo de errado não está certo com seus dados de acesso. Verifica de novo aí, por favor.',
};
