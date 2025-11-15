import { BankRpc } from '../jsonrpc'

export async function GetBankList(partner_id: string) {
  return await BankRpc.search(
    [
      ['is_main_account', '=', true],
      ['partner_id', '=', partner_id],
    ],
    [
      'acc_object',
      'allow_out_payment',
      'ipn_service',
      'tid',
      'id',
      'is_main_account',
      'active',
    ],
  )
}

export async function ActiveBank(id: number, active: boolean) {
  let res = await BankRpc.write(id, { active: active })
  return res.result ? res.result : res.error
}

export async function registerMbBDSD() {}
