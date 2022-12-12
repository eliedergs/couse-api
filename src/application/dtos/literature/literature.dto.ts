import { EXAMPLE } from '@/application/utils/constants';
import { fromJSDateToDateFormat } from '@/application/utils/format';
import { Genre } from '@/domain/entities/literature.entity';
import Literature from '@/domain/interfaces/literature';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export default class LiteratureDto implements Literature {
    @Expose()
    @ApiProperty({
        description: 'Id of literature',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    id: string;

    @Expose()
    @ApiProperty({
        description: 'Title of literature',
        example: EXAMPLE.NAME(),
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @Expose()
    @ApiProperty({
        description: 'Genre of literature',
        enum: Genre,
    })
    @IsEnum(Genre)
    genre: Genre;

    @Expose()
    @ApiProperty({
        description: 'Max of pericopes allowed in literature',
        example: 0,
    })
    @IsNumber()
    @Min(0)
    maxPericopes: number;

    @Expose()
    @ApiProperty({
        description: 'Max size of each pericope in literature',
        example: 0,
    })
    @IsNumber()
    @Min(0)
    sizePericope: number;

    @Expose()
    @ApiProperty({
        description: 'Date of creation of literature',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) =>
        value instanceof Date ? fromJSDateToDateFormat(value) : value,
    )
    createdAt: string;

    @Expose()
    @ApiProperty({
        description: 'Date of updating of literature',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) =>
        value instanceof Date ? fromJSDateToDateFormat(value) : value,
    )
    updatedAt: string;

    @Expose()
    @ApiProperty({
        description: 'Id of literature',
        example: EXAMPLE.UUID,
        required: false,
    })
    @IsOptional()
    @IsUUID()
    user?: string;

    static toDto(partial: Literature) {
        const userId =
            typeof partial.user === 'string' ? partial.user : partial.user?.id;

        return plainToInstance(
            LiteratureDto,
            { ...partial, user: userId },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Literature[]) {
        return partials.map((partial) => LiteratureDto.toDto(partial));
    }
}
