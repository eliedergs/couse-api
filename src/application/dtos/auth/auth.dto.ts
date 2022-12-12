import User from '@domain/interfaces/user';
import { PickType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import CreateUserDto from '../user/create-user.dto';

export default class AuthDto extends PickType(CreateUserDto, [
    'email',
    'password',
]) {
    static toDto(partial: Partial<User>): AuthDto {
        return plainToInstance(
            AuthDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }
}
