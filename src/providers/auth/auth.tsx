import * as React from 'react'

import { sleep } from '@/lib/utils'
import { callApi, callAuth, callWhoAmI } from '@/lib/actions'
import { api } from '@/lib/api/apiClient'

export const BANK_FIELDS = [
  'acc_object',
  'acc_type',
  'account_qr_string',
  'active',
  'company_ref_code',
  'is_main_account',
  'id',
  'proxy_qr_string',
  'proxy_va_type',
  'proxy_zid',
  'tid',
  'zid',
]
type BankAccountData = {
  acc_object: {
    account_holder: string
    account_number: string
    bank_bic: string
    bank_fullname: string
    bank_name: string
    is_main_account: string
    proxy_name: string
    proxy_type: string
    proxy_value: string
  }
  acc_type: string
  account_qr_string: string
  active: boolean
  company_ref_code: string
  id: number
  is_main_account: boolean
  proxy_qr_string: string
  proxy_va_type: boolean
  proxy_zid: string
  tid: string | boolean
  zid: string
}

type UserData = {
  avatar_512: string
  root_banks: BankAccountData[]
  company_id: any[]
  company_ids: any[]
  email: string
  id: number
  lang: string
  login: string
  name: string
  oauth_provider_id: any[]
  oauth_uid: string
  partner_id: any[]
  realm: string
  root_company_id: number
}

type PermissionDataItem = {
  i?: number
  n?: string
  c?: boolean
  r?: boolean
  u?: boolean
  d?: boolean
}
type PermissionData = {
  mp_view_banks?: PermissionDataItem
  mp_view_channel?: PermissionDataItem
  mp_view_dashboard?: PermissionDataItem
  mp_view_invoice?: PermissionDataItem
  mp_view_pos?: PermissionDataItem
  mp_view_setting?: PermissionDataItem
  mp_view_transaction?: PermissionDataItem
  mp_view_users?: PermissionDataItem
  mp_view_base_invoice?: PermissionDataItem
  mp_view_budget?: PermissionDataItem
  mp_view_receipt?: PermissionDataItem
}

export interface AuthContext {
  isAuthenticated: boolean
  user: string | null
  userData: UserData | null
  bankAccount: string | null
  bankBincode: string | null
  bankName: string | null
  storeName: string | null
  defaultDevice: string | null
  permission: PermissionData | null
  setDevice: (serial: string | null) => Promise<void>
  setAuthData: (
    bankAcc?: string | undefined,
    bankBin?: string | undefined,
    sName?: string | undefined,
  ) => Promise<void>
  login: (
    username?: string | undefined | null,
    password?: string,
    realm?: string,
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContext | null>(null)
const key = {
  user: 'auth.user',
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  expriedAt: 'auth.expiredAt',
  refreshExpiresAt: 'auth.RefreshExpiresAt',
  sessionState: 'auth.sessionState',
  userData: 'auth.userData',
  bankBincode: 'auth.bankBincode',
  bankName: 'auth.bankName',
  storeName: 'auth.storeName',
  defaultDevice: 'auth.defaultDevice',
  rootCompany: 'auth.rootCompany',
  permission: 'auth.permission',
}

// Getter - Setter

function getStoredUser() {
  return localStorage.getItem(key.user)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key.user, user)
  } else {
    localStorage.removeItem(key.user)
  }
}

function getStorebyKey(keyStore: string, isJson: boolean = false) {
  if (isJson && sessionStorage.getItem(keyStore)) {
    return JSON.parse(sessionStorage.getItem(keyStore)!)
  } else {
    return sessionStorage.getItem(keyStore)
  }
}

function setStoredByKey(keyStore: string, data: string | null) {
  if (data) {
    sessionStorage.setItem(keyStore, data)
  } else {
    sessionStorage.removeItem(keyStore)
  }
}

//  Provider

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredUser())
  const [accessToken, setAccessToken] = React.useState<string | null>(
    getStorebyKey(key.accessToken),
  )
  const [refreshToken, setRefreshToken] = React.useState<string | null>(
    getStorebyKey(key.refreshToken),
  )
  const [expriedAt, setExpriedAt] = React.useState<string | null>(
    getStorebyKey(key.expriedAt),
  )
  const [refreshExpiresAt, setRefreshExpiresAt] = React.useState<string | null>(
    getStorebyKey(key.refreshExpiresAt),
  )
  const [sessionState, setSessionState] = React.useState<string | null>(
    getStorebyKey(key.sessionState),
  )

  const [bankAccount, setBankAccount] = React.useState<string | null>('')
  const [bankBincode, setBankBincode] = React.useState<string | null>(
    getStorebyKey(key.bankBincode),
  )
  const [bankName, setBankName] = React.useState<string | null>(
    getStorebyKey(key.bankName),
  )
  const [storeName, setStoreName] = React.useState<string | null>(
    getStorebyKey(key.storeName),
  )
  const [defaultDevice, setDefaultDevice] = React.useState<string | null>(
    getStorebyKey(key.defaultDevice),
  )
  const [userData, setUserData] = React.useState<UserData | null>(
    getStorebyKey(key.userData, true) as UserData | null,
  )
  const [permission, setPermission] = React.useState<PermissionData | null>(
    getStorebyKey(key.permission, true) as PermissionData | null,
  )
  const isAuthenticated = accessToken ? true : false

  const logout = React.useCallback(async () => {
    await sleep(250)

    // setStoredUser(null)
    Object.entries(key).forEach(([name, storageKey]) => {
      console.log(`Clearing ${name} (${storageKey})`)
      setStoredByKey(storageKey, null)
    })
    // setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    setBankAccount(null)
    setBankBincode(null)
    setStoreName(null)
    setBankName(null)
  }, [])

  interface LoginResponse {
  access_token: string;
  id_token?:string;
  refresh_token?: string;
  expires_in?:number;
  refresh_expires_in?:number
  scope?:string
}

