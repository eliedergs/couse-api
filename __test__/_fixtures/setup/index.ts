import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';

export default async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    return await app.init();
};
