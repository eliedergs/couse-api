import LiteratureEntity from '@/domain/entities/literature.entity';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import InteractionsCountingDto from '../interaction/interaction-counting.dto';
import LiteratureDto from './literature.dto';

export default class LiteraturePreviewDto extends IntersectionType(
    LiteratureDto,
    InteractionsCountingDto,
) {
    @Expose()
    @ApiProperty({
        description: 'Text of the initial pericope',
    })
    @IsString()
    @IsOptional()
    preview: string;

    @Expose()
    @ApiProperty({
        description: 'Length of timeline',
    })
    @IsNumber()
    timeline: number;

    @Expose()
    @ApiProperty({
        description: 'Drafts pericopes count',
    })
    @IsNumber()
    drafts: number;

    static toDto(partial: LiteratureEntity) {
        const preview =
            partial.pericopes.find((p) => p.order === 1)?.text || '';
        const timeline = partial.pericopes.filter((p) => p.order > 0).length;
        const drafts = partial.pericopes.filter((p) => p.order === 0).length;

        return plainToInstance(
            LiteraturePreviewDto,
            {
                ...LiteratureDto.toDto(partial),
                ...InteractionsCountingDto.toDto(partial),
                preview,
                timeline,
                drafts,
            } as LiteraturePreviewDto,
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: LiteratureEntity[] = []) {
        return partials.map((partial: LiteratureEntity) =>
            LiteraturePreviewDto.toDto(partial),
        );
    }
}
