import { InteractionType } from '@/domain/entities/interaction.entity';
import LiteratureEntity from '@/domain/entities/literature.entity';
import PericopeEntity from '@/domain/entities/pericope.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export default class InteractionsCountingDto {
    @Expose()
    @ApiProperty({
        description: 'Literature views count',
        example: 10,
    })
    @IsNumber()
    @IsOptional()
    views: number;

    @Expose()
    @ApiProperty({
        description: 'Literature likes count',
        example: 7,
    })
    @IsNumber()
    @IsOptional()
    likes: number;

    @Expose()
    @ApiProperty({
        description: 'Whether user has liked the literature',
    })
    @IsBoolean()
    like: boolean;

    @Expose()
    @ApiProperty({
        description: 'Whether user has viewed the literature',
    })
    @IsBoolean()
    view: boolean;

    static toDto(partial: LiteratureEntity | PericopeEntity, userId?: string) {
        const interactions = (partial?.interactions || []).reduce(
            (acum, current) => {
                switch (current.type) {
                    case InteractionType.VIEW:
                        if (current.user.id === userId) acum.view = true;
                        ++acum.views;
                        break;
                    case InteractionType.LIKE:
                        if (current.user.id === userId) acum.like = true;
                        ++acum.likes;
                        break;
                }

                return acum;
            },
            { views: 0, likes: 0, view: false, like: false },
        );
        return plainToInstance(
            InteractionsCountingDto,
            { ...interactions },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(
        partials: LiteratureEntity[] | PericopeEntity[] = [],
        userId?: string,
    ) {
        return partials.map((partial) =>
            InteractionsCountingDto.toDto(partial, userId),
        );
    }
}
