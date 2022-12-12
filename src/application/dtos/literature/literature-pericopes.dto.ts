import { InteractionType } from '@/domain/entities/interaction.entity';
import LiteratureEntity from '@/domain/entities/literature.entity';
import { PericopeType } from '@/domain/interfaces/literature';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import InteractionsCountingDto from '../interaction/interaction-counting.dto';
import PericopeUserDto from '../pericope/pericope-user.dto';
import LiteratureDto from './literature.dto';

export default class LiteraturePericopesDto extends LiteratureDto {
    @Expose()
    @ApiProperty({
        description: 'Text of the initial pericope',
    })
    @IsString()
    @IsOptional()
    preview: string;

    @Expose()
    @ApiProperty({
        description: 'Pericopes of the literature original timeline',
    })
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => PericopeUserDto)
    @IsOptional()
    timeline: [PericopeUserDto];

    @Expose()
    @ApiProperty({
        description: 'Drafts pericopes of the literature',
    })
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => PericopeUserDto)
    @IsOptional()
    drafts: [PericopeUserDto];

    static toDto(
        partial: LiteratureEntity,
        pericopeType: PericopeType = PericopeType.ALL,
        userId?: string,
    ) {
        const pericopesDtos = PericopeUserDto.toDtos(partial.pericopes, userId);
        const preview = pericopesDtos.find((p) => p.order === 1)?.text || '';
        let timeline: PericopeUserDto[] = [],
            drafts: PericopeUserDto[] = [];

        if (
            pericopeType === PericopeType.ALL ||
            pericopeType === PericopeType.TIMELINE
        ) {
            timeline = pericopesDtos.filter((p) => p.order > 0);
        }

        if (
            pericopeType === PericopeType.ALL ||
            pericopeType === PericopeType.DRAFT
        ) {
            drafts = pericopesDtos.filter((p) => p.order === 0);
        }

        return plainToInstance(
            LiteraturePericopesDto,
            {
                ...LiteratureDto.toDto(partial),
                preview,
                timeline,
                drafts,
            } as LiteraturePericopesDto,
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(
        partials: LiteratureEntity[] = [],
        pericopeType: PericopeType = PericopeType.ALL,
        userId?: string,
    ) {
        return partials.map((partial: LiteratureEntity) =>
            LiteraturePericopesDto.toDto(partial, pericopeType, userId),
        );
    }
}
