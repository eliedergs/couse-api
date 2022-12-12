import PericopeEntity from '@/domain/entities/pericope.entity';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import InteractionsCountingDto from '../interaction/interaction-counting.dto';
import LiteraturePreviewDto from '../literature/literature-preview.dto';
import LiteratureDto from '../literature/literature.dto';
import PericopeDto from './pericope.dto';

export class PericopePreview extends IntersectionType(
    PericopeDto,
    InteractionsCountingDto,
) {
    @Expose()
    @ApiProperty({ description: 'Literature of the pericope' })
    @ValidateNested()
    @Type(() => LiteraturePreviewDto)
    literature: LiteraturePreviewDto;

    static toDto(partial: PericopeEntity) {
        return plainToInstance(
            PericopePreview,
            {
                ...PericopeDto.toDto(partial),
                ...InteractionsCountingDto.toDto(partial),
                literature: LiteratureDto.toDto(partial.literature),
            } as PericopePreview,
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: PericopeEntity[] = []) {
        return partials.map((partial: PericopeEntity) =>
            PericopePreview.toDto(partial),
        );
    }
}
