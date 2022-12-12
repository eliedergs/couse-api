import { EXAMPLE } from '@/application/utils/constants';
import Literature from '@/domain/interfaces/literature';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { ILike } from 'typeorm';

export default class FilterLiteratureDto {
    @Expose()
    @ApiProperty({
        description: 'Title of literature',
        example: EXAMPLE.NAME(),
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? ILike(`%${value}%`) : null))
    title?: string;

    @Expose()
    @ApiProperty({
        description: 'Date of creation of literature',
        example: EXAMPLE.DATE,
        required: false,
    })
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @Expose()
    @ApiProperty({
        description: 'Date of updating of literature',
        example: EXAMPLE.DATE,
        required: false,
    })
    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    static toDto(partial: Partial<Literature>) {
        return plainToInstance(
            FilterLiteratureDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Partial<Literature>[]) {
        return partials.map((partial) => FilterLiteratureDto.toDto(partial));
    }
}
