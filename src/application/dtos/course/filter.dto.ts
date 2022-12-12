import { EXAMPLE } from '@/application/utils/constants';
import Course from '@/domain/interfaces/course';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { ILike } from 'typeorm';
import CourseDto from './course.dto';

export default class FilterCourseDto extends PickType(PartialType(CourseDto), [
    'modelo',
]) {
    @Expose()
    @ApiProperty({
        description: 'Title of course',
        example: EXAMPLE.NAME(),
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => (value ? ILike(`%${value}%`) : null))
    nome?: string;

    @Expose()
    @ApiProperty({
        description: 'Vacancies of course',
        example: 2,
        required: false,
    })
    @IsOptional()
    vagas?: number | null;

    @Expose()
    @ApiProperty({
        description: 'Date of creation of course',
        example: EXAMPLE.DATE,
        required: false,
    })
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @Expose()
    @ApiProperty({
        description: 'Date of updating of course',
        example: EXAMPLE.DATE,
        required: false,
    })
    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    static toDto(partial: Partial<Course>) {
        return plainToInstance(
            FilterCourseDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Partial<Course>[]) {
        return partials.map((partial) => FilterCourseDto.toDto(partial));
    }
}
