import LiteratureEntity from '@/domain/entities/literature.entity';
import { PericopeType } from '@/domain/interfaces/literature';
import { IntersectionType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import InteractionsCountingDto from '../interaction/interaction-counting.dto';
import LiteraturePericopesDto from './literature-pericopes.dto';

export default class LiteraturePericopesInteractionCountingDto extends IntersectionType(
    LiteraturePericopesDto,
    InteractionsCountingDto,
) {
    static toDto(
        partial: LiteratureEntity,
        pericopeType: PericopeType = PericopeType.ALL,
        userId?: string,
    ) {
        return plainToInstance(
            LiteraturePericopesInteractionCountingDto,
            {
                ...LiteraturePericopesDto.toDto(partial, pericopeType, userId),
                ...InteractionsCountingDto.toDto(partial, userId),
            } as LiteraturePericopesInteractionCountingDto,
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(
        partials: LiteratureEntity[] = [],
        pericopeType: PericopeType = PericopeType.ALL,
        userId?: string,
    ) {
        return partials.map((partial: LiteratureEntity) =>
            LiteraturePericopesInteractionCountingDto.toDto(
                partial,
                pericopeType,
                userId,
            ),
        );
    }
}
