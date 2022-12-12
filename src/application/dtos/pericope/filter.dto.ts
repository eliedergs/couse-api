import { EXAMPLE } from '@/application/utils/constants';
import { PericopeType } from '@/domain/interfaces/literature';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export default class FilterPericopeDto {
    @ApiProperty({
        description: 'Text of pericope',
        example: EXAMPLE.GENERIC_TEXT(),
    })
    @IsString()
    @IsOptional()
    text?: string;

    @ApiProperty({
        description: 'Type of pericope',
        enum: PericopeType,
    })
    @IsEnum(PericopeType)
    @IsOptional()
    pericopeType?: PericopeType;
}
