// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
import { z } from 'zod'
import { Minus, Plus } from 'lucide-react'

export enum DateRangeFilter {
  Today = 'today',
  Yesterday = 'yesterday',
  ThisWeek = 'this_week',
  LastWeek = 'last_week',
  ThisMonth = 'this_month',
  LastMonth = 'last_month',
  ThisYear = 'this_year',
  Custom = 'custom',
}
// ===== ZOD MESSAGE TRANSLATION

type Language = 'en' | 'vi' // Add other languages as needed
type TranslationKeys =
  | 'alphanumeric'
  | 'alphanumeric_space_underscore_hyphen'
  | 'max_length_string'
  | 'character'

const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    alphanumeric: 'Only alphanumeric characters',
    alphanumeric_space_underscore_hyphen:
      'Only alphanumeric characters, spaces, underscores, and hyphens are allowed',
    max_length_string: 'String max length',
    character: 'character',
  },
  vi: {
    alphanumeric: 'Chỉ dùng chữ số và chữ',
    alphanumeric_space_underscore_hyphen: `Chỉ dùng chữ số, chữ không dấu, khoảng trắng, gạch ngang '-', gạch chân '_'.`,
    max_length_string: 'Độ dài tối đa',
    character: 'kí tự',
  },
  // Add more languages as needed
}

function getTranslation(key: TranslationKeys, lang: Language = 'vi'): string {
  return translations[lang][key]
}

// ===== ZOD DEFINITIONS ====

export const User = z.object({
  // id: z.string(),
  // name: z.string(),
  // email: z.string(),
  // password: z.string()
  sub: z.string(),
  email_verified: z.boolean(),
  user_id: z.string(),
  name: z.string(),
  preferred_username: z.string(),
  given_name: z.string(),
  locale: z.string(),
  family_name: z.string(),
  email: z.string(),
})

export type UserType = z.infer<typeof User>

export const Invoice = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.number(),
  date: z.string(),
  // In TypeScript, this is called a string union type.
  // It means that the 'status' property can only be one of the two strings: 'pending' or 'paid'.
  status: z.enum(['pending', 'paid']),
})
export type InvoiceType = z.infer<typeof Invoice>

const TRANSACTION_TYPE = ['card', 'wallet', 'ecom', 'ibft', 'cash'] as const
// const IBFT_TXN_TYPE = ['debit', 'credit', 'cross'] as const;
const TRANSACTION_STATUS = [
  'init',
  'auth',
  'void',
  'reversal',
  'refund',
  'cancel',
  'done',
  'settled',
] as const
const WALLET_PROVIDER = ['momo', 'zalo', 'appota'] as const
const CURRENCY_CODE = ['704', '840'] as const

