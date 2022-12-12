import { EXAMPLE } from '@/application/utils/constants';
import { fromJSDateToDateFormat } from '@/application/utils/format';
import { InteractionType } from '@/domain/entities/interaction.entity';
import Interaction from '@/domain/interfaces/interaction';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export default class InteractionDto implements Interaction {
    @Expose()
    @ApiProperty({
        description: 'Id of user',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    id: string;

    @Expose()
    @ApiProperty({
        description: 'Type of interaction',
        enum: InteractionType,
    })
    @IsEnum(InteractionType)
    type: InteractionType;

    @Expose()
    @ApiProperty({
        description: 'Id of the user that generates the interaction',
        example: EXAMPLE.UUID,
    })
    @IsNotEmpty()
    @IsUUID()
    user: string;

    @Expose()
    @ApiProperty({
        description: 'Id of the target literature of the interaction',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    literature?: string;

    @Expose()
    @ApiProperty({
        description: 'Id of the target pericope of the interaction',
        example: EXAMPLE.UUID,
    })
    @IsOptional()
    @IsUUID()
    pericope?: string;

    @Expose()
    @ApiProperty({
        description: 'Date of creation of interaction',
        example: EXAMPLE.DATE,
    })
    @IsString()
    @Transform(({ value }) => fromJSDateToDateFormat(value))
    createdAt: string | Date;

    static toDto(partial: Interaction) {
        return plainToInstance(
            InteractionDto,
            { ...partial },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: Interaction[] = []) {
        return partials.map((partial) => InteractionDto.toDto(partial));
    }
}
