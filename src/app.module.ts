import { AuthController } from '@application/controllers/auth.controller';
import { AuthService } from '@domain/services/auth.service';
import UserService from '@domain/services/user.service';
import { DatabaseModule } from '@infra/database/config/database.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { InteractionController } from './application/controllers/interaction.controller';
import { LiteratureController } from './application/controllers/literature.controller';
import { NotificationController } from './application/controllers/notification.controller';
import { PericopeController } from './application/controllers/pericope.controller';
import { UserController } from './application/controllers/user.controller';
import InteractionService from './domain/services/interaction.service';
import LiteratureService from './domain/services/literature.service';
import NotificationService from './domain/services/notification.service';
import PericopeService from './domain/services/pericope.service';
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
        LiteratureController,
        PericopeController,
        InteractionController,
        NotificationController,
    ],
    providers: [
        JwtStrategy,
        AuthService,
        UserService,
        LiteratureService,
        PericopeService,
        InteractionService,
        NotificationService,
    ],
})
export class AppModule {}
