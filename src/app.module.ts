import { AuthController } from '@application/controllers/auth.controller';
import { AuthService } from '@domain/services/auth.service';
import UserService from '@domain/services/user.service';
import { DatabaseModule } from '@infra/database/config/database.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { CourseController } from './application/controllers/course.controller';
import { UserController } from './application/controllers/user.controller';
import LiteratureService from './domain/services/course.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET,
            signOptions: { expiresIn: '5d' },
        }),
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
        CourseController,
    ],
    providers: [JwtStrategy, AuthService, UserService, LiteratureService],
})
export class AppModule {}