export const BINCODE_MAP = new Map([
  ['970400', 'SGB'],
  ['970403', 'STB'],
  ['970405', 'AGRI'],
  ['970406', 'DAB'],
  ['970407', 'TCB'],
  ['970408', 'GPB'],
  ['970409', 'BAB'],
  ['970412', 'PVC'],
  ['970415', 'VTB'],
  ['970416', 'ACB'],
  ['970418', 'BIDV'],
  ['970488', 'BIDV'],
  ['970419', 'NCB'],
  ['970421', 'VRB'],
  ['970422', 'MB'],
  ['970423', 'TPB'],
  ['970424', 'SHINHAN'],
  ['970425', 'ABB'],
  ['970426', 'MSB'],
  ['970427', 'VAB'],
  ['970428', 'NAB'],
  ['970429', 'SCB'],
  ['970430', 'PGB'],
  ['970431', 'EIB'],
  ['970432', 'VPB'],
  ['970433', 'IVB'],
  ['970436', 'VCB'],
  ['970437', 'HDB'],
  ['970438', 'BVB'],
  ['970439', 'VID'],
  ['970440', 'SEA'],
  ['970441', 'VIB'],
  ['970442', 'HLB'],
  ['970443', 'SHB'],
  ['970444', 'CB'],
  ['970446', 'COOP'],
  ['970448', 'OCB'],
  ['970449', 'LPB'],
  ['970452', 'KLB'],
  ['970454', 'VCCB'],
  ['970455', 'IBK-HN'],
  ['970456', 'IBK-HCM'],
  ['970457', 'WRB'],
  ['970458', 'UOB'],
  ['970459', 'CIMB'],
  ['970460', 'VC'],
  ['970462', 'KOOK-HN'],
  ['970463', 'KOOK-HCM'],
  ['970464', 'CEP'],
  ['970465', 'SINOPAC'],
  ['970466', 'KEB-HCM'],
  ['970467', 'KEB-HN'],
  ['970468', 'MAFC'],
  ['970470', 'SHINSEI'],
])
// const NAPAS_LINK = 'https://vietqr.net/portal-service/resources/icons'
const NAPAS_LINK = '/logo'
export const BINCODE_PNG = new Map([
  ['970400', NAPAS_LINK + '/SGB.png'],
  ['970403', NAPAS_LINK + '/STB.png'],
  ['970405', NAPAS_LINK + '/VBA.png'],
  ['970406', NAPAS_LINK + '/DAB.png'],
  ['970407', NAPAS_LINK + '/TCB.png'],
  ['970408', NAPAS_LINK + '/GPB.png'],
  ['970409', NAPAS_LINK + '/BAB.png'],
  ['970412', NAPAS_LINK + '/PVC.png'],
  ['970415', NAPAS_LINK + '/ICB.png'],
  ['970416', NAPAS_LINK + '/ACB.png'],
  ['970418', NAPAS_LINK + '/BIDV.png'],
  ['970488', NAPAS_LINK + '/BIDV.png'],
  ['970419', NAPAS_LINK + '/NCB.png'],
  ['970421', NAPAS_LINK + '/VRB.png'],
  ['970422', NAPAS_LINK + '/MB.png'],
  ['970423', NAPAS_LINK + '/TPB.png'],
  ['970424', NAPAS_LINK + '/SHINHAN.png'],
  ['970425', NAPAS_LINK + '/ABB.png'],
  ['970426', NAPAS_LINK + '/MSB.png'],
  ['970427', NAPAS_LINK + '/VAB.png'],
  ['970428', NAPAS_LINK + '/NAB.png'],
  ['970429', NAPAS_LINK + '/SCB.png'],
  ['970430', NAPAS_LINK + '/PGB.png'],
  ['970431', NAPAS_LINK + '/EIB.png'],
  ['970432', NAPAS_LINK + '/VPB.png'],
  ['970433', NAPAS_LINK + '/IVB.png'],
  ['970436', NAPAS_LINK + '/VCB.png'],
  ['970437', NAPAS_LINK + '/HDB.png'],
  ['970438', NAPAS_LINK + '/BVB.png'],
  ['970439', NAPAS_LINK + '/VID.png'],
  ['970440', NAPAS_LINK + '/SEA.png'],
  ['970441', NAPAS_LINK + '/VIB.png'],
  ['970442', NAPAS_LINK + '/HLB.png'],
  ['970443', NAPAS_LINK + '/SHB.png'],
  ['970444', NAPAS_LINK + '/CB.png'],
  ['970446', NAPAS_LINK + '/COOP.png'],
  ['970448', NAPAS_LINK + '/OCB.png'],
  ['970449', NAPAS_LINK + '/LPBANK.png'],
  ['970452', NAPAS_LINK + '/KLB.png'],
  ['970454', NAPAS_LINK + '/VCCB.png'],
  ['970455', NAPAS_LINK + '/IBK-HN.png'],
  ['970456', NAPAS_LINK + '/IBK-HCM.png'],
  ['970457', NAPAS_LINK + '/WRB.png'],
  ['970458', NAPAS_LINK + '/UOB.png'],
  ['970459', NAPAS_LINK + '/CIMB.png'],
  ['970460', NAPAS_LINK + '/VC.png'],
  ['970462', NAPAS_LINK + '/KOOK-HN.png'],
  ['970463', NAPAS_LINK + '/KOOK-HCM.png'],
  ['970464', NAPAS_LINK + '/CEP.png'],
  ['970465', NAPAS_LINK + '/SINOPAC.png'],
  ['970466', NAPAS_LINK + '/KEB-HCM.png'],
  ['970467', NAPAS_LINK + '/KEB-HN.png'],
  ['970468', NAPAS_LINK + '/MAFC.png'],
  ['970470', NAPAS_LINK + '/SHINSEI.png'],
  ['888899', NAPAS_LINK + '/VCB.png'],
])
export const BINCODE_NAME = new Map([
  ['970400', 'Ngân hàng TMCP Sài Gòn Công Thương'],
  ['970403', 'Ngân hàng TMCP Sài Gòn Thương Tín'],
  ['970405', 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam '],
  ['970406', 'Ngân hàng TMCP Đông Á'],
  ['970407', 'Ngân hàng TMCP Kỹ Thương Việt Nam'],
  ['970408', 'Ngân hàng TNHH Một Thành Viên Dầu Khí Toàn Cầu'],
  ['970409', 'Ngân hàng TMCP Bắc Á'],
  ['970410', 'Ngân hàng TNHH Một Thành Viên Standard Chartered  '],
  ['970412', 'Ngân hàng TMCP Đại Chúng Việt Nam'],
  ['970414', 'Ngân hàng TNHH Một Thành Viên Đại Dương'],
  ['970415', 'Ngân hàng TMCP Công Thương Việt Nam'],
  ['970416', 'Ngân hàng TMCP Á Châu'],
  ['970418', 'Ngân hàng Đầu tư và Phát triển Việt Nam'],
  ['970488', 'Ngân hàng Đầu tư và Phát triển Việt Nam'],
  ['970419', 'Ngân hàng TMCP Quốc Dân'],
  ['970421', 'Ngân hàng Liên doanh Việt Nga'],
  ['970422', 'Ngân hàng TMCP Quân Đội'],
  ['970423', 'Ngân hàng TMCP Tiên Phong'],
  ['970424', 'Ngân hàng TNHH Một Thành Viên Shinhan Việt Nam'],
  ['970425', 'Ngân hàng TMCP An Bình'],
  ['970426', 'Ngân hàng TMCP Hàng Hải '],
  ['970427', 'Ngân hàng TMCP Việt Á'],
  ['970428', 'Ngân hàng TMCP Nam Á'],
  ['970429', 'Ngân hàng TMCP Sài Gòn'],
  ['970430', 'Ngân hàng TMCP Xăng dầu Petrolimex'],
  ['970431', 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam'],
  ['970432', 'Ngân hàng TMCP Việt Nam Thịnh Vượng'],
  ['970433', 'Ngân hàng TNHH Indovina'],
  ['970436', 'Ngân hàng TMCP Ngoại thương Việt Nam'],
  ['970437', 'Ngân hàng TMCP Phát triển TP.HCM'],
  ['970438', 'Ngân hàng TMCP Bảo Việt'],
  ['970439', 'Ngân hàng TNHH Một Thành Viên Public Việt Nam'],
  ['970440', 'Ngân hàng TMCP Đông Nam Á'],
  ['970441', 'Ngân hàng TMCP Quốc Tế Việt Nam'],
  ['970442', 'Ngân hàng TNHH Một Thành Viên Hong Leong Việt Nam'],
  ['970443', 'Ngân hàng TMCP Sài Gòn – Hà Nội'],
  ['970444', 'Ngân hàng TNHH Một Thành Viên Xây Dựng Việt Nam'],
  ['970446', 'Ngân hàng Hợp Tác Xã Việt Nam'],
  ['970448', 'Ngân hàng TMCP Phương Đông'],
  ['970449', 'Ngân hàng TMCP Bưu Điện Liên Việt'],
  ['970452', 'Ngân hàng TMCP Kiên Long'],
  ['970454', 'Ngân hàng TMCP Bản Việt'],
  ['970455', 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội'],
  ['970456', 'Ngân hàng Industrial Bank of Korea - Chi nhánh Hồ Chí Minh'],
  ['970457', 'Ngân hàng TNHH Một Thành Viên Woori Bank Việt Nam'],
  ['970458', 'Ngân hàng TNHH Một Thành Viên UOB Việt Nam'],
  ['970459', 'Ngân hàng TNHH Một Thành Viên CIMB Việt Nam'],
  ['970460', 'Công ty Tài chính cổ phần Xi Măng'],
  ['970462', 'Ngân hàng Kookmin - Chi nhánh Hà Nội'],
  ['970463', 'Ngân hàng Kookmin - Chi nhánh Tp. Hồ Chí Minh'],
  ['970464', 'Công ty Tài chính TNHH MTV CỘNG ĐỒNG'],
  ['970465', 'Ngân hàng SINOPAC - Chi nhánh Tp. Hồ Chí Minh'],
  ['970466', 'Ngân hàng KEB HANA - Chi nhánh Tp. Hồ Chí Minh'],
  ['970467', 'Ngân hàng KEB HANA - Chi nhánh Hà Nội'],
  ['970468', 'Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam)'],
  ['970470', 'Công ty Tài chính TNHH MB SHINSEI'],
  ['888899', 'Ngân hàng TMCP Ngoại thương Việt Nam'],
])

export const LANGUAGE_MAP = new Map([
  [
    'US',
    {
      language_code: 'en_US',
      currency: 'USD',
      currency_code: '840',
      country_code: '840',
    },
  ],
  [
    'VN',
    {
      language_code: 'vi',
      currency: 'VND',
      currency_code: '704',
      country_code: '704',
    },
  ],
])

export const CURRENCY_ENUM = new Map([
  ['704', 'VND'],
  ['840', 'USD'],
])

export const CASH_FLOW = [
  {
    value: 'false',
    label: 'Báo có',
    icon: Plus,
  },
  {
    value: 'true',
    label: 'Báo nợ',
    icon: Minus,
  },
]

const PosTransaction = z.object({
  name: z.date().describe('Transaction ID'), // Transaction ID
  txn_date: z.date().describe('Transaction Date'), // Transaction Date
  txn_type: z
    .enum(['card', 'other_type'])
    .default('card')
    .describe('Transaction Type'), // Transaction Type
  txn_status: z.enum(['status1', 'status2']).describe('Transaction Status'), // Transaction Status
  txn_amount: z.number().describe('Transaction Amount'), // Transaction Amount
  txn_fee: z.number().describe('Transaction Fee'), // Transaction Fee
  currency: z
    .enum(['704', 'other_currency'])
    .default('704')
    .describe('Currency'), // Currency
  narrative: z.string().optional().describe('Narrative'), // Narrative
  bill_id: z.string().optional().describe('Bill ID'), // Bill ID
  merchant_id: z.string().optional().describe('Merchant ID'), // Merchant ID
  merchant_name: z.string().optional().describe('Merchant Name'), // Merchant Name
  terminal_id: z.string().optional().describe('Terminal ID'), // Terminal ID
  card_no: z.string().optional().describe('Card No'), // Card No
  bank_id: z.number().describe('Card Issuer (Bank ID)'), // Card Issuer (Bank ID)
  bank_name: z.string().describe('Issuer Code'), // Issuer Code
  bank_bincode: z.string().describe('Issuer Bincode'), // Issuer Bincode
  e_receipt: z.string().optional().describe('E-Receipt Link'), // E-Receipt Link
})

export type PosTransaction = z.infer<typeof PosTransaction>
// Create zod obj for table
export const VaTransaction = z.object({
  is_debit: z.boolean().describe('Is Debit'),
  name: z.date().describe('Transaction ID'), // Transaction ID
  txn_date: z.date().describe('Transaction Date'), // Transaction Date
  txn_type: z
    .enum(TRANSACTION_TYPE)
    .default('ibft')
    .describe('Transaction Type'), // Transaction Type
  txn_status: z.enum(TRANSACTION_STATUS).describe('Transaction Status'), // Transaction Status
  txn_amount: z.number().describe('Transaction Amount'), // Transaction Amount
  txn_fee: z.number().describe('Transaction Fee'), // Transaction Fee
  currency: z.enum(CURRENCY_CODE).default('704').describe('Currency'), // Currency
  narrative: z.string().optional().describe('Narrative'), // Narrative
  bill_id: z.string().optional().describe('Bill ID'), // Bill ID
  merchant_id: z.string().optional().describe('Merchant ID'), // Merchant ID
  merchant_name: z.string().optional().describe('Merchant Name'), // Merchant Name
  frm_acc_no: z.string().optional().describe('From Account No'), // From Account No
  frm_acc_name: z.string().optional().describe('From Holder Name'), // From Holder Name
  frm_acc_bincode: z.string().optional().describe('From Account BinCode'), // From Account BinCode
  frm_acc_bankname: z.string().optional().describe('From Account Bank'), // From Account Bank
  to_acc_va: z.string().optional().describe('To Account V/A'), // To Account V/A
  to_acc_no: z.string().optional().describe('To Account No'), // To Account No
  to_acc_name: z.string().optional().describe('To Holder Name'), // To Holder Name
  to_acc_bincode: z.string().optional().describe('To Account BinCode'), // To Account BinCode
  to_acc_bankname: z.string().optional().describe('To Account Bank'), // To Account Bank
})
export type VaTransactionType = z.infer<typeof VaTransaction>

export const WalletTransaction = z.object({
  name: z.date().describe('Transaction ID'), // Transaction ID
  txn_date: z.date().describe('Transaction Date'), // Transaction Date
  txn_type: z
    .enum(TRANSACTION_TYPE)
    .default('wallet')
    .describe('Transaction Type'), // Transaction Type
  txn_status: z.enum(TRANSACTION_STATUS).describe('Transaction Status'), // Transaction Status
  txn_amount: z.number().describe('Transaction Amount'), // Transaction Amount
  txn_fee: z.number().describe('Transaction Fee'), // Transaction Fee
  currency: z.enum(CURRENCY_CODE).default('704').describe('Currency'), // Currency
  narrative: z.string().optional().describe('Narrative'), // Narrative
  bill_id: z.string().optional().describe('Bill ID'), // Bill ID
  merchant_id: z.string().optional().describe('Merchant ID'), // Merchant ID
  merchant_name: z.string().optional().describe('Merchant Name'), // Merchant Name
  wallet_provider: z.enum(WALLET_PROVIDER).describe('Wallet Provider'), // Wallet Provider
})
export type WalletTransactionType = z.infer<typeof WalletTransaction>

export const BankAccount = z.object({
  acc_no: z.string(),
  bincode: z.string().optional(),
  acc_holder: z.string(),
  acc_holder_email: z.string(),
  acc_holder_zid: z.string(),
  active: z.boolean().optional(),
  va_prefix: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val))
    .optional(),
})

export type BankAccountType = z.infer<typeof BankAccount>

export const VirtualAccount = z.object({
  acc_holder: z.string(),
  acc_holder_email: z.string(),
  acc_holder_zid: z.string(),
  acc_no: z.string(),
  active: z.boolean(),
  bincode: z.string(),
  ipn_url_dev: z.string(),
  ipn_url_prod: z.string(),
  va_is_verify: z.boolean(),
  va_name: z.string(),
  va_no: z.string(),
  va_onetime: z.boolean(),
  va_prefix: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val))
    .optional(),
})
export type VirtualAccountType = z.infer<typeof VirtualAccount>

