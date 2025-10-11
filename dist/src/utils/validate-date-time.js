"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDateTime = validateDateTime;
const date_fns_1 = require("date-fns");
/**
 * Valida e normaliza uma data e hora para o formato UTC esperado pela API.
 *
 * Aceita os seguintes formatos de data:
 * - ISO: 2024-12-31
 * - Brasileiro: 31/12/2024
 * - Americano: 12-31-2024
 *
 * Aceita os seguintes formatos de hora:
 * - HH:mm (ex: 10:00)
 * - HH:mm:ss (ex: 10:00:00) - os segundos serão ignorados
 *
 * @param date - String contendo a data
 * @param hour - String contendo a hora
 * @returns Objeto com resultado da validação e data normalizada
 */
function validateDateTime(date, hour) {
    let dateObj;
    // 1. Tenta parsear a data em diferentes formatos
    // Formato ISO completo com timezone (2024-12-31T10:00:00.000Z ou 2024-12-31T10:00:00-03:00)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(date)) {
        dateObj = new Date(date);
    }
    // Formato ISO apenas data (2024-12-31)
    else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        dateObj = (0, date_fns_1.parseISO)(date);
    }
    // Formato brasileiro (31/12/2024)
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        dateObj = (0, date_fns_1.parse)(date, 'dd/MM/yyyy', new Date());
    }
    // Formato americano (12-31-2024)
    else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        dateObj = (0, date_fns_1.parse)(date, 'MM-dd-yyyy', new Date());
    }
    // Formato timestamp Unix (número)
    else if (/^\d+$/.test(date)) {
        dateObj = new Date(Number.parseInt(date));
    }
    // Formato não reconhecido
    else {
        return {
            isValid: false,
            error: 'Invalid date format. Expected: YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY, ISO 8601, or Unix timestamp',
        };
    }
    // 2. Valida se a data é válida
    if (!(0, date_fns_1.isValid)(dateObj)) {
        return {
            isValid: false,
            error: 'Invalid date. Please check the date values.',
        };
    }
    // 3. Normaliza a hora (remove segundos se houver)
    const hourNormalized = hour.substring(0, 5); // '10:00:00' -> '10:00'
    // 4. Valida formato da hora
    if (!/^\d{2}:\d{2}$/.test(hourNormalized)) {
        return {
            isValid: false,
            error: 'Invalid hour format. Expected HH:mm (24-hour format)',
        };
    }
    // 5. Valida se a hora é válida (00:00 até 23:59)
    const [hourValue, minuteValue] = hourNormalized.split(':').map(Number);
    if (hourValue < 0 || hourValue > 23 || minuteValue < 0 || minuteValue > 59) {
        return {
            isValid: false,
            error: 'Invalid hour values. Hour must be 00-23 and minutes 00-59',
        };
    }
    // 6. Extrai apenas a data (ano, mês, dia) em UTC da dateObj
    // Isso garante que qualquer timezone da data original seja normalizado para UTC
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    // 7. Combina data + hora sempre em UTC com .000Z no final
    const dateTimeString = `${year}-${month}-${day}T${hourNormalized}:00.000Z`;
    const dateTimeObj = new Date(dateTimeString);
    return {
        isValid: true,
        dateTimeString,
        dateTimeObj,
    };
}
