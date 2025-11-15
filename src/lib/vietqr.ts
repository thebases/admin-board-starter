/*
 * #  Copyright (c) by The Base, 2024.
 * #  License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
 * #  These code are maintained by The Base.
 */
'use strict'

// Constants and tools
export const SERVICE_CODE = {
  PAYMENT: 'QRPUSH',
  TO_CARD: 'QRIBFTTC',
  TO_ACCOUNT: 'QRIBFTTA',
} as const

export const NAPAS_GUID: string = 'A000000727'

export const CURRENCY = {
  VND: '704',
  USD: '840',
} as const

export interface Fields {
  is_dynamic_qr: boolean
  merchant_category: string
  merchant_name: string
  merchant_city: string
  postal_code: string
  currency: string
  country_code: string
  amount: string
  acq: string
  merchant_id: string
  service_code: string
  bill_number: string
  mobile_number: string
  store_label: string
  loyalty_number: string
  ref_label: string
  customer_label: string
  terminal_label: string
  purpose_txn: string
  additional_data: string
  lang_ref: string
  local_merchant_name: string
  local_merchant_city: string
  uuid: string
  ipn_url: string
  app_package_name: string
  custom_data: string
}

export const FIELDS: Fields = {
  is_dynamic_qr: true,
  merchant_category: '',
  merchant_name: '',
  merchant_city: '',
  postal_code: '',
  currency: '704',
  country_code: 'VN',
  amount: '0',
  acq: '970403',
  merchant_id: '',
  service_code: SERVICE_CODE.TO_ACCOUNT,
  bill_number: '',
  mobile_number: '',
  store_label: '',
  loyalty_number: '',
  ref_label: '',
  customer_label: '',
  terminal_label: '',
  purpose_txn: '',
  additional_data: '',
  lang_ref: '',
  local_merchant_name: '',
  local_merchant_city: '',
  uuid: '',
  ipn_url: '',
  app_package_name: '',
  custom_data: '',
}

export const CRC = {
  stringToUtf8ByteArray(str: string): number[] {
    const out: number[] = []
    let p = 0
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i)
      if (c < 128) {
        out[p++] = c
      } else if (c < 2048) {
        out[p++] = (c >> 6) | 192
        out[p++] = (c & 63) | 128
      } else if (
        (c & 0xfc00) === 0xd800 &&
        i + 1 < str.length &&
        (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00
      ) {
        const combined =
          0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff)
        out[p++] = (combined >> 18) | 240
        out[p++] = ((combined >> 12) & 63) | 128
        out[p++] = ((combined >> 6) & 63) | 128
        out[p++] = (combined & 63) | 128
      } else {
        out[p++] = (c >> 12) | 224
        out[p++] = ((c >> 6) & 63) | 128
        out[p++] = (c & 63) | 128
      }
    }
    return out
  },

  getCrc16(str: string, offset = 0): string {
    const data = this.stringToUtf8ByteArray(str)
    if (!data || offset < 0 || offset > data.length - 1) {
      return '0'
    }

    let crc = 0xffff
    for (let i = 0; i < str.length; ++i) {
      crc ^= data[offset + i] << 8
      for (let j = 0; j < 8; ++j) {
        crc = (crc & 0x8000) > 0 ? (crc << 1) ^ 0x1021 : crc << 1
      }
    }

    const crc_result = (crc & 0xffff).toString(16).toUpperCase()
    return crc_result.padStart(4, '0')
  },

  getCrc16_array(text: string | string[][], hex_output = true): string {
    if (!Array.isArray(text)) text = [[text]]

    const polynomial = 0x1021
    const result = text.map((row) =>
      row.map((string) => {
        if (!string.length) return null

        const bytes = Array.from(string).map(
          (char) => char.charCodeAt(0) & 0xff,
        )
        let crc = 0xffff

        bytes.forEach((byte) => {
          for (let i = 0; i < 8; i++) {
            const bit = ((byte >> (7 - i)) & 1) === 1
            const c15 = ((crc >> 15) & 1) === 1
            crc <<= 1
            if (c15 !== bit) crc ^= polynomial
          }
        })

        crc &= 0xffff
        return hex_output ? crc.toString(16).toUpperCase() : crc
      }),
    )
    const crc_result = result.toString()
    return crc_result.padStart(4, '0')
  },

  nonAccentVietnamese(str: string): string {
    // console.log('nonAccentVietnamese: ', str)
    return str
      .toString()
      .toLowerCase()
      .replace(new RegExp('/', 'g'), '-')
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
      .replace(/\u02C6|\u0306|\u031B/g, '')
      .toUpperCase()
      .trim()
  },
}

export class TLV {
  tagId: number
  tagName: string
  tagLength: number
  tagValue: string | TLV[] | null
  presense: string

  constructor(
    id = 0,
    name = '',
    length = 99,
    is_fixed = true,
    presense = 'O',
    value: string | TLV[] | null = '',
  ) {
    this.tagId = id
    this.tagName = name
    this.tagLength = is_fixed ? length : name.length
    this.tagValue = value
    this.presense = presense
  }

  toString(): string {
    const value: any = Array.isArray(this.tagValue)
      ? this.tagValue
          .map((de) => (de instanceof TLV ? de.toString() : ''))
          .join('')
      : this.tagValue

    if (value === '') {
      return ''
    } else {
      this.tagLength = value.length
      return `${this.tagId >= 10 ? `${this.tagId}` : `0${this.tagId}`}${this.tagLength >= 10 ? `${this.tagLength}` : `0${this.tagLength}`}${value}`
    }
  }
}

