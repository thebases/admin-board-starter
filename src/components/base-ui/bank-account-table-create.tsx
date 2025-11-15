'use client'

import {
  bankFormSchema,
  BINCODE_MAP,
  BINCODE_PNG,
  type BankFormSchema,
} from '@/lib/definitions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  getObjectShape,
  renderField,
  type FieldOverrides,
} from './drawer/DynamicDrawer'
import { useTranslation } from 'react-i18next'
import { IconNews } from '@tabler/icons-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { Button } from '../ui/button'
import { useState, type BaseSyntheticEvent } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import VietQRCode from './vietqr-code'
import { Alert, AlertDescription } from '../ui/alert'
import { CircleCheck } from 'lucide-react'

// ========== INTERFACE ========
interface AccountInputFormProps {
  bank: string
  qrmms: boolean
  bdsd: boolean
  className: string
  useMobile?: boolean
}
// const handlers: DrawerActionHandlers<z.infer<BankFormSchema>> = {
//   create: async (values: any) => {
//     console.log('CREATE called', values)
//   },
//   update: async (values: any) => {
//     console.log('UPDATE called', values)
//   },
// }
const OtpFormSchema = z.object({
  otp: z.string().min(2, {
    message: 'Username có độ dài tối thiểu 2 kí tự',
  }),
})

