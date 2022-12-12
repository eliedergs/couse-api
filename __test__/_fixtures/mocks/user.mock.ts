import CreateUserDto from '@/application/dtos/user/create-user.dto';
import { EXAMPLE } from '@application/utils/constants';
import UserEntity from '@domain/entities/user.entity';

export default class UserMock {
    static createUserDto(): CreateUserDto {
        return {
            name: EXAMPLE.NAME(),
            email: EXAMPLE.EMAIL(),
            password: EXAMPLE.PASSWORD(),
        };
    }

    static createUserEntity(): UserEntity {
        return new UserEntity(UserMock.createUserDto());
    }
}
