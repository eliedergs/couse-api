import CreateUserDto from '@/application/dtos/user/create-user.dto';
import faker from '@faker-js/faker';

export default class AuthMock {
    static createCredentialsDto(): CreateUserDto {
        return {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
    }
}
