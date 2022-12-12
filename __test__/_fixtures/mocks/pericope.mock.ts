import CreatePericopeDto from '@/application/dtos/pericope/create-pericope.dto';
import PericopeEntity from '@/domain/entities/pericope.entity';
import { EXAMPLE } from '@application/utils/constants';

export default class PericopeMock {
    static createPericopeDto(
        params: Partial<CreatePericopeDto> = {},
    ): CreatePericopeDto {
        return {
            text: EXAMPLE.GENERIC_TEXT(),
            user: EXAMPLE.UUID,
            ...params,
        };
    }

    static createPericopeEntity(
        params: Partial<CreatePericopeDto> = {},
    ): PericopeEntity {
        return new PericopeEntity(PericopeMock.createPericopeDto(params));
    }
}
