import CreateLiteratureDto from '@/application/dtos/literature/create-literature.dto';
import LiteratureEntity from '@/domain/entities/literature.entity';
import Literature from '@/domain/interfaces/literature';
import { EXAMPLE } from '@application/utils/constants';

export default class LiteratureMock {
    static createLiteratureDto(
        params: Partial<Literature> = {},
    ): CreateLiteratureDto {
        return {
            title: EXAMPLE.GENERIC_TITLE(),
            genre: EXAMPLE.GENRE(),
            maxPericopes: Math.floor(Math.random() * 10),
            sizePericope: Math.floor(Math.random() * 10),
            pericope: EXAMPLE.GENERIC_TEXT(),
            ...params,
        };
    }

    static createLiteratureEntity(
        params: Partial<Literature> = {},
    ): LiteratureEntity {
        return new LiteratureEntity(LiteratureMock.createLiteratureDto(params));
    }
}