export function CreateBankAccountForm(props: AccountInputFormProps) {
  const { t } = useTranslation()
  const form = useForm<BankFormSchema>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      acc_no: '765123',
      acc_holder: 'Jean',
      acc_holder_email: 'a@a.com',
      acc_holder_zid: '',
      national_id: '079xxxxxxxxx',
      phone_number: '0909xxxxxx',
      bincode: '970422',
      trans_type: 'DC',
      va_status: false,
      qrmms: props.qrmms,
      bdsd: props.bdsd,
    },
    mode: 'onBlur',
  })
  const otpForm = useForm<any>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {},
    mode: 'onBlur',
  })

  async function handleSubmit(
    data: {
      acc_no: string
      acc_holder: string
      acc_holder_email: string
      national_id: string
      acc_holder_zid?: string | undefined
      phone_number?: string | undefined
      bincode?: string | undefined
      trans_type?: string | undefined
      va_status?: boolean | undefined
      tid?: string | undefined
      qrmms?: boolean | undefined
      bdsd?: boolean | undefined
    },
    event?: BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    console.log('handleSubmit', data)
    console.log('handleSubmit Event', event)
    //  Create Bank Record

    setBankData(data.bincode || '970422')
    setTab('otp')
  }

  function handleOtpSubmit(
    data: {
      otp: string
      acc_holder: string
      acc_holder_email: string
      national_id: string
      acc_holder_zid?: string | undefined
      phone_number?: string | undefined
      bincode?: string | undefined
      trans_type?: string | undefined
      va_status?: boolean | undefined
      tid?: string | undefined
      qrmms?: boolean | undefined
      bdsd?: boolean | undefined
    },
    event?: BaseSyntheticEvent<object, any, any> | undefined,
  ) {
    console.log('handleOTPSubmit', data)
    console.log('handleOTPSubmit', event)

    setBankData(data.bincode || '970422')
    setTab('result')
  }
  const rootObject = bankFormSchema
  const rootObjectShape = getObjectShape(rootObject)
  const overrides: FieldOverrides = {
    bincode: {
      label: 'Select a Bank',
      as: 'select',
      options: [
        { label: 'Ngân hàng Quân Đội - MB Bank', value: '970422' },
        { label: 'Ngân hàng Phát Triển - BIDV', value: '970418' },
      ],
      className: 'w-full',
    },
  }
  const [tab, setTab] = useState('account')
  const [bankData, setBankData] = useState('970422')

  return (
    <Drawer direction={'bottom'}>
      <DrawerTrigger asChild>
        <Button
          variant={'outline'}
          className="text-foreground w-fit px-0 text-left"
        >
          <IconNews stroke={2} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Tabs
          defaultValue="account"
          value={tab}
          onValueChange={setTab}
          className="overflow-y-auto"
        >
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="otp">Confirm</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
          <TabsContent value="result" className="flex flex-col items-center">
            <Card className={'max-w-[480px] min-w-[300px] min-h-[500px] '}>
              <CardHeader>
                <CardTitle>Connection Confirm</CardTitle>
                <CardDescription>
                  <Alert className="bg-green-100 ">
                    <AlertDescription className=" flex flex-row align-middle gap-2">
                      <div className="flex flex-col align-middle justify-center">
                        <CircleCheck className="h-3 w-3 " />
                      </div>
                      <span className={'text-xxs flex flex-row align-middle'}>
                        For checking the connection to you account, please make
                        a transfer to your account with below VietQR. You will
                        receive a payment notification right after making the
                        transfer.
                      </span>
                    </AlertDescription>
                  </Alert>
                </CardDescription>
              </CardHeader>
              <CardContent
                className={
                  'w-full flex flex-col gap-4 justify-center items-center'
                }
              >
                <p className={'text-sm flex flex-row align-middle'}>
                  For checking the connection to you account, please make a
                  transfer to your account with below VietQR. You will receive a
                  payment notification right after making the transfer.
                </p>
                <div className="flex flex-col md:flex-row md:align-middle items-center justify-center ">
                  <Card className="min-w-[160px] max-w-[360px]">
                    <CardHeader className="flex flex-row justify-center p-1">
                      <img
                        src={'https://vietqr.net/img/VietQR.46a78cbb.png'}
                        alt={'the Base VietQR'}
                        width={120}
                        height={160}
                      />
                    </CardHeader>
                    <CardContent className="p-2">
                      <VietQRCode
                        qrString={'123'}
                        payment_amount={10000}
                        className="w-100"
                        size={160}
                      />
                    </CardContent>
                    <CardFooter className="p-2 ">
                      <div className="w-full flex flex-row justify-center gap-2">
                        <img
                          src={'/bank_logo/napas247.png'}
                          alt={BINCODE_MAP.get(bankData) || ''}
                          width={80}
                          height={40}
                        />
                        <div className="w-[1px] border"></div>
                        <img
                          src={BINCODE_PNG.get(bankData) || ''}
                          alt={BINCODE_MAP.get(bankData) || ''}
                          width={80}
                          height={40}
                        />
                      </div>
                    </CardFooter>
                  </Card>

                  <div className="flex flex-col items-start p-4 gap-4">
                    <p className={'flex flex-row text-sm'}>
                      Bank:
                      <img
                        src={BINCODE_PNG.get(bankData) || ''}
                        alt={BINCODE_MAP.get(bankData) || ''}
                        width={80}
                        height={160}
                      />
                    </p>
                    <p className="flex flex-row text-sm">
                      Bank Account:<span className="font-bold">{'acc_no'}</span>
                    </p>
                    <p className="flex flex-row text-sm">
                      Holder Name:
                      <span className="font-bold">{'acc_holder'}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center justify-center gap-4">
                <DrawerClose asChild>
                  <Button
                    className="bg-primary"
                    // onClick={() => router.push('/banks?reload=true')}
                  >
                    Kết thúc
                  </Button>
                </DrawerClose>
                <Button
                  className="bg-primary"
                  onClick={() => setTab('account')}
                >
                  Thêm tài khoản mới
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="otp" className="flex flex-col items-center">
            <div className="flex flex-col gap-4  px-4 text-sm">
              <Form {...otpForm}>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                >
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('bank_confirm.label_otp')}</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={8} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                              <InputOTPSlot index={6} />
                              <InputOTPSlot index={7} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          {t('bank_confirm.label_otp_detail')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DrawerFooter className="flex flex-row gap-4">
                    <Button type="submit" className="flex-1">
                      Submit
                    </Button>

                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          </TabsContent>
          <TabsContent value="account" className="overflow-y-auto">
            <DrawerHeader className="gap-1 pt-0">
              <DrawerTitle>{t('global.lblCreate')}</DrawerTitle>

              <DrawerDescription>
                {t('bankAccountTable.colBankAccount')}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col gap-4  px-4 text-sm">
              <Form {...form}>
                <form
                  className="flex flex-col gap-6 "
                  onSubmit={form.handleSubmit(
                    async (data, event) => await handleSubmit(data, event),
                  )}
                >
                  {/* acc_no: z.ZodString;
                      acc_holder: z.ZodString;
                      acc_holder_email: z.ZodString;
                      acc_holder_zid: z.ZodOptional<z.ZodString>;
                      national_id: z.ZodString;
                      phone_number: z.ZodOptional<z.ZodString>;
                      bincode: z.ZodOptional<z.ZodString>;
                      trans_type: z.ZodOptional<z.ZodDefault<z.ZodString>>;
                      va_status: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                      tid: z.ZodOptional<z.ZodString>;
                      qrmms: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
                      bdsd: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>; */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-4">
                    {renderField(
                      'bincode',
                      rootObjectShape['bincode'],
                      form,
                      false,
                      overrides,
                    )}

                    {renderField(
                      'acc_no',
                      rootObjectShape['acc_no'],
                      form,
                      false,
                      overrides,
                    )}
                    {renderField(
                      'acc_holder',
                      rootObjectShape['acc_holder'],
                      form,
                      false,
                      overrides,
                    )}
                    {renderField(
                      'acc_holder_email',
                      rootObjectShape['acc_holder_email'],
                      form,
                      false,
                      overrides,
                    )}
                    {renderField(
                      'national_id',
                      rootObjectShape['national_id'],
                      form,
                      false,
                      overrides,
                    )}

                    {renderField(
                      'phone_number',
                      rootObjectShape['phone_number'],
                      form,
                      false,
                      overrides,
                    )}
                    {renderField(
                      'qrmms',
                      rootObjectShape['qrmms'],
                      form,
                      false,
                      overrides,
                    )}
                    {renderField(
                      'bdsd',
                      rootObjectShape['bdsd'],
                      form,
                      false,
                      overrides,
                    )}
                  </div>
                  {/* {Object.keys(getObjectShape(rootObject)).map((k) => (
                    <div key={k}>
                      {renderField(
                        k,
                        getObjectShape(rootObject)[k],
                        form,
                        true,
                        overrides,
                      )}
                    </div>
                  ))} */}

                  <DrawerFooter className="grid grid-cols-2">
                    <DrawerClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DrawerClose>
                    <Button type="submit">Submit</Button>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}
