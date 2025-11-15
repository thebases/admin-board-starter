'use client'

import * as React from 'react'
import { IconDotsVertical, IconEdit } from '@tabler/icons-react'
import { type ColumnDef, type VisibilityState } from '@tanstack/react-table'
import { z } from 'zod'

import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/providers/auth/auth'
import { useEffect, useRef } from 'react'
import { Switch } from '../ui/switch'
import { getBankLogoByBinCode } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { GetBankList } from '@/lib/api/bankApi'
import { BaseTable } from './table/BaseTable'
import {
  DynamicDrawerForm,
  type DrawerActionHandlers,
} from './drawer/DynamicDrawer'
import { CreateBankAccountForm } from './bank-account-table-create'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'

const BankAccountSchema = z.object({
  id: z.number(),
  bankBincode: z.string(),
  bankName: z.string(),
  bankAccount: z.string(),
  bankHolder: z.string(),
  allowOutPayment: z.boolean(),
  ipnService: z.boolean(),
  isMain: z.boolean(),
  active: z.boolean(),
})

const handlers: DrawerActionHandlers<z.infer<typeof BankAccountSchema>> = {
  create: async (values) => {
    console.log('CREATE called', values)
  },
  update: async (values) => {
    console.log('UPDATE called', values)
  },
}

