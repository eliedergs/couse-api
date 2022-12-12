import User from '@domain/interfaces/user';
import { PickType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import UserDto from './user.dto';

export default class UserSimpleDto extends PickType(UserDto, ['id', 'name']) {
    static toDto(partial: Partial<User>) {
        return plainToInstance(
            UserDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Partial<User>[]) {
        return partials.map((partial) => UserDto.toDto(partial));
    }
}