const createVaAccount = (lang: Language = 'vi') =>
  z.object({
    id: z.number().optional(),
    acc_number: z
      .string()
      .max(
        20,
        getTranslation('max_length_string', lang) +
          ' ' +
          20 +
          ' ' +
          getTranslation('character', lang),
      )
      .regex(/^[a-zA-Z0-9]+$/, {
        message: getTranslation('alphanumeric', lang),
      }),
    acc_holder_name: z
      .union([
        z
          .string()
          .max(
            200,
            getTranslation('max_length_string', lang) +
              ' ' +
              200 +
              ' ' +
              getTranslation('character', lang),
          )
          .regex(/^[a-zA-Z0-9 _-]+$/, {
            message: getTranslation(
              'alphanumeric_space_underscore_hyphen',
              lang,
            ),
          }),
        z.literal(false),
      ])
      .transform((val) => (val === false ? '' : val))
      .optional(),
    acc_type: z.string(),
    partner_id: z.array(z.union([z.string(), z.number()])),
    zid: z.string(),
    allow_out_payment: z.boolean(),
    proxy_type: z
      .union([z.string(), z.literal(false)])
      .transform((val) => (val === false ? 0 : val))
      .optional(),
    proxy_name: z
      .union([
        z
          .string()
          .max(
            20,
            getTranslation('max_length_string', lang) +
              ' ' +
              20 +
              ' ' +
              getTranslation('character', lang),
          )
          .regex(/^[a-zA-Z0-9 _-]+$/, {
            message: getTranslation(
              'alphanumeric_space_underscore_hyphen',
              lang,
            ),
          }),
        z.literal(false),
      ])
      .transform((val) => (val === false ? '' : val))
      .optional(),
    proxy_value: z.string(),
    active: z.boolean(),
    bank_name: z.string(),
    bank_bic: z.string(),
    ipn_url_prod: z
      .union([z.string(), z.literal(false)])
      .transform((val) => (val === false ? 0 : val))
      .optional(),
    ipn_url_dev: z
      .union([z.string(), z.literal(false)])
      .transform((val) => (val === false ? 0 : val))
      .optional(),
    identity_no: z
      .union([
        z
          .string()
          .max(
            20,
            getTranslation('max_length_string', lang) +
              ' ' +
              20 +
              ' ' +
              getTranslation('character', lang),
          ),
        z.literal(false),
      ])
      .transform((val) => (val === false ? 0 : val))
      .optional(),
    phone: z
      .union([
        z
          .string()
          .max(
            20,
            getTranslation('max_length_string', lang) +
              ' ' +
              15 +
              ' ' +
              getTranslation('character', lang),
          ),
        z.literal(false),
      ])
      .transform((val) => (val === false ? 0 : val))
      .optional(),
    tid: z.string().default('').optional(),
  })