export function BankAccountTable({
  // data: initialData,
  title = 'TÀI KHOẢN NGÂN HÀNG',
  useMobile = false,
}: {
  // data: z.infer<typeof BankAccountSchema>[]
  title?: string
  useMobile?: boolean
}) {
  const auth = useAuth()
  const permission = auth.permission?.mp_view_banks
  const { t } = useTranslation() // using "common" namespace by default
  const columnsMobile: ColumnDef<z.infer<typeof BankAccountSchema>>[] = [
    // {
    //   id: 'drag',
    //   header: () => null,
    //   // cell: ({ row }) => <DragHandle id={row.original.id} />,
    //   cell: ({ row }) => row.original.id,
    // },
    {
      id: 'id',
      header: t('global.label_bank_acc'),
      cell: ({ row }) => (
        <div className="flex flex-row items-center justify-start">
          <div>
            <img
              src={getBankLogoByBinCode(row.original.bankBincode)}
              alt={row.original.bankBincode}
              className="h-8"
            />
          </div>
          <div className="w-full flex flex-col justify-start gap-1">
            {(permission?.u || false) && (
              <div className="flex flex-row gap-2 justify-between">
                <DynamicDrawerForm
                  schema={BankAccountSchema}
                  title={t('global.lblEdit')}
                  description={t('bankAccountTable.lblAccountDesc')}
                  handlers={handlers}
                  tag={'update'}
                  triggerLabel={
                    <>
                      {row.original.id}
                      <IconEdit stroke={2} />
                    </>
                  }
                  defaultValues={row.original}
                  direction="bottom"
                  fieldOverrides={{
                    bankHolder: { label: t('acc_obj.accHolderName') },
                    bankName: { label: t('acc_obj.accBankName') },
                    bankAccount: { label: t('acc_obj.accNo') },
                    bankBincode: {
                      label: t('acc_obj.accBinCode'),
                    },
                    'acc_obj.accPartnerId': {
                      label: t('acc_obj.accPartnerId'),
                    },
                    active: { label: t('global.lblActive') },
                    isMain: { label: t('acc_obj.isMain'), disable: true },
                    ipnService: {
                      label: t('acc_obj.ipnService'),
                    },
                    allowOutPayment: { label: t('acc_obj.allowOutPayment') },
                  }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                      size="icon"
                    >
                      <IconDotsVertical />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <span className="flex flex-row  justify-between">
              <span>
                {t('acc_obj.accHolderName')}
                {': '}
              </span>
              {row.original.bankHolder}
            </span>
            <span className="flex flex-row  justify-between">
              <span>
                {t('acc_obj.accNo')}
                {': '}
              </span>
              <span>{row.original.bankAccount}</span>
            </span>

            <div className="w-full text-wrap flex flex-row  justify-between">
              {t('acc_obj.ipnService')}
              <Switch
                id={'ipnService'}
                value={row.original.ipnService ? 'true' : 'false'}
              />
            </div>
            <div className="w-full text-wrap flex flex-row  justify-between">
              {t('acc_obj.allowOutPayment')}
              <Switch
                id={'allowOutPayment'}
                value={row.original.allowOutPayment ? 'true' : 'false'}
              />
            </div>
          </div>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
  ]
  const columns: ColumnDef<z.infer<typeof BankAccountSchema>>[] = [
    // {
    //   id: 'drag',
    //   header: () => null,
    //   // cell: ({ row }) => <DragHandle id={row.original.id} />,
    //   cell: ({ row }) => row.original.id,
    // },
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'bankBincode',
      header: () => <div className="w-full text-left"></div>,
      cell: ({ row }) => (
        <div className="w-32 text-wrap">
          <img
            src={getBankLogoByBinCode(row.original.bankBincode)}
            alt={row.original.bankBincode}
            className="h-8"
          />
        </div>
      ),
    },
    {
      accessorKey: 'bankName',
      header: t('bankAccountTable.colBankName'),
      cell: ({ row }) => (
        <div className="w-32 text-wrap">
          {/* <Badge variant="outline" className="text-muted-foreground px-1.5"> */}
          {row.original.bankName}
          {/* </Badge> */}
        </div>
      ),
    },
    {
      accessorKey: 'bankAccount',
      header: t('bankAccountTable.colBankAccount'),
      cell: ({ row }) => (
        <div className="w-32 text-wrap">{row.original.bankAccount}</div>
      ),
    },
    {
      accessorKey: 'bankHolder',
      header: t('bankAccountTable.colBankHolder'),
      cell: ({ row }) => (
        <div className="w-32 text-wrap">{row.original.bankHolder}</div>
      ),
    },
    {
      accessorKey: 'ipnService',
      header: t('bankAccountTable.colUseIpn'),
      cell: ({ row }) => (
        <div className="w-32 text-wrap flex flex-row  justify-center">
          <Switch
            id={'ipnService'}
            value={row.original.ipnService ? 'true' : 'false'}
          />
        </div>
      ),
    },
    {
      accessorKey: 'allowOutPayment',
      header: t('bankAccountTable.colOutPayment'),
      cell: ({ row }) => (
        <div className="w-32 text-wrap flex flex-row  justify-center">
          {' '}
          <Switch
            id={'allowOutPayment'}
            value={row.original.allowOutPayment ? 'true' : 'false'}
          />
        </div>
      ),
    },
    {
      accessorKey: 'id',
      header: 'action',
      cell: ({ row }) => {
        return (
          (permission?.u || false) && (
            <DynamicDrawerForm
              schema={BankAccountSchema}
              title={t('global.lblEdit')}
              description={t('bankAccountTable.lblAccountDesc')}
              defaultValues={row.original}
              handlers={handlers}
              tag={'update'}
              triggerLabel={<IconEdit stroke={2} />}
              direction="bottom"
              fieldOverrides={{
                bankHolder: { label: t('acc_obj.accHolderName') },
                bankName: { label: t('acc_obj.accBankName') },
                bankAccount: { label: t('acc_obj.accNo') },
                bankBincode: {
                  label: t('acc_obj.accBinCode'),
                },
                'acc_obj.accPartnerId': { label: t('acc_obj.accPartnerId') },
                active: { label: t('global.lblActive') },
                isMain: { label: t('acc_obj.isMain'), disable: true },
                ipnService: {
                  label: t('acc_obj.ipnService'),
                },
                allowOutPayment: { label: t('acc_obj.allowOutPayment') },
              }}
            />
          )
        )
      },
      enableHiding: true,
    },
    // {
    //   id: 'actions',
    //   cell: () => actionCell(),
    // },
  ]

  const [data, setData] = React.useState<z.infer<typeof BankAccountSchema>[]>(
    [],
  )

  React.useState<VisibilityState>({ id: false, drag: false, select: false })

  const fetched = useRef(false)
  useEffect(() => {
    const fetchData = async () => {
      if (fetched.current) return
      fetched.current = true
      const dataB = await GetBankList(auth.userData?.partner_id[0])
      if (dataB) {
        let objB: z.infer<typeof BankAccountSchema>[] = []
        dataB['result'].map((bank: any) => {
          objB.push({
            id: bank.id,
            bankBincode: bank['acc_object']['bank_bic'],
            bankName: bank['acc_object']['bank_fullname'],
            bankAccount: bank['acc_object']['account_number'],
            bankHolder: bank['acc_object']['account_holder'],
            allowOutPayment: bank['allow_out_payment'],
            ipnService: bank['ipn_service'],
            isMain: bank['is_main_account'],
            active: bank['active'],
          })
          setData(objB)
        })
      } else {
        console.log('No Bank Data')
      }
    }
    fetchData()
  }, [])

  const CreateButton = () =>
    (permission?.c || false) && (
      <CreateBankAccountForm bank="1" qrmms={false} bdsd={true} className="" />
    )

  if (data) {
    return (
      <BaseTable
        title={title}
        inputColumns={useMobile ? columnsMobile : columns}
        data={data}
        CustomCreateButton={CreateButton}
      />
    )
  } else {
    return <></>
  }
}
