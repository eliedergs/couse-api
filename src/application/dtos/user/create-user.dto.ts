import { EXAMPLE } from '@/application/utils/constants';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import UserDto from './user.dto';

export default class CreateUserDto extends PickType(UserDto, [
    'name',
    'email',
]) {
    @Expose()
    @ApiProperty({
        description: 'Password of user',
        example: EXAMPLE.PASSWORD(),
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
