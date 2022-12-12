import dataSourceOptions from '@infra/database/config/datasource';

export default {
    provide: 'database',
    useFactory: async () => {
        const dataSource = dataSourceOptions;

        return await dataSource.initialize();
    },
};
