import { FormControl } from '@angular/forms';

export const setTime = (date: Date, time: string) => {
    const [hrs, mins] = time.split(':');
    date.setUTCHours(+hrs);
    date.setUTCMinutes(+mins);
    return date;
};

export const mergeTimeIntoDateCtrl = (
    dateCtrl: FormControl,
    timeCtrl: FormControl,
) => {
    if (dateCtrl && dateCtrl.value && timeCtrl && timeCtrl.value) {
        const date = new Date(dateCtrl.value);
        return setTime(
            date,
            timeCtrl.value
        ).toISOString();
    }
    return null;
};

export const findPropertyNameByRegex = (object: Object, regex: RegExp) => {
    for (const key in object) {
        if (key.match(regex)) {
            return key;
        }
    }
    return undefined;
};
