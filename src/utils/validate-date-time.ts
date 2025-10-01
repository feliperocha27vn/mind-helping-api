import { format, isValid, parse, parseISO } from 'date-fns'

interface ValidateDateTimeResult {
  isValid: boolean
  dateTimeString?: string
  dateTimeObj?: Date
  error?: string
}

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
export function validateDateTime(
  date: string,
  hour: string
): ValidateDateTimeResult {
  let dateObj: Date

  // 1. Tenta parsear a data em diferentes formatos
  // Formato ISO (2024-12-31)
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    dateObj = parseISO(date)
  }
  // Formato brasileiro (31/12/2024)
  else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    dateObj = parse(date, 'dd/MM/yyyy', new Date())
  }
  // Formato americano (12-31-2024)
  else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    dateObj = parse(date, 'MM-dd-yyyy', new Date())
  }
  // Formato não reconhecido
  else {
    return {
      isValid: false,
      error:
        'Invalid date format. Expected: YYYY-MM-DD, DD/MM/YYYY, or MM-DD-YYYY',
    }
  }

  // 2. Valida se a data é válida
  if (!isValid(dateObj)) {
    return {
      isValid: false,
      error: 'Invalid date. Please check the date values.',
    }
  }

  // 3. Normaliza a hora (remove segundos se houver)
  const hourNormalized = hour.substring(0, 5) // '10:00:00' -> '10:00'

  // 4. Valida formato da hora
  if (!/^\d{2}:\d{2}$/.test(hourNormalized)) {
    return {
      isValid: false,
      error: 'Invalid hour format. Expected HH:mm (24-hour format)',
    }
  }

  // 5. Valida se a hora é válida (00:00 até 23:59)
  const [hourValue, minuteValue] = hourNormalized.split(':').map(Number)
  if (hourValue < 0 || hourValue > 23 || minuteValue < 0 || minuteValue > 59) {
    return {
      isValid: false,
      error: 'Invalid hour values. Hour must be 00-23 and minutes 00-59',
    }
  }

  // 6. Combina data + hora em UTC
  const dateTimeString = `${format(dateObj, 'yyyy-MM-dd')}T${hourNormalized}:00.000Z`
  const dateTimeObj = new Date(dateTimeString)

  return {
    isValid: true,
    dateTimeString,
    dateTimeObj,
  }
}
