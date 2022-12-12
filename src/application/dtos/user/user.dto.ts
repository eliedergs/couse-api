import { EXAMPLE } from '@application/utils/constants';
import { fromJSDateToDateFormat } from '@application/utils/format';
import User from '@domain/interfaces/user';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export default class UserDto implements User {
    @Expose()
    @ApiProperty({
        description: 'Id of user',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    id: string;

    @Expose()
    @ApiProperty({
        description: 'Name of user',
        example: EXAMPLE.NAME(),
    })
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @ApiProperty({
        description: 'E-mail of user',
        example: EXAMPLE.EMAIL(),
    })
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Expose()
    @ApiProperty({
        description: 'Url profile photo of user',
        example: EXAMPLE.URL(),
    })
    @IsOptional()
    @IsString()
    photo: string;

    @Expose()
    @ApiProperty({
        description: 'Generic informations of user',
        example: EXAMPLE.GENERIC_TEXT(),
    })
    @IsOptional()
    @IsString()
    bio: string;

    @Expose()
    @ApiProperty({
        description: 'Date of creation of user',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) => fromJSDateToDateFormat(value))
    createdAt: string;

    @Expose()
    @ApiProperty({
        description: 'Date of updating of user',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) => fromJSDateToDateFormat(value))
    updatedAt: string;

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
