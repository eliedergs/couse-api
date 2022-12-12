import PericopeEntity from '@/domain/entities/pericope.entity';
import Pericope from '@/domain/interfaces/pericope';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import InteractionsCountingDto from '../interaction/interaction-counting.dto';
import UserSimpleDto from '../user/user-simple.dto';
import PericopeDto from './pericope.dto';

export default class PericopeUserDto extends IntersectionType(
    PericopeDto,
    InteractionsCountingDto,
) {
    @Expose()
    @ApiProperty({ description: 'Drafts pericopes of the literature' })
    @ValidateNested()
    @Type(() => UserSimpleDto)
    user: UserSimpleDto;

    static toDto(partial: PericopeEntity, userId?: string) {
        return plainToInstance(
            PericopeUserDto,
            {
                ...partial,
                ...InteractionsCountingDto.toDto(partial, userId),
                user:
                    typeof partial.user !== 'string'
                        ? UserSimpleDto.toDto(partial.user)
                        : partial.user,
            },
            { excludeExtraneousValues: true },
        );
    }

    static toDtos(partials: PericopeEntity[], userId?: string) {
        return partials.map((partial) =>
            PericopeUserDto.toDto(partial, userId),
        );
    }
}
