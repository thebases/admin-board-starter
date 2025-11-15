import { createFileRoute, useRouter } from '@tanstack/react-router'

import { useAuth } from '../providers/auth/auth'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { getBankNameByBinCode } from '@/lib/utils'

export const Route = createFileRoute('/_auth/m/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const auth = useAuth()
  const router = useRouter()
  const navigate = Route.useNavigate()
  const [isEdit, setIsEdit] = useState(false)
  const [sAccount, setSAccount] = useState('')
  const [sBinCode, setSBincode] = useState('')
  const [sName, setSName] = useState('')

  useEffect(() => {
    setSAccount(auth.bankAccount || '')
    setSBincode(auth.bankBincode || '')
    setSName(auth.storeName || '')
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' })
        })
      })
    }
  }

  // const submitHandle = () => {
  //   auth.setAuthData(sAccount, sBinCode, sName)
  // }

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    console.log('Form submitted with:', { sAccount, sBinCode, sName })
    // setIsSubmitting(true)
    console.log('Submitting form...')
    try {
      evt.preventDefault()
      await auth.setAuthData(sAccount, sBinCode, sName)
      await setIsEdit(false)
    } catch (error) {
      console.error('Error logging in: ', error)
    } finally {
      // setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 p-4 min-h-[calc(100vh-64px)]">
      {/* Main Data */}
      <div className="flex-1">
        <p>
          Hi <b>{auth.user}</b>!
        </p>
        <p>Thông tin tài khoản của bạn.</p>

        {/* Merchant Info */}
        <div className="pt-4 text-sm text-gray-700 space-y-1">
          {isEdit ? (
            <form onSubmit={onFormSubmit}>
              <Input
                id="account"
                value={sAccount}
                onChange={(e) => setSAccount(e.target.value)}
              ></Input>
              <Input
                id="bank"
                value={sBinCode}
                onChange={(e) => setSBincode(e.target.value)}
              ></Input>
              <Input
                id="store"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
              ></Input>
              <Button type="submit" className="w-full">
                Cập Nhật
              </Button>
            </form>
          ) : (
            <>
              <div className="flex justify-end">
                <Button variant={'outline'} onClick={() => setIsEdit(true)}>
                  Chỉnh sửa
                </Button>
              </div>
              <div className="flex justify-between">
                <span>Tài khoản</span>
                <span className="font-semibold">{sAccount}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngân hàng</span>
                <span className="font-semibold">
                  {getBankNameByBinCode(sBinCode)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cửa hàng</span>
                <span className="font-semibold">{sName}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <Button
        variant={'ghost'}
        onClick={handleLogout}
        className="w-full text-left py-2 border-b text-red-600"
      >
        Đăng xuất
      </Button>
    </div>
  )
}
