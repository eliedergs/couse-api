import LiteratureEntity from '@/domain/entities/literature.entity';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import InteractionsCountingDto from '../interaction/interaction-counting.dto';
import InteractionDto from '../interaction/interaction.dto';
import LiteratureDto from './literature.dto';

export default class LiteratureInteractionsDto extends LiteratureDto {
    @Expose()
    @ApiProperty({
        description: 'Literature interactions',
    })
    @ValidateNested({ each: true })
    @IsArray()
    @Type(() => InteractionDto)
    @IsOptional()
    interactions: [InteractionDto];

    static toDto(partial: LiteratureEntity) {
        return plainToInstance(
            LiteratureInteractionsDto,
            {
                ...LiteratureDto.toDto(partial),
                interactions: InteractionDto.toDtos(partial.interactions),
            },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: LiteratureEntity[] = []) {
        return partials.map((partial: LiteratureEntity) =>
            LiteratureInteractionsDto.toDto(partial),
        );
    }
}
