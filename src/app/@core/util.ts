/**
 * Função que percorre todas as chaves do objeto passado como parâmetro e realiza a conversão para string de cada atributo.
 * Se a chave possuia um valor nulo, undefined, ou "" a chave será deletada e não estará no objeto retornado
 * @param obj objeto que terá seus valores passados para string
 * @returns um novo objeto com os valores em string
 */
export const stringfyObjectValues = (obj: Object): { [key: string]: string } => {
    let newObj = { ...obj };
    for (const key in newObj) {
        if (Object.prototype.hasOwnProperty.call(newObj, key)) {
            const element: string = newObj[key] ? newObj[key].toString() : null;
            if (!element) {
                delete newObj[key];
            } else {
                newObj[key] = element;
            }

        }
    }
    console.log('stringfyObjectValues', newObj);
    return newObj as { [key: string]: string };
}


export class DateUtil {


    static readonly defaultOptions: { [key: string]: any } = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }

    public static formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = DateUtil.defaultOptions, locale = 'pt-br') => {
        if (!date) {
            return null;
        }
        if (date instanceof Date) {
            return date.toLocaleDateString(locale, options)
        }

        return new Date(date).toLocaleDateString(locale, options)
    }

    public static formatDateToISO = (date: Date | string, withTimeStamp: boolean = true) => {
        if (!date) {
            return null;
        }
        if (typeof date === 'string') {
            date = date.replace(/(\d+[/])(\d+[/])/, '$2$1');
        }
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return !withTimeStamp ? date.toISOString().split('T')[0] : date.toISOString();

    }
}