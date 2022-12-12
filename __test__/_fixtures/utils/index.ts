import { fromStringToDate } from '@/application/utils/format';

export const isValidFormattedDate = (
    stringDate: string,
    fromFormat = 'dd/MM/yyyy',
) => {
    const date = fromStringToDate(stringDate, fromFormat);
    return date.isValid;
};
