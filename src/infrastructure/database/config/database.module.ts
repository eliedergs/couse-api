import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
import databaseFactory from './database.factory';

@Module({
    providers: [databaseFactory],
    exports: [databaseFactory],
})
export class DatabaseModule implements OnModuleDestroy {
    constructor(@Inject('database') private dataSource: DataSource) {}
    onModuleDestroy() {
        this.dataSource.destroy();
    }
}
