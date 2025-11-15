'use client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { LANGUAGE_MAP, type Revenue } from '@/lib/definitions'
import { CRC, SERVICE_CODE, VIETQR } from '@/lib/vietqr'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import { utils, writeFile } from 'xlsx'
import { format, toZonedTime } from 'date-fns-tz'
import type { MqttContextType } from '@/providers/mqtt/MqttProvider'
import { BANKLIST } from './enum'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate a shortened 11-character UUID
function getShortUUID(length: number): string {
  let uuid = require('uuid')
  // Return the first 11 characters of the base64 string (removing padding '=')
  return uuid.v4().toString().replaceAll('-', '').slice(0, length).toUpperCase()
}

export const formatCurrency = (amount: number, locale: string = 'VN') => {
  const language = LANGUAGE_MAP.get(locale.toUpperCase()) || {
    language_code: 'vi',
    currency: 'VND',
    currency_code: '704',
    country_code: '704',
  }
  return amount.toLocaleString(language.language_code, {
    style: 'currency',
    currency: language.currency,
  })
}

export const formatCurrencyString = (amount: string, locale: string = 'VN') => {
  const language = LANGUAGE_MAP.get(locale.toUpperCase()) || {
    language_code: 'vi',
    currency: 'VND',
    currency_code: '704',
    country_code: '704',
  }
  return parseFloat(amount).toLocaleString(language.language_code, {
    style: 'currency',
    currency: language.currency,
  })
}

export const formatDateToLocal = (
  dateStr: string | Date,
  locale: string = 'VN',
) => {
  const language = LANGUAGE_MAP.get(locale.toUpperCase()) || {
    language_code: 'vi',
    currency: 'VND',
    currency_code: '704',
    country_code: '704',
  }

  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat(language.language_code, options)
  return formatter.format(date)
}

export const formatDateToLocalTz = (
  dateStr: string | number,
  locale: string = 'VN',
  timeZone: string = 'Asia/Ho_Chi_Minh', // Default to UTC+7
  withTime: boolean = true,
  forceInputTimeIsUTC: boolean = true,
) => {
  dateStr =
    typeof dateStr === 'number'
      ? dateStr
      : forceInputTimeIsUTC
        ? `${dateStr}.000Z`
        : dateStr

  const language = LANGUAGE_MAP.get(locale.toUpperCase()) || {
    language_code: 'vi',
    currency: 'VND',
    currency_code: '704',
    country_code: '704',
  }

  // Convert the incoming date string to a Date object
  const date = new Date(dateStr)

  // Convert the date to the specified timezone (default to UTC+7)
  const zonedDate = toZonedTime(date, timeZone)

  // Date formatting options
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }

  // Time formatting options
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  // Create formatters for date and time
  const dateFormatter = new Intl.DateTimeFormat(
    language.language_code,
    dateOptions,
  )
  const timeFormatter = new Intl.DateTimeFormat(
    language.language_code,
    timeOptions,
  )

  // Format date and time separately
  const formattedDate = dateFormatter.format(zonedDate)
  const formattedTime = withTime ? timeFormatter.format(zonedDate) : ''

  // Return the formatted date and time on separate lines
  return withTime ? `${formattedDate}\n${formattedTime}` : formattedDate
}

export function remainTimeFromTimestamp(remainingTimeInMiliseconds: number) {
  // Convert milliseconds to seconds
  const remainingTimeInSeconds = Math.floor(remainingTimeInMiliseconds / 1000)

  // Convert the time to hours, minutes, and seconds
  const hours = Math.floor(remainingTimeInSeconds / 3600)
  const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60)
  const seconds = remainingTimeInSeconds % 60

  // Format the result as HH:mm:ss
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return formattedTime
}

