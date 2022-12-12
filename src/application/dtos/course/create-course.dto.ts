import { PickType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import CourseDto from './course.dto';

export default class CreateCourseDto extends PickType(CourseDto, [
    'nome',
    'descricao',
    'modelo',
    'vagas',
]) {
    static toDto(partial: Partial<CourseDto>): CreateCourseDto {
        return plainToInstance(
            CreateCourseDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }
}
