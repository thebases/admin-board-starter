'use client'
import { BANK_FIELDS } from '@/providers/auth/auth'
import axios, { type AxiosRequestConfig } from 'axios'

const basePath = import.meta.env.VITE_API_GW_URL || 'https://api.base.biz'
const jsonRpcPath = import.meta.env.VITE_API_JSONRPC_PATH || '/oidc/jsonrpc'

export interface JsonRpcParams {
  service: string
  method: string
  args: any[]
}

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  method: 'call'
  params: JsonRpcParams
  id: number
}

export interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0'
  id: number
  result?: T
  error?: {
    code: number
    message: string
    data?: Promise<Record<string, string | number>[]>
  }
}

const config: AxiosRequestConfig = {
  baseURL: basePath,
  headers: {
    'Content-Type': 'application/json',
    // "Accept":"*",
  },
}

class BaseAuth {
  private accessToken: string = ''
  private url: string = ''
  private userData: any

  constructor(url: string = jsonRpcPath) {
    let token = '{}'
    let storedUserData = '{}'
    if (typeof sessionStorage !== 'undefined') {
      // Use sessionStorage
      token = sessionStorage.getItem('auth.accessToken') || '{}'
      storedUserData = sessionStorage.getItem('whoAmI') || '{}'
    } else {
      // Fallback for server-side
      // console.log('sessionStorage is not available')
    }

    this.accessToken = token
    this.url = url
    this.userData = JSON.parse(storedUserData)
    if (this.accessToken === '') {
      // console.log("constructor - user: ", this.userData);
      // console.log("constructor - token: ", this.accessToken);
    }
    // console.log("constructor - url: ", this.url);
  }
  getUrl = () => {
    return this.url
  }

  setUrl(url: string): void {
    this.url = url
  }

  getAccessToken = () => {
    return this.accessToken
  }

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken
  }

  getUserData() {
    return this.userData
  }

  async whoami<T = any>(fields: string[] = BANK_FIELDS) {
    if (this.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.accessToken}`,
      }
    }
    const { data } = await axios.post<JsonRpcResponse<T>>(
      `/oidc/whoami`,
      { fields: fields },
      config,
    )
    if (data.error) {
      throw new Error(data.error.message)
    }
    this.userData = data.result
    return data.result
  }
}

export class BaseJsonRpc {
  private authInfo: BaseAuth
  private model: string

  constructor(model: string = 'res.users', authObj: BaseAuth) {
    this.authInfo = authObj
    this.model = model
    // console.log("constructor - user: ", this.authInfo.getUserData());
    // console.log("constructor - token: ", this.authInfo.getAccessToken());
    // console.log("constructor - url: ", this.authInfo.getUrl());
  }

  // Due to frontend not allow to use common and db api so hardcode service and method, then len input the model and method
  async call<T = any>(
    method: string,
    args: any[] = [],
    kwargs?: Record<string, any>,
  ): Promise<JsonRpcResponse<T>> {
    // let args:any[]=[]
    // if (objectId){
    //      args =[objectId,args]
    // }

    const params: JsonRpcParams = {
      service: 'object',
      method: 'execute_kw',
      args: [this.model, method, args, kwargs],
    }
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'call',
      params: params,
      id: Date.now(),
    }

    if (this.authInfo.getAccessToken()) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.authInfo.getAccessToken()}`,
      }
    }

    const { data } = await axios.post<JsonRpcResponse<T>>(
      this.authInfo.getUrl(),
      request,
      config,
    )

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data
  }

  async whoami(fields: string[] = []) {
    return this.authInfo.whoami(fields || BANK_FIELDS)
  }

  async search(
    domain: any[] = [],
    fields: string[] = ['id', 'name'],
    // groupby: string = '',
    offset: number = 0,
    limit: number = 80,
    // orderby: boolean | string = false,
  ): Promise<JsonRpcResponse> {
    // Get Root Company Id from Session Storage
    const company_id = parseInt(
      JSON.parse(sessionStorage.getItem('auth.rootCompany') || '1'),
    )
    console.log(', comID', company_id)
    // Force filter by company_id
    domain.push(['company_id', '=', company_id])
    return await this.call('search_read', [domain], {
      fields: fields,
      limit: limit,
      offset: offset,
    })
  }

  async read_group(
    domain: any[] = [],
    fields: any[] = [],
    groupby: string = '',
    offset: number = 0,
    limit: number = 80,
    orderby: boolean | string = false,
  ): Promise<JsonRpcResponse> {
    // Get Root Company Id from Session Storage
    const company_id = parseInt(
      JSON.parse(sessionStorage.getItem('auth.rootCompany') || '0'),
    )
    // Force filter by company_id to align with multi company rule
    domain.push(['company_id', '=', company_id])
    return await this.call('read_group', [
      domain,
      fields,
      groupby,
      offset,
      limit,
      orderby,
    ])
  }

  async create(vals: Record<string, any>): Promise<JsonRpcResponse> {
    vals.company_id = parseInt(
      JSON.parse(sessionStorage.getItem('auth.rootCompany') || '0'),
    )
    // console.log('JSONRPC create vals:', vals)
    return await this.call('create', [null, vals])
  }

  async write(
    objectId: number,
    vals: Record<string, any>,
  ): Promise<JsonRpcResponse> {
    return await this.call('write', [objectId, vals])
  }

  async delete(objectId: number): Promise<JsonRpcResponse> {
    return await this.call('unlink', [objectId])
  }

  async read(
    objectId: number,
    fields: Record<string, any>,
  ): Promise<JsonRpcResponse> {
    return await this.call('read', [objectId], { fields: fields })
  }

  async setActive(objectId: number, active: boolean): Promise<JsonRpcResponse> {
    return await this.call('write', [objectId, { active: active }])
  }

  async run(
    method: string,
    objectId: number,
    method_args: any[] = [],
  ): Promise<JsonRpcResponse> {
    return await this.call(method, [objectId, ...method_args])
  }
}

// Define Using RPC
export const RpcAuth = new BaseAuth()
// const access_token = sessionStorage.getItem('auth.accessToken')
export const UserRpc = new BaseJsonRpc('res.users', RpcAuth)
export const MerchantRpc = new BaseJsonRpc('res.partner', RpcAuth)
export const BankRpc = new BaseJsonRpc('res.partner.bank', RpcAuth)
export const BankTxnRpc = new BaseJsonRpc('transactions.ibft', RpcAuth)
export const MpGroupRPC = new BaseJsonRpc('mp.groups', RpcAuth)
export const MpViewRuleRPC = new BaseJsonRpc('mp.view.rule', RpcAuth)
export const PaymentTxnRpc = new BaseJsonRpc('payment.transaction', RpcAuth)
export const AccountMoveRpc = new BaseJsonRpc('account.move', RpcAuth)
