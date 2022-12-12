import { EXAMPLE } from '@/application/utils/constants';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import UserDto from './user.dto';

export default class UpdateUserDto extends PartialType(
    PickType(UserDto, ['name', 'bio', 'photo']),
) {
    @Expose()
    @ApiProperty({
        description: 'Password of user',
        example: EXAMPLE.PASSWORD(),
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password?: string;
}
