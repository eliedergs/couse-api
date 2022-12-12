import CreateUserDto from '@/application/dtos/user/create-user.dto';
import UpdateUserDto from '@/application/dtos/user/update-user.dto';
import UserEntity from '@domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export default class UserService {
    constructor(@Inject('database') private dataSource: DataSource) {}

    async createUser(createUserDto: CreateUserDto) {
        const repository = this.dataSource.getRepository(UserEntity);

        return await repository.save(new UserEntity(createUserDto));
    }

    findById(id: string, relations = []) {
        const repository = this.dataSource.getRepository(UserEntity);

        return repository.findOne({ where: { id }, relations });
    }

    findByEmail(email: string, relations = []) {
        const repository = this.dataSource.getRepository(UserEntity);

        return repository.findOne({ where: { email }, relations });
    }

    findByFilter(filter: any = {}, relations = []) {
        const repository = this.dataSource.getRepository(UserEntity);

        return repository.find({ where: filter, relations });
    }

    async updateUserById(userId: string, user: Partial<UpdateUserDto>) {
        const repository = this.dataSource.getRepository(UserEntity);
        await repository.update({ id: userId }, { ...user });
    }

    async updatePassword(userId: string, newPassword: string) {
        const repository = this.dataSource.getRepository(UserEntity);
        const _user = await repository.findOne({ where: { id: userId } });
        _user.password = newPassword;
        await repository.save(_user);
    }
}
