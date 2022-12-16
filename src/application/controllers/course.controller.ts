import CourseService from '@/domain/services/course.service';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import CourseDto from '../dtos/course/course.dto';
import CreateCourseDto from '../dtos/course/create-course.dto';
import FilterCourseDto from '../dtos/course/filter.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('course')
@Controller('courses')
export class CourseController {
    constructor(@Inject(CourseService) private courseService: CourseService) {}

    @ApiOperation({
        description: 'It receives data to create a course',
    })
    @ApiCreatedResponse({ description: 'Course initiated.' })
    @Post('')
    @HttpCode(201)
    async createCourse(
        @Body()
        courseDto: CreateCourseDto,
    ): Promise<string> {
        const course = await this.courseService.createCourse(courseDto);

        return course.id;
    }

    @ApiOperation({ description: 'List courses by filter' })
    @ApiOkResponse({
        type: [CourseDto],
    })
    @Get('/')
    @HttpCode(200)
    async getCourses(
        @Query()
        filter: FilterCourseDto = {},
    ): Promise<CourseDto[]> {
        console.log(filter);

        const courses = await this.courseService.findCoursesByFilter(filter);

        return CourseDto.toDtos(courses);
    }

    @ApiOperation({
        description: 'List courses by filter with its respective CourseModels',
    })
    @ApiOkResponse()
    @Get('/:id')
    @HttpCode(200)
    async getCourseById(
        @Param('id')
        courseId: string,
    ): Promise<CourseDto> {
        const course = await this.courseService.findCourseById(courseId);

        return CourseDto.toDto(course);
    }
}