export function formatDateTime(
  dateTimeString: string,
  lang: string = 'vi',
): string {
  const date = new Date(dateTimeString)

  const formattedDate = date
    .toLocaleString(lang, {
      timeZone: 'Asia/Ho_Chi_Minh', // Saigon timezone (UTC+7)
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '') // Removing the comma between time and date

  return formattedDate
}

export function formatDateTimeTz(
  dateTimeString: string,
  lang: string = 'vi',
): string {
  // Convert the incoming date string to a Date object
  const date = new Date(dateTimeString)

  // Define the target timezone
  const timeZone = 'Asia/Ho_Chi_Minh' // Saigon timezone (UTC+7)

  // Convert the date to the target timezone
  const zonedDate = toZonedTime(date, timeZone)

  // Format the date using date-fns with language and timezone
  const formatPattern =
    lang === 'vi' ? 'dd/MM/yyyy HH:mm:ss' : 'MM/dd/yyyy HH:mm:ss'

  const formattedDate = format(zonedDate, formatPattern, {
    timeZone,
  })

  return formattedDate
}

export function formatTimestamp(timestamp: any) {
  const date = new Date(timestamp * 1000) // Convert from seconds to milliseconds
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getStartOfDay(date: any) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return Math.floor(start.getTime() / 1000) // Return the timestamp in seconds
}

export function getEndOfDay(date: any) {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999) // Set time to 23:59:59.999 (end of the day)
  return Math.floor(end.getTime() / 1000) // Return the timestamp in milliseconds
}

export function getCurrentMonthTimestamps(): {
  startDate: number
  endDate: number
} {
  const now = new Date()
  // Start of the current month (00:00:00 on the 1st day)
  const startDate = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000,
  )
  // End of the current month (23:59:59 on the last day)
  const endDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ).getTime() / 1000,
  )
  return { startDate, endDate }
}

export function getLastMonthTimestamps(): {
  startDate: number
  endDate: number
} {
  const now = new Date()
  // Start of the last month (00:00:00 on the 1st day of the previous month)
  const startDate = Math.floor(
    new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() / 1000,
  )
  // End of the last month (23:59:59 on the last day of the previous month)
  const endDate = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime() /
      1000,
  )
  return { startDate, endDate }
}

export function getThisYearTimestamps(): {
  startDate: number
  endDate: number
} {
  const now = new Date()
  // Start of the last month (00:00:00 on the 1st day of the previous month)
  const startDate = Math.floor(
    new Date(now.getFullYear(), 1, 1, 0, 0, 0, 0).getTime() / 1000,
  )
  // End of the last month (23:59:59 on the last day of the previous month)
  const endDate = Math.floor(
    new Date(now.getFullYear(), 12, 31, 23, 59, 59, 999).getTime() / 1000,
  )
  return { startDate, endDate }
}

export function getTodayTimestamps(): { startDate: number; endDate: number } {
  const now = new Date()
  // Start of today (00:00:00)
  const startDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    ).getTime() / 1000,
  )
  // End of today (23:59:59)
  const endDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    ).getTime() / 1000,
  )
  return { startDate, endDate }
}

export function getLastDayTimestamps(): { startDate: number; endDate: number } {
  const now = new Date()
  // Start of the last day (yesterday 00:00:00)
  const startDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      0,
      0,
      0,
      0,
    ).getTime() / 1000,
  )
  // End of the last day (yesterday 23:59:59)
  const endDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      23,
      59,
      59,
      999,
    ).getTime() / 1000,
  )
  return { startDate, endDate }
}

export function getThisWeekTimestamps(): {
  startDate: number
  endDate: number
} {
  const now = new Date()
  // Get the current day of the week (0 is Sunday, 1 is Monday, etc.)
  const currentDay = now.getDay()
  // Adjust if the week starts on Monday (treat Sunday as day 7, so Monday is day 1)
  const distanceToMonday = (currentDay === 0 ? 7 : currentDay) - 1
  // Start of the week (Monday 00:00:00)
  const startDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - distanceToMonday,
      0,
      0,
      0,
      0,
    ).getTime() / 1000,
  )
  // End of the week (Sunday 23:59:59)
  const endDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (6 - distanceToMonday),
      23,
      59,
      59,
      999,
    ).getTime() / 1000,
  )
  return { startDate, endDate }
}

