import UserService from '@/domain/services/user.service';
import User from '@domain/interfaces/user';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = Pick<User, 'id'> & { iat: number; exp: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(UserService) private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findById(payload.id);
        if (!user) {
            throw new UnauthorizedException(
                'Acesso inválido. Faça o login, por favor.',
            );
        }

        return payload;
    }
}