interface WhoAmIResponse{
  
  email: string,
  email_verified: boolean,
  iss: string,
  name: string,
  preferred_username: string,
  realm_access: {
    roles: string[]
  },
  sub: string

}

  const login = React.useCallback(
    async (
      username?: string | undefined | null,
      password?: string,
      realm: string = 'base',
    ) => {
      // await sleep(500)
      console.log('realm:', realm)
      if (username && password) {
        // let res = await callAuth(username, password)
        let res = await api.auth.token.post<LoginResponse>({
          body: { username, password },
        })
        if (res) {
          console.log('Auth Result:', res)
          const currentTime = Date.now()
          const expiredTime = Math.floor(
            currentTime + (res.expires_in ? res.expires_in : 0) * 1000,
          )
          const refreshExpiredTime = Math.floor(
            currentTime +
              (res.refresh_expires_in ? res.refresh_expires_in : 0) * 1000,
          )

          //  SET TO STATE
          // console.log('username is', username)
          setUser(username)
          setStoredUser(username)
          // console.log('setStoredUser is', getStoredUser())
          // console.log('setUser is', user)
          setAccessToken(res.access_token)
          setStoredByKey(key.accessToken, res.access_token)
          if (res.refresh_token) {
            setRefreshToken(res.refresh_token)
            setStoredByKey(key.refreshToken, res.refresh_token)
          }
          // if (res.session_state) {
          //   setSessionState(res.session_state)
          //   setStoredByKey(key.sessionState, null)
          // }
          setExpriedAt(expiredTime.toString())
          setRefreshExpiresAt(refreshExpiredTime.toString())
          setStoredByKey(key.expriedAt, expiredTime.toString())
          setStoredByKey(key.refreshExpiresAt, refreshExpiredTime.toString())

          // GET MERCHANT INFORMATION
          // RpcAuth.setAccessToken(res.access_token)
          // console.log('res.access_token: ', res.access_token)
          // const UData = await callWhoAmI(res.access_token)
          const UData = await api.auth.me.get<WhoAmIResponse>({
            headers:{Authorization:`Bearer ${res.access_token}`}
          })
          //  await callWhoAmI(res.access_token)
          // setPermission(UData['permission'][0])
          // setStoredByKey(key.permission, JSON.stringify(UData['permission'][0]))

          // setUserData(UData)
          // setStoredByKey(key.rootCompany, UData['root_company_id'])
          // setStoredByKey(key.userData, JSON.stringify(UData))
          console.log('userData: ', UData)
          console.log('permission: ', permission)
          setBankAccount(
            userData?.root_banks[0].acc_object.account_number ?? '',
          )
          console.log('BankAccount: ', bankAccount)

          // setStoredByKey(keyBankAccount, null)
          // setStoredByKey(keyBankBincode, null)
          // setStoredByKey(keyStoreName, null)
          // setStoredByKey(keyBankName, null)
          console.debug(refreshToken, expriedAt, refreshExpiresAt, sessionState)
        }
      }
    },
    [],
  )

  const setDevice = React.useCallback(async (serial: string | null) => {
    setDefaultDevice(serial)
    setStoredByKey(key.defaultDevice, serial)
  }, [])

  const setAuthData = React.useCallback(
    async (bankAcc?: string, bankBin?: string, sName?: string) => {
      if (bankAcc) {
        setBankAccount(bankAcc)
        setStoredByKey(key.userData, bankAcc || null)
      }
      if (bankBin) {
        setBankBincode(bankBin)
        setStoredByKey(key.bankBincode, bankBin || null)
      }
      if (sName) {
        setStoreName(sName)
        setStoredByKey(key.storeName, sName || null)
      }
    },
    [],
  )

  React.useEffect(() => {
    setUser(getStoredUser())
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userData,
        permission,
        bankAccount,
        bankBincode,
        bankName,
        storeName,
        defaultDevice,
        setDevice,
        setAuthData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