export const vaAccount = createVaAccount()
export type VaAccount = z.infer<typeof vaAccount>

// ========== CREATE CHANNEL QR =========
const createChannelQR = (lang: Language = 'vi') =>
  createVaAccount(lang).extend({
    is_new_account: z.boolean().default(false),
  })
export const channelQR = createChannelQR()
export type ChannelQR = z.infer<typeof channelQR>
// ========== COMPONENT'S SCHEMA ========
const creatBankFormSchema = () =>
  z.object({
    acc_no: z
      .string()
      .min(2, { message: 'Số tài khoản có độ dài tối thiểu 2 kí tự' }),
    acc_holder: z
      .string()
      .min(2, { message: 'Tên chủ tài khoản có độ dài tối thiểu 2 kí tự' }),
    acc_holder_email: z
      .string()
      .min(2, { message: 'Email có độ dài tối thiểu 2 kí tự' }),
    acc_holder_zid: z.string().optional(),
    national_id: z
      .string()
      .min(2, { message: 'Mã số thuế có độ dài tối thiểu 2 kí tự' }),
    phone_number: z
      .string()
      .length(10)
      .min(10, { message: 'Số điện thoại có độ dài 10 kí tự' }),
    bincode: z
      .string()
      .length(6)
      .min(6, { message: 'Bincode phải có 6 kí tự' })
      .optional(),
    trans_type: z
      .string()
      .length(2)
      .max(2, { message: 'Loại giao dịch có độ dài tối thiểu 2 kí tự' })
      .default('DC')
      .optional(),
    va_status: z.boolean().default(false).optional(),
    tid: z.string().optional(),
    qrmms: z.boolean().default(false).optional(),
    bdsd: z.boolean().default(false).optional(),
  })

