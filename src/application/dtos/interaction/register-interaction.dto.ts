import { OmitType, PartialType } from '@nestjs/swagger';
import InteractionDto from './interaction.dto';

export default class RegisterInteractionDto extends OmitType(InteractionDto, [
    'id',
    'createdAt',
]) {}
