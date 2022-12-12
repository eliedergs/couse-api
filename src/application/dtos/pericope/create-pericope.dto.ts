import { EXAMPLE } from '@/application/utils/constants';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export default class CreatePericopeDto {
    @ApiProperty({
        description: 'Text of pericope',
        example: EXAMPLE.NAME(),
    })
    @IsNotEmpty()
    @IsString()
    text: string;

    @ApiProperty({
        description: 'Id of the creator of pericope',
    })
    @IsUUID()
    user: string;

    @ApiProperty({
        description: 'Literature id to which the pericope belongs',
    })
    @IsUUID()
    literature?: string;

    @ApiProperty({
        description: 'Literature id to which the pericope belongs',
    })
    @IsOptional()
    @IsNumber()
    order?: number;
}

export class RequestCreateLiterature {
    @ApiProperty({
        description: 'Text of pericope',
        example: EXAMPLE.NAME(),
    })
    @IsNotEmpty()
    @IsString()
    text: string;

    @ApiProperty({
        description: 'Literature id to which the pericope belongs',
    })
    @IsUUID()
    literature: string;
}