export const bankFormSchema = creatBankFormSchema()
export type BankFormSchema = z.infer<typeof bankFormSchema>

export type Revenue = {
  month: string
  revenue: number
}

export type LatestInvoice = {
  id: string
  name: string
  image_url: string
  email: string
  amount: string
}

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number
}

export type InvoicesTable = {
  id: string
  customer_id: string
  name: string
  email: string
  image_url: string
  date: string
  amount: number
  status: 'pending' | 'paid'
}

export type CustomersTableType = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: number
  total_paid: number
}

export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: string
  total_paid: string
}

export type CustomerField = {
  id: string
  name: string
}

// Invoice Model
export type InvoiceForm = {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export const merchantInfo = z.object({
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val))
    .optional(),
  industry_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  ipn_url_dev: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ipn_url_prod: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  zid: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  sub: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  primary_bank_account: z.array(z.union([z.string(), z.bigint()])).default([]),
  bank_list: z.array(z.any()).default([{}]),
  user_ids: z.array(z.any()).default([{}]).optional(),
})

export type MerchantInfo = z.infer<typeof merchantInfo>

export const merchantChannelInfo = z.object({
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val))
    .optional(),
  ipn_url_dev: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  ipn_url_prod: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  zid: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  country_id: z
    .union([z.string().default('VN'), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  state_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  district_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ward_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  need_va: z.boolean().default(true),
  va_no: z.string().optional().default(''),
  bank_acc_no: z.string().optional(),
  channel_type: z
    .union([z.number(), z.string(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  active: z.boolean().default(true),
})

export type MerchantChannelInfo = z.infer<typeof merchantChannelInfo>
export const merchantInvoice = z.object({
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  access_url: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ref: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  date: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  state: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  move_type: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  payment_id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  type_name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  invoice_date: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  invoice_date_due: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  amount_untaxed: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  amount_tax: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  amount_total: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  amount_residual: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  amount_untaxed_signed: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  amount_tax_signed: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  amount_total_signed: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  payment_state: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  amount_total_words: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  invoice_partner_display_name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  qr_string: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  qr_raw_data: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
})
export type MerchantInvoice = z.infer<typeof merchantInvoice>

export const dashboardProps = z.object({
  cashInDaily: z.any().default(0),
  cashOutDaily: z.any().default(0),
  revenueDaily: z.any().default(0),
  totalTransaction: z.any().default(0),
  cashInTxnNumber: z.any().default(0),
})
export type DashboardPropsType = z.infer<typeof dashboardProps>

export const summaryCardProps = z.object({
  total: z.number().default(0),
  noTxn: z.number().default(0),
})
export type SummaryCardProps = z.infer<typeof summaryCardProps>

export const editForm = z.object({
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val))
    .optional(),
  industry_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  ipn_url_dev: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ipn_url_prod: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  zid: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
})

export type EditForm = z.infer<typeof editForm>

export const branchInfo = z.object({
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val))
    .optional(),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  display_name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  telegram_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ref_code: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  primary_bank_account: z.array(z.union([z.string(), z.bigint()])).default([]),
  country_id: z.array(z.union([z.string(), z.bigint()])).default([]),
  state_id: z.array(z.union([z.string(), z.bigint()])).default([]),
  district_id: z.array(z.union([z.string(), z.bigint()])).default([]),
  ward_id: z.array(z.union([z.string(), z.bigint()])).default([]),
  parent_id: z.array(z.union([z.string(), z.bigint()])).default([]),
  child_ids: z.array(z.union([z.string(), z.bigint()])).default([]),
  channel_ids: z.array(z.union([z.string(), z.bigint()])).default([]),
  create_date: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
})
export type BranchInfo = z.infer<typeof branchInfo>