export class VIETQR {
  data: TLV[]
  fields: Fields

  constructor() {
    this.data = []
    this.fields = FIELDS
  }

  toString(): string {
    const str = this.data
      .map((de) => (de instanceof TLV ? de.toString() : ''))
      .join('')
    const semi_vietqr = `${str}6304`
    const crc_value = CRC.getCrc16_array(semi_vietqr)
    return `${semi_vietqr}${crc_value}`
  }

  builder(): void {
    this.data[0] = new TLV(0, 'Payload Format Indicator', 2, true, 'M', '01')
    this.data[1] = new TLV(
      1,
      'QR Type',
      2,
      true,
      'M',
      this.fields.is_dynamic_qr ? '12' : '11',
    )
    this.data[38] = new TLV(
      38,
      'QR code service on NAPAS system',
      99,
      false,
      'M',
      [
        new TLV(
          0,
          'Global Unique Identifier - GUID',
          99,
          false,
          'M',
          NAPAS_GUID,
        ),
        new TLV(1, 'Acquirer Information', 99, false, 'M', [
          new TLV(
            0,
            'Merchant Account Information',
            6,
            false,
            'M',
            this.fields.acq,
          ),
          new TLV(1, 'Merchant ID', 19, true, 'M', this.fields.merchant_id),
        ]),
        new TLV(2, 'Service Code', 10, true, 'M', this.fields.service_code),
      ],
    )
    this.data[52] = new TLV(
      52,
      'Merchant Category',
      4,
      true,
      'M',
      this.fields.merchant_category,
    )
    this.data[53] = new TLV(
      53,
      'Transaction Currency',
      3,
      true,
      'M',
      this.fields.currency,
    )
    if (this.fields.is_dynamic_qr) {
      this.data[54] = new TLV(
        54,
        'Transaction Amount',
        13,
        false,
        'O',
        this.fields.amount ? this.fields.amount : '0',
      )
    }
    this.data[58] = new TLV(
      58,
      'Country Code',
      2,
      true,
      'M',
      this.fields.country_code,
    )
    this.data[59] = new TLV(
      59,
      'Merchant Name',
      25,
      false,
      'M',
      this.fields.merchant_name,
    )
    this.data[60] = new TLV(
      60,
      'Merchant City',
      15,
      false,
      'M',
      this.fields.merchant_city,
    )
    this.data[62] = new TLV(
      62,
      'Additional Data Field Template',
      100,
      false,
      'O',
      [
        new TLV(1, 'Bill Number', 25, false, 'C', this.fields.bill_number),
        new TLV(2, 'Mobile Number', 25, false, 'C', this.fields.mobile_number),
        new TLV(3, 'Store Label', 25, false, 'C', this.fields.store_label),
        new TLV(
          4,
          'Loyalty Number',
          25,
          false,
          'C',
          this.fields.loyalty_number,
        ),
        new TLV(5, 'Reference Label', 25, false, 'C', this.fields.ref_label),
        new TLV(
          6,
          'Customer Label',
          25,
          false,
          'C',
          this.fields.customer_label,
        ),
        new TLV(
          7,
          'Terminal Label',
          25,
          false,
          'C',
          this.fields.terminal_label,
        ),
        new TLV(
          8,
          'Purpose of Transaction',
          25,
          false,
          'C',
          this.fields.purpose_txn,
        ),
        new TLV(
          9,
          'Additional Data',
          25,
          false,
          'C',
          this.fields.additional_data,
        ),
        new TLV(10, 'Language Preference', 2, true, 'C', this.fields.lang_ref),
        new TLV(
          11,
          'Merchant Name - Alternate Language',
          25,
          false,
          'C',
          this.fields.local_merchant_name,
        ),
        new TLV(
          12,
          'Merchant City - Alternate Language',
          25,
          false,
          'C',
          this.fields.local_merchant_city,
        ),
        new TLV(13, 'UUID', 36, false, 'M', this.fields.uuid),
        new TLV(14, 'IPN URL', 25, false, 'C', this.fields.ipn_url),
        new TLV(
          15,
          'App Package Name',
          25,
          false,
          'C',
          this.fields.app_package_name,
        ),
        new TLV(16, 'Custom Data', 100, false, 'C', this.fields.custom_data),
      ],
    )
  }
}

export const genVietQR = (
  amount: string,
  bincode: string,
  account: string,
  purpose: string,
  storeName: string,
): string => {
  let vietQRdata = new VIETQR()
  const isDynamic = parseFloat(amount) > 0
  vietQRdata.fields.is_dynamic_qr = isDynamic
  vietQRdata.fields.acq = bincode
  vietQRdata.fields.merchant_id = account
  vietQRdata.fields.service_code = SERVICE_CODE.TO_ACCOUNT
  vietQRdata.fields.purpose_txn = CRC.nonAccentVietnamese(
    purpose === '' ? account : purpose,
  )
  vietQRdata.fields.merchant_name = CRC.nonAccentVietnamese(storeName)

  vietQRdata.fields.amount = amount
  vietQRdata.builder()
  return vietQRdata.toString()
}