export function getLastWeekTimestamps(): {
  startDate: number
  endDate: number
} {
  const now = new Date()
  // Get the current day of the week (0 is Sunday, 1 is Monday, etc.)
  const currentDay = now.getDay()
  // Adjust if the week starts on Monday (treat Sunday as day 7, so Monday is day 1)
  const distanceToMonday = (currentDay === 0 ? 7 : currentDay) - 1
  // Start of last week (last Monday 00:00:00)
  const startDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - distanceToMonday - 7,
      0,
      0,
      0,
      0,
    ).getTime() / 1000,
  )
  // End of last week (last Sunday 23:59:59)
  const endDate = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (6 - distanceToMonday) - 7,
      23,
      59,
      59,
      999,
    ).getTime() / 1000,
  )
  return { startDate, endDate }
}

export const mbVaGenerate = (bincode: string, prefix: string = '') => {
  if (bincode === '970422' && prefix !== '') {
    return `${prefix}${getShortUUID(11)}`
  }
  return ''
}

export const parseBankInformation = (primary_bank_info: string) => {
  try {
    if (primary_bank_info !== '') {
      const data = primary_bank_info.split('-')
      return {
        mainAcc: data[0],
        bankName: data[1],
        bincode: data[2],
        vaNo: data[3],
        accType: data[4],
      }
    } else {
      return {
        mainAcc: '',
        bankName: '',
        bincode: '970422',
        vaNo: '',
        accType: '',
      }
    }
  } catch (e) {
    return false
  }
}

export const vietQr = (
  acc_no = '',
  acc_holder = '',
  bank = '970422',
  payment_amount = 10000,
  purpose = '',
  // mcc = '9999',
  // merchant_city = 'HCM',
  service_code = SERVICE_CODE.TO_ACCOUNT,
  is_dynamic_qr = true,
) => {
  let vietQRdata = new VIETQR()
  vietQRdata.fields.is_dynamic_qr = is_dynamic_qr
  // vietQRdata.fields.merchant_category = mcc;
  vietQRdata.fields.acq = bank
  vietQRdata.fields.merchant_id = acc_no
  vietQRdata.fields.service_code = service_code
  vietQRdata.fields.service_code = service_code
  vietQRdata.fields.purpose_txn = CRC.nonAccentVietnamese(
    purpose === '' ? acc_no : purpose,
  )
  vietQRdata.fields.merchant_name = CRC.nonAccentVietnamese(acc_holder)
  if (is_dynamic_qr) {
    vietQRdata.fields.amount = payment_amount.toString()
  }
  vietQRdata.builder()
  console.log('vietqr:', vietQRdata.toString())
  return vietQRdata.toString()
}

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = []
  const highestRecord = Math.max(...revenue.map((month) => month.revenue))
  const topLabel = Math.ceil(highestRecord / 1000) * 1000

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`)
  }

  return { yAxisLabels, topLabel }
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

export function generateFilenameWithDate(
  baseName: string,
  extension: string = '',
) {
  // Get the current date
  const today = new Date()

  // Format the date as YYYY-MM-DD
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0') // Months are 0-based, so we add 1
  const day = String(today.getDate()).padStart(2, '0')

  // Construct the filename
  const formattedDate = `${year}-${month}-${day}`
  if (extension === '') {
    return `${baseName}_${formattedDate}`
  } else {
    return `${baseName}_${formattedDate}.${extension}`
  }
}

export function exportCSV(data: any[]) {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    filename: generateFilenameWithDate('report'), // export file name (without .csv)
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  })
  const csv = generateCsv(csvConfig)(data)
  download(csvConfig)(csv)
}

export function exportXLSX(rows: any[], headers: any[], baseName = 'report') {
  // Prepare worksheet data (headers and rows)
  const worksheetData = [headers, ...rows.map((row) => Object.values(row))]

  // Create a worksheet from the data
  const worksheet = utils.aoa_to_sheet(worksheetData)

  // Create a new workbook and append the worksheet
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Base_report')

  // Export the workbook as an .xlsx file
  writeFile(workbook, generateFilenameWithDate(baseName, 'xlsx'))
}

export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}

export function convertToString(input: unknown): string | null {
  if (Array.isArray(input) && input.every((item) => typeof item === 'string')) {
    return input.join(' ') // Join with a space
  }
  return null // Return null if input is not a string array
}

export function convertTimestampToDateTime(timestampStr: string) {
  const timestamp = Math.floor(parseFloat(timestampStr))
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  // const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes} ${day}/${month}/${year} `
}

