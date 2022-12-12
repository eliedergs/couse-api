import { EXAMPLE } from '@/application/utils/constants';
import { fromJSDateToDateFormat } from '@/application/utils/format';
import Pericope from '@/domain/interfaces/pericope';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export default class PericopeDto implements Pericope {
    @Expose()
    @ApiProperty({
        description: 'Id of pericope',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    id: string;

    @Expose()
    @ApiProperty({
        description: 'Text of pericope',
        example: EXAMPLE.NAME(),
    })
    @IsNotEmpty()
    @IsString()
    text: string;

    @Expose()
    @ApiProperty({
        description: `Order of pericope in timeline (0 if it's a draft)`,
        example: 0,
    })
    @IsNumber()
    @Min(0)
    order: number;

    @Expose()
    @ApiProperty({
        description: 'Date of creation of pericope',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) =>
        value instanceof Date ? fromJSDateToDateFormat(value) : value,
    )
    createdAt: string;

    @Expose()
    @ApiProperty({
        description: 'Date of updating of pericope',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) =>
        value instanceof Date ? fromJSDateToDateFormat(value) : value,
    )
    updatedAt: string;

    static toDto(partial: Partial<Pericope>) {
        return plainToInstance(
            PericopeDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Partial<Pericope>[]) {
        return partials.map((partial) => PericopeDto.toDto(partial));
    }
}
