import AuthDto from '@/application/dtos/auth/auth.dto';
import { default as CreateUserDto } from '@/application/dtos/user/create-user.dto';
import { I18N } from '@application/utils/constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import UserService from './user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    async registerUser(userDto: CreateUserDto) {
        const user = await this.userService.createUser({ ...userDto });
        const token = await this.jwtService.sign({ id: user.id });

        return { id: user.id, token };
    }

    async validateLogin(userLogin: AuthDto) {
        const user = await this.userService.findByEmail(userLogin.email);

        if (!user) {
            throw new UnauthorizedException(I18N.LOGIN_ERROR);
        }

        const isValidPassword = await bcrypt.compare(
            userLogin.password,
            user.password,
        );

        if (!isValidPassword) {
            throw new UnauthorizedException(I18N.LOGIN_ERROR);
        }

        const token = await this.jwtService.sign({ id: user.id });

        return { id: user.id, token };
    }
}