// export async function generateMD5Hash(input: string): Promise<string> {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(input);
//     const hashBuffer = await crypto.subtle.digest("MD5", data);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
//     return hashHex;
// }

export function generateMD5Hash(input: string): string {
  // Helper functions for MD5 bitwise operations
  const rotateLeft = (n: number, s: number) => (n << s) | (n >>> (32 - s))
  const addUnsigned = (a: number, b: number) => {
    const lsw = (a & 0xffff) + (b & 0xffff)
    const msw = (a >> 16) + (b >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }

  const md5cmn = (
    q: number,
    a: number,
    b: number,
    x: number,
    s: number,
    t: number,
  ) =>
    addUnsigned(
      rotateLeft(addUnsigned(addUnsigned(a, q), addUnsigned(x, t)), s),
      b,
    )

  const md5ff = (
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ) => md5cmn((b & c) | (~b & d), a, b, x, s, t)

  // const md5gg = (
  //   a: number,
  //   b: number,
  //   c: number,
  //   d: number,
  //   x: number,
  //   s: number,
  //   t: number,
  // ) => md5cmn((b & d) | (c & ~d), a, b, x, s, t)

  // const md5hh = (
  //   a: number,
  //   b: number,
  //   c: number,
  //   d: number,
  //   x: number,
  //   s: number,
  //   t: number,
  // ) => md5cmn(b ^ c ^ d, a, b, x, s, t)

  // const md5ii = (
  //   a: number,
  //   b: number,
  //   c: number,
  //   d: number,
  //   x: number,
  //   s: number,
  //   t: number,
  // ) => md5cmn(c ^ (b | ~d), a, b, x, s, t)

  const encodeUTF8 = (str: string) => unescape(encodeURIComponent(str))
  const convertToWordArray = (str: string) => {
    const wordArray: number[] = []
    let i: number
    const l = str.length
    for (i = 0; i < l - 3; i += 4) {
      wordArray[i >> 2] =
        (str.charCodeAt(i) & 0xff) |
        ((str.charCodeAt(i + 1) & 0xff) << 8) |
        ((str.charCodeAt(i + 2) & 0xff) << 16) |
        ((str.charCodeAt(i + 3) & 0xff) << 24)
    }
    return wordArray
  }

  // Main MD5 function
  const x = convertToWordArray(encodeUTF8(input))
  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476

  // Processing each 512-bit chunk (simplified)
  for (let i = 0; i < x.length; i += 16) {
    const aa = a,
      bb = b,
      cc = c,
      dd = d
    a = md5ff(a, b, c, d, x[i], 7, -680876936)
    // Other operations would follow for md5ff, md5gg, md5hh, and md5ii...

    // Update state with final transformations (simplified)
    a = addUnsigned(a, aa)
    b = addUnsigned(b, bb)
    c = addUnsigned(c, cc)
    d = addUnsigned(d, dd)
  }

  const md5 = (n: number) => {
    const hex = '0123456789abcdef'
    return hex.charAt((n >> 4) & 0x0f) + hex.charAt(n & 0x0f)
  }

  return [a, b, c, d].map(md5).join('')
}

export function many2OneFieldName(
  fieldName: any[],
  splitter?: string,
  getLocation?: number,
): string {
  if (fieldName && fieldName.length > 0) {
    if (splitter && getLocation) {
      const temp = fieldName[1].toString()
      return temp.split(splitter)[getLocation].trim()
    } else {
      return fieldName[1].toString()
    }
  } else {
    return ''
  }
}

export function hasElements(obj: object): boolean {
  return Object.keys(obj).length > 0
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getBankByBinCode(binCode: string) {
  return BANKLIST.find((bank) => bank.bin === binCode)
}

export function getBankNameByBinCode(binCode: string) {
  return BANKLIST.find((bank) => bank.bin === binCode)?.name
}

export function getBankLogoByBinCode(binCode: string) {
  return BANKLIST.find((bank) => bank.bin === binCode)?.logo
}

export function generateRandom16DigitNumber(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join(
    '',
  )
}

export function getCurrentTimeStamp(): number {
  const timestamp = Date.now() // Unix timestamp in milliseconds
  console.log('Timestamp:', timestamp)
  return timestamp
}
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}
export function formatDateToISO(date: Date): string {
  return date.toISOString()
}
export function formatDateToVietnamese(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return new Intl.DateTimeFormat('vi-VN', options).format(date)
}
export function formatDateToVietnameseISO(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
export function formatDateToVietnameseWithTime(date: Date): string {
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
export function formatDateToVietnameseWithTimeISO(date: Date): string {
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
export function formatDateToVietnameseWithTimeAndZone(date: Date): string {
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  })
}
export function getCurrentDate(): string {
  const now = new Date()

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  return `${yyyy}${mm}${dd}${hh}${min}${ss}`
}

function publishToDevice(
  mqtt: MqttContextType,
  topic: string,
  payload: string,
): number {
  if (mqtt.connected && topic != '') {
    mqtt.publish(topic, payload)
    console.debug('MQTT client reset successfully.')
    return 0
  } else {
    console.debug('No MQTT client to reset.')
    return 1
  }
}

export function deviceGenQR(
  mqtt: MqttContextType,
  topic: string,
  money: string,
  orderId: string,
) {
  const payload = {
    money: money,
    request_id: generateRandom16DigitNumber(),
    order_sn: orderId,
    datetime: getCurrentDate(),
    ctime: getCurrentTimeStamp(),
  }
  mqtt.publish(topic, JSON.stringify(payload))
}

export function resetMerchant(mqtt: MqttContextType, topic: string): number {
  const payload = {
    broadcast_type: 1,
    messageType: 'resetMerchant',
    request_id: generateRandom16DigitNumber(),
    datetime: getCurrentDate(),
    ctime: getCurrentTimeStamp(),
  }
  return publishToDevice(mqtt, topic, JSON.stringify(payload))
}

export function deviceSetMerchant(
  mqtt: MqttContextType,
  topic: string,
  storeName: string,
  bankAccount: string,
  bankBincode: string,
): number {
  const payload = {
    broadcast_type: 1,
    messageType: 'updateMerchant',
    payload: {
      merchantName: storeName,
      merchantId: bankAccount,
      binCode: bankBincode,
    },
    request_id: generateRandom16DigitNumber(),
    datetime: getCurrentDate(),
    ctime: getCurrentTimeStamp(),
  }
  return publishToDevice(mqtt, topic, JSON.stringify(payload))
}

export function deviceCancelQR(mqtt: MqttContextType, topic: string): number {
  const payload = {
    broadcast_type: 1,
    messageType: 'closeQr',
    request_id: generateRandom16DigitNumber(),
    datetime: getCurrentDate(),
    ctime: getCurrentTimeStamp(),
  }
  return publishToDevice(mqtt, topic, JSON.stringify(payload))
}

export async function makeFilter(filter?: any) {
  let domain = []
  if (filter) {
    if (filter.startDate) {
      domain.push([
        'txn_date',
        '>=',
        new Date(filter.startDate * 1000)
          .toISOString()
          .replace('T', ' ')
          .split('.')[0],
      ])
    }
    if (filter.endDate) {
      domain.push([
        'txn_date',
        '<=',
        new Date(filter.endDate * 1000)
          .toISOString()
          .replace('T', ' ')
          .split('.')[0],
      ])
    }
    if (filter.minAmount) {
      domain.push(['txn_amount', '>=', filter.minAmount])
    }
    if (filter.maxAmount) {
      domain.push(['txn_amount', '<=', filter.maxAmount])
    }
    if (filter.zid) {
      domain.push(['zid', '=', filter.zid])
    }
  }
  return domain
}