export const branchAddEditInfo = z.object({
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  display_name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  parent_ref_code: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .default('false'),
  password: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  ipn_url_dev: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .default('https://'),
  ipn_url_prod: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .default('https://'),
  telegram_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .default(''),
})

export type BranchAddEditInfo = z.infer<typeof branchAddEditInfo>

export const currentUserInfo = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  login: z.string(),
  sub: z.string(),
  company_id: z.array(z.union([z.string(), z.bigint()])).default([]),
  company_ids: z.array(z.union([z.string(), z.bigint()])).default([]),
  lang: z.string(),
  avatar_512: z.string(),
})

export type CurrentUserInfo = z.infer<typeof currentUserInfo>

export const currentMerchantInfo = z.object({
  active: z.boolean(),
  bank_account_count: z.number(),
  channel_type: z.array(z.union([z.string(), z.bigint()])).default([]),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  company_ref_code: z.string(),
  company_type: z.string(),
  contact_address_complete: z.string(),
  country_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  create_date: z.string(),
  display_name: z.string(),
  district_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  image_medium: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  industry_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  ipn_url_dev: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ipn_url_prod: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  parent_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  pos_config: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  primary_bank_account: z
    .union([z.array(z.any()).default([]), z.literal(false)])
    .transform((val) => (val === false ? [] : val)),
  property_product_pricelist: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  socket_topic: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  state_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  telegram_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  type: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  wallet_config: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  ward_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  zid: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
})

export type CurrentMerchantInfo = z.infer<typeof currentMerchantInfo>

export const rootCompany = z.object({
  active: z.boolean(),
  bank_ids: z.union([z.array(z.any()), z.literal(false)]),
  child_ids: z.union([z.array(z.any()), z.literal(false)]),
  city: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  contact_address_complete: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  country_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  create_date: z.string(),
  default_bank_acc: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  display_name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  district_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  email: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  id: z
    .union([z.number(), z.literal(false)])
    .transform((val) => (val === false ? 0 : val)),
  mobile: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  name: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  parent_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  phone: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  ref_code: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  socket_topic: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  state_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
  street: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  street2: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  telegram_id: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  va_prefix: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val)),
  vat: z
    .union([z.string(), z.literal(false)])
    .transform((val) => (val === false ? '' : val))
    .optional(),
  ward_id: z.union([
    z.array(z.union([z.string(), z.bigint()])).default([]),
    z.literal(false),
  ]),
})
export type RootCompany = z.infer<typeof rootCompany>
