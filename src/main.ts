import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { AppModule } from './app.module';

dotenv.config({ path: './.env' });

const setupDocs = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Colittera Server')
        .setDescription('Colittera API documentation')
        .setVersion('0.5')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors();

    setupDocs(app);

    await app.listen(process.env.PORT);
}

bootstrap().then(() => console.log(`Listening on port: ${process.env.PORT}`));
