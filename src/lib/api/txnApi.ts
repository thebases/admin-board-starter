import { BankTxnRpc } from '../jsonrpc'
import { makeFilter } from '../utils'
export const TABLE_FIELDS = [
  'id',
  'name',
  'bank_txn_id',
  'napas_txn_id',
  'txn_date',
  'txn_date_timestamp',
  'bank_date_timestamp',
  'txn_type',
  'txn_status',
  'txn_amount',
  'is_debit',
  'txn_fee',
  'currency',
  'narrative',
  'bill_id',
  'zid',
  'proxy_zid',
  'terminal_id',
  'rate',
  'company_ref_code',
  'merchant_name',
  'frm_acc_no',
  'frm_acc_name',
  'frm_acc_bincode',
  'frm_acc_bankname',
  'to_acc_va',
  'to_acc_no',
  'to_acc_name',
  'to_acc_bincode',
  'to_acc_bankname',
  'to_acc_id',
  'bank_acc_id',
  'partner_id',
  'company_id',
  'history',
  'display_name',
]
// Get IBFT transaction
export async function fetchBankTxn(
  filter?: {
    startDate?: number
    endDate?: number
    minAmount?: number
    maxAmount?: number
    zid?: string
    ref_code?: string
  },
  fields?: any[],
) {
  const domain = await makeFilter(filter)
  const response = await BankTxnRpc.search(domain, fields)
  return await response.result
}
export async function fetchBankTxnGroup(
  filter?: {
    startDate?: number
    endDate?: number
    minAmount?: number
    maxAmount?: number
    frm_acc_no?: string
    to_acc_no?: string
    zid?: string
    ref_code?: string
  },
  fields: any[] = [],
  groupby: string = '',
  orderby: boolean | string = false,
  offset: number = 0,
  limit: number = 80,
) {
  const domain = await makeFilter(filter)
  console.log('fetchBankTxnGroup domain', domain)
  const response = await BankTxnRpc.read_group(
    domain,
    fields,
    groupby,
    offset,
    limit,
    orderby,
  )
  // console.log('fetchBankTxnGroup', response)
  return await response.result
}
