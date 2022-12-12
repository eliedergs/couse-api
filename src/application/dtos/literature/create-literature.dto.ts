import { EXAMPLE } from '@/application/utils/constants';
import Literature from '@/domain/interfaces/literature';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import LiteratureDto from './literature.dto';

export default class CreateLiteratureDto extends PickType(LiteratureDto, [
    'title',
    'genre',
]) {
    @Expose()
    @ApiProperty({
        description: 'First portion of the literature',
        example: EXAMPLE.GENERIC_TEXT(),
    })
    @IsNotEmpty()
    @IsString()
    pericope: string;

    static toDto(partial: Partial<Literature>): CreateLiteratureDto {
        return plainToInstance(
            CreateLiteratureDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }
}
