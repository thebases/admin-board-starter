import { UserRpc } from '../jsonrpc'

export async function GetUserInfo(partner_id: number) {
  return await UserRpc.run('get_user_info', partner_id)
}

export async function GetUserExtInfo(partner_id: number) {
  return await UserRpc.run('get_user_ext_info', partner_id)
}

export async function GetUserPermission(partner_id: number) {
  return await UserRpc.run('fe_permission', partner_id)
}
