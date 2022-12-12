import { EXAMPLE } from '@/application/utils/constants';
import { fromJSDateToDateFormat } from '@/application/utils/format';
import {
    CourseModelEnum,
    default as Course,
    default as Literature,
} from '@/domain/interfaces/course';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    Min,
} from 'class-validator';

export default class CourseDto implements Course {
    @Expose()
    @ApiProperty({
        description: 'Id of course',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    id: string;

    @Expose()
    @ApiProperty({
        description: `Title of course`,
        example: EXAMPLE.NAME(),
    })
    @IsNotEmpty()
    @IsString()
    @Length(0, 180, {
        message: 'O nome do curso deve ter no máximo 180 caracteres.',
    })
    nome: string;

    @Expose()
    @ApiProperty({
        description: 'Model of literature (presential/online)',
        enum: CourseModelEnum,
    })
    @IsEnum(CourseModelEnum, { message: 'Modelo inválido.' })
    @IsNotEmpty()
    modelo: CourseModelEnum;

    @Expose()
    @ApiProperty({
        description: `Description of course`,
        example: 0,
    })
    @IsString()
    @IsOptional()
    descricao: string;

    @Expose()
    @ApiProperty({
        description: 'Vacancies of course',
        example: 2,
    })
    @IsNumber()
    @Min(1, { message: 'O curso deve ter pelo menos uma vaga.' })
    vagas: number | null;

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

    static toDto(partial: Literature) {
        return plainToInstance(
            CourseDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Literature[]) {
        return partials.map((partial) => CourseDto.toDto(partial));
    }
}
