'use client'
import axios, { type AxiosResponse } from 'axios'

const basePath =
  import.meta.env.NEXT_PUBLIC_API_GW_URL || 'https://api.base.biz'
const erpPath = import.meta.env.NEXT_PUBLIC_API_ERP_PATH || '/mp'
const oapiPath = import.meta.env.NEXT_PUBLIC_API_OAPI_PATH || '/oapi'
const bapiPath = import.meta.env.NEXT_PUBLIC_API_BAPI_PATH || '/bapi'
const reportPath = import.meta.env.NEXT_PUBLIC_API_REPORT_PATH || '/report'
const authPath = import.meta.env.NEXT_PUBLIC_API_BASE_ERP_PATH || '/auth/token'

const callApiGW = axios.create({
  baseURL: `${basePath}`,
})

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  refresh_expires_in?: number
  token_type?: string
  scope?: string
  session_state?: string
}

export async function callAuth(
  username: string,
  password: string,
): Promise<TokenResponse | false> {
  if (!username || !password) {
    return false
  }

  const body = new URLSearchParams({
    username,
    password,
    scope: 'openid',
    grant_type: 'password',
  }).toString()

  try {
    const res: AxiosResponse<TokenResponse> = await callApiGW({
      method: 'POST',
      url: authPath,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: body,
    })

    if (res.status === 200) {
      return res.data
    }
    console.error('Auth error:', res.status, res.data)
    return false
  } catch (err: any) {
    console.error('Auth request failed:', err)
    return false
  }
}

export async function callApi(
  accessToken: string = '',
  url: string = '',
  method = 'GET',
  payload = {},
): Promise<any> {
  try {
    const header_data = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }

    if (accessToken !== '' && url !== '') {
      if (method === 'GET') {
        const get_res = await callApiGW({
          method: method,
          url: url,
          headers: header_data,
        })
        return get_res.status === 200 ? get_res.data : false
      } else {
        const res = await callApiGW({
          method: method,
          url: url,
          headers: header_data,
          data: payload,
        })
        return res
      }
    }
  } catch (error: any) {
    console.error('Unknown error when call api:', error)
    if (error.status === 401) {
      window.location.href = '/?forceLogout=true'
    }
    return error
  }
}

export async function callErp(
  accessToken: string = '',
  path: string = '',
  action: string = 'GET',
  payload: any = {},
): Promise<any> {
  return await callApi(accessToken, `${erpPath}${path}`, action, payload)
}

export async function callOpenApi(
  accessToken: string = '',
  path: string = '',
  action: string = 'GET',
  payload: any = {},
): Promise<any> {
  return await callApi(accessToken, `${oapiPath}${path}`, action, payload)
  // return await callApi(accessToken, `${path}`, action, payload)
}

export async function callBankApi(
  accessToken: string = '',
  path: string = '',
  action: string = 'GET',
  payload: any = {},
): Promise<any> {
  return await callApi(accessToken, `${bapiPath}${path}`, action, payload)
}

export async function callReportApi(
  accessToken: string = '',
  path: string = '',
  action: string = 'GET',
  payload: any = {},
): Promise<any> {
  return await callApi(accessToken, `${reportPath}${path}`, action, payload)
}

export function formDataToJson(formData: FormData): Record<string, any> {
  // Check if formData is an instance of FormData
  if (!(formData instanceof FormData)) {
    throw new TypeError('Expected formData to be an instance of FormData')
  }
  const jsonObject: Record<string, any> = {}

  formData.forEach((value, key) => {
    // Check if the key already exists in the jsonObject
    if (jsonObject[key]) {
      // If it exists and it's an array, push the new value to the array
      if (Array.isArray(jsonObject[key])) {
        jsonObject[key].push(value)
      } else {
        // If it's not an array, convert it to an array and add the new value
        jsonObject[key] = [jsonObject[key], value]
      }
    } else {
      // If the key doesn't exist, add it to the jsonObject
      jsonObject[key] = value
    }
  })
  return jsonObject
}
