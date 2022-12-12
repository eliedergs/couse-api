import { DateTime } from 'luxon';
import { FORMAT } from './constants';

export const fromJSDateToDateTimeFormat = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat(FORMAT.DATETIME);
};

export const fromJSDateToDateFormat = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat(FORMAT.DATE);
};

export const fromStringToDate = (
    dastringDate: string,
    fromFormat = 'dd/DD/yyyy',
) => {
    return DateTime.fromFormat(dastringDate, fromFormat);
};
