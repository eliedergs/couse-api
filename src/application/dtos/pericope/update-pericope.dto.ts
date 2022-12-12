import { OmitType, PartialType } from '@nestjs/swagger';
import PericopeDto from './pericope.dto';

export default class UpdatePericopeDto extends PartialType(
    OmitType(PericopeDto, ['id', 'createdAt', 'updatedAt']),
) {}
