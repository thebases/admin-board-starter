import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { redirect, useRouter, useRouterState } from '@tanstack/react-router'
import { z } from 'zod'

import { useAuth } from '../providers/auth/auth'
import { sleep } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
// import { Globe, Moon } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/base-ui/LanguageSwitcher'
import { ModeToggle } from '@/components/base-ui/ModeToggle'
import { disableLogs, welcomeToBase } from '@/lib/logger'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/home' as const

// ========== VARIABLES ========
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'production'
let isInitialState = true

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const auth = useAuth()
  const { t } = useTranslation() // using "common" namespace by default
  const router = useRouter()
  const isMobile = useIsMobile()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const navigate = Route.useNavigate()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [username, setUsername] = React.useState(auth.user)
  const [password, setPassword] = React.useState('')
  React.useEffect(() => {
    if (isInitialState) {
      if (ENVIRONMENT === 'production') {
        disableLogs()
      } else {
        welcomeToBase()
      }
    }
    isInitialState = false
  }, [])

  // const search = Route.useSearch()

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    // if (!isMobile) {
    //   alert(
    //     'Hiện ứng dụng chỉ hỗ trợ phiên bản Mobile, vui lòng sử dụng Mobile để truy cập. \n Xin chân thanh xin lỗi về sự bất tiện nay.',
    //   )
    //   return
    // }

    console.log('Form submitted with:', { username, password })
    setIsSubmitting(true)
    console.log('Submitting form...')
    try {
      evt.preventDefault()
      await auth.login(username, password)

      await router.invalidate()
      const fb = isMobile ? '/m/account' : '/home'

      // This is just a hack being used to wait for the auth state to update
      // in a real app, you'd want to use a more robust solution
      await sleep(1)
      console.log('Star navigate with:', fb)
      await navigate({ to: fb })
    } catch (error) {
      console.error('Error logging in: ', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <div
      id="login"
      className="w-full min-h-screen flex flex-col md:flex-row md:gap-2 items-center justify-center md:justify-end bg-white login md:pr-12 xl:pr-24"
    >
      {/* <div className="hidden md:flex md:flex-col md:flex-1 md:min-h-screen md:bg-gray-100 " style>
        <img src="/login.png" alt="Login" className="w-full h-auto" />
      </div> */}
      <div className="md:p-4">
        <Card className=" max-w-sm shadow-xl border-none">
          <CardContent className="py-6">
            <h1 className="text-2xl font-bold text-center mb-2">
              {' '}
              {t('login.title')}
            </h1>
            <p className="text-center text-sm text-gray-600 mb-6">
              {t('login.subTitle')}
            </p>
            {isLoggingIn && (
              <p className="text-center text-sm text-gray-500 mb-4">
                {t('login.subTitle1')}
              </p>
            )}

            <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
              <fieldset disabled={isLoggingIn} className="w-full grid gap-6">
                <div className="grid gap-2 items-center min-w-[300px]">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('login.lblUsername')}</Label>
                    <Input
                      id="username"
                      value={username ? username : ''}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Provide Username "
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('login.lblPassword')}</Label>
                    <Input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Provide password"
                      type="password"
                    />
                  </div>

                  {/* <label htmlFor="username-input" className="text-sm font-medium">
                  Số tioa
                </label>
                <input
                  id="username-input"
                  name="username"
                  placeholder="Enter your name"
                  type="text"
                  className="border rounded-md p-2 w-full"
                  required
                /> */}
                </div>
                <div className="w-full flex flex-row gap-4 items-center align-middle justify-center">
                  <Button type="submit" className="flex-1">
                    {isSubmitting
                      ? t('login.btnLoading')
                      : t('login.btnSignin')}
                  </Button>
                  <LanguageSwitcher className="" variant="outline" />
                  <ModeToggle variant="outline" className="" />
                </div>

                {/* <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isLoggingIn ? 'Loading...' : 'Login'}
              </button> */}
              </fieldset>
            </form>
            {/* <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Moon className="h-5 w-5" />
              </Button>
            </div> */}
            {/* <div className="grid grid-cols-2 text-center text-sm text-gray-600 mt-6 gap-4">
              <div>
                <p>Logo</p>
                <p className="font-medium">VietQR Pay</p>
              </div>
              <div>
                <p>Logo</p>
                <p className="font-medium">VietQR Global</p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
