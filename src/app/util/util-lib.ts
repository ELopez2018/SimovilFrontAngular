export function isJSON(json: any) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
}

export function dateToISOString(date?) {
    date = date == null ? new Date() : new Date(date);
    return date.toISOString().split('T')[0];
}

export const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

export function getNameMonth(monthNum: number) {
    if (!Number.isInteger(monthNum)) return '';
    return monthNum >= 1 && monthNum <= 12 ? meses[monthNum - 1] : '';
}

export function addDays(dateISO, days: number): Date {
    try {
        const da = dateISO == null ? new Date() : new Date(dateISO);
        da.setDate(da.getDate() + days);
        return da;
    } catch (error) {
        return null;
    }
}

export function cleanString(val: string): string {
    return val ? String(val).replace(/ +/g, ' ').trim() : '';
}

export function cleanNumber(val: number): number {
    if (typeof val === 'undefined') return 0;
    else return Number(val);
}

export function numToCurrent(val: number, simbol = true): string {
    if (typeof val === 'undefined') return simbol ? '$ 0' : '0';
    else return simbol ? '$' + val.toLocaleString() : val.toLocaleString();
}

export function currencyNotDecimal() {
    return { precision: 0 };
}

export function isoDateToLocalString(val: string): string {
    if (typeof val === 'undefined') return '';
    else {
        let d = val.split('T')[0].split('-');
        return d[2] + '/' + d[1] + '/' + d[0];
    }
}

/**
 *
 * @param date
 * @param period 0 FifteenDays, 1 Month, 2 Year
 */
export function rangedate(dateISO: string, period): Date[] {
    try {
        const date = new Date(dateISO);
        let dateIni;
        let dateEnd;
        let day;
        switch (period) {
            case 0:
                day = date.getUTCDate();
                if (day > 15) {
                    dateIni = new Date(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        16
                    );
                    dateEnd = new Date(
                        date.getUTCFullYear(),
                        date.getUTCMonth() + 1,
                        0
                    );
                } else {
                    dateIni = new Date(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        1
                    );
                    dateEnd = new Date(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        15
                    );
                }
                break;
            case 1:
                dateIni = new Date(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    1
                );
                dateEnd = new Date(
                    date.getUTCFullYear(),
                    date.getUTCMonth() + 1,
                    0
                );
                break;
            case 2:
                dateIni = new Date(date.getUTCFullYear(), 0, 1);
                dateEnd = new Date(date.getUTCFullYear(), 12, 0);
                break;
        }
        return [dateIni, dateEnd];
    } catch (error) {
        return null;
    }
}

/**
 * Enfoca por Id, el item solicitado.
 * @param obj Item a enfocar
 * @param force Ignora si es menor a 576px.
 */
export function focusById(obj, force = false) {
    if (window.innerWidth > 576 || force) {
        let a = document.getElementById(obj);
        a ? a.focus() : null;
    }
}

/**
 * Organiza parametros Get
 * @param query Url
 * @param parameters Array [value, nameParameter]
 */
export function OrderParametersToGet(
    query: string,
    parameters: any[],
    separator = '?'
): string {
    var queryExt = '';
    parameters.forEach((element) => {
        if (element[0] != null) {
            if (queryExt.length > 0) queryExt += '&';
            queryExt += element[1] + '=' + element[0];
        }
    });
    if (queryExt.length > 0) query += separator + queryExt;
    return query;
}

export function ObjToCSV(
    obj: object[],
    title: string[] = null,
    titleB?: string[]
): string {
    if (!title) title = Object.keys(obj[1]);

    if (!titleB) titleB = title;
    var csv = '';
    titleB.map((e) => {
        csv += e + ',';
    });
    csv = csv.slice(0, -1);
    csv += '\r\n';
    obj.map((e) => {
        title.map((t) => {
            csv += e[t] + ',';
        });
        csv = csv.slice(0, -1);
        csv += '\r\n';
    });
    // obj.map(e => {
    //     csv += '\r\n' + e.join(',');
    // });
    csv = csv.replace(/,/g, ';');
    return csv;
}
