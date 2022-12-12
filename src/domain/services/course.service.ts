import CourseDto from '@/application/dtos/course/course.dto';
import FilterCourseDto from '@/application/dtos/course/filter.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import CourseEntity from '../entities/course.entity';

@Injectable()
export default class CourseService {
    constructor(@Inject('database') private dataSource: DataSource) {}

    async createCourse(createCourseDto: Partial<CourseDto>) {
        const literatureRepository =
            this.dataSource.getRepository(CourseEntity);

        return await literatureRepository.save(
            new CourseEntity({ ...createCourseDto }),
        );
    }

    async findCoursesByFilter(filter: Partial<FilterCourseDto> = {}) {
        const repository = this.dataSource.getRepository(CourseEntity);
        const literatures = await repository.find({ where: { ...filter } });

        return literatures;
    }

    findCourseById(courseId: string) {
        const repository = this.dataSource.getRepository(CourseEntity);
        return repository.findOne({ where: { id: courseId } });
    }
}
