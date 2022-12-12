import { fromStringToDate } from '@/application/utils/format';
import Pericope from '@/domain/interfaces/pericope';

export const isValidFormattedDate = (
    stringDate: string,
    fromFormat = 'dd/MM/yyyy',
) => {
    const date = fromStringToDate(stringDate, fromFormat);
    return date.isValid;
};

export const countTimeline = (pericopes: Pericope[]) => {
    return pericopes.filter((p) => p.order > 0)?.length || 0;
};

export const countDrafts = (pericopes: Pericope[]) => {
    return pericopes.filter((p) => p.order === 0)?.length || 0;
};
