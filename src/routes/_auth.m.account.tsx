import { BankAccountTable } from '@/components/base-ui/bank-account-table'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  BaseTable,
  type SummaryItem,
} from '@/components/base-ui/table/BaseTable'
import { useIsMobile } from '@/hooks/useIsMobile'
import { fetchBankTxn, fetchBankTxnGroup, TABLE_FIELDS } from '@/lib/api/txnApi'
import {
  BINCODE_MAP,
  BINCODE_PNG,
  type VaTransactionType,
} from '@/lib/definitions'
import { cn, formatDateToLocalTz, getThisYearTimestamps } from '@/lib/utils'
import { useAuth } from '@/providers/auth/auth'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ColorNumber from '@/components/base-ui/color-number'

export const Route = createFileRoute('/_auth/m/account')({
  component: MobileAccountPage,
})

function MobileAccountPage() {
  const auth = useAuth()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  console.log('Account Screen: ', isMobile)
  const permission = auth.permission?.mp_view_banks
  const [summaryData, setSummaryData] = useState<SummaryItem[]>([])
  const [txnData, setTxnData] = useState<any[]>([])

  const [dateRange, setDateRange] = useState(getThisYearTimestamps())
  const columns: ColumnDef<VaTransactionType>[] = [
    {
      accessorKey: 'id',
      header: t('global.label_bank_acc'),
      cell: ({ row }) => (
        <div className="w-full flex flex-col gap-2">
          <span className="flex flex-row justify-between">
            <span>ID: {row.getValue('id')}</span>

            <span>
              {t('global.label_txn_date')}:
              {formatDateToLocalTz(row.original.txn_date.toString())}
            </span>
          </span>
          {/* <span className="flex flex-row justify-between">
            <span>{t('global.label_txn_date')}</span>
            {formatDateToLocalTz(row.getValue('txn_date'))}
          </span> */}
          <div className="flex flex-row justify-between">
            <span>{t('global.label_amount')}</span>
            <ColorNumber
              number={row.original.txn_amount}
              className={'text-xl'}
            />
          </div>
          <div className="flex flex-row justify-between">
            <span>{t('global.label_bank_acc')}</span>

            {row.original.is_debit ? (
              <div className="w-full flex flex-row justify-end align-middle">
                {row.original.frm_acc_bincode ? (
                  <img
                    src={BINCODE_PNG.get(row.original.frm_acc_bincode) || ''}
                    alt={BINCODE_MAP.get(row.original.frm_acc_bincode) || ''}
                    width={80}
                    height={160}
                  />
                ) : (
                  ''
                )}
                <span>{row.original.frm_acc_no}</span>
                {/*<span>{(row.getValue("frm_acc_name") !== "") ? `${row.getValue("frm_acc_name")}` : ``}</span>*/}
                <span>
                  {row.original.to_acc_bankname !== ''
                    ? `${row.original.to_acc_name}`
                    : ``}
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-row justify-end align-middle">
                {row.original.to_acc_bincode ? (
                  <img
                    src={BINCODE_PNG.get(row.original.to_acc_bincode) || ''}
                    alt={BINCODE_MAP.get(row.original.to_acc_bincode) || ''}
                    width={80}
                    height={160}
                  />
                ) : (
                  ''
                )}
                <span>{row.original.to_acc_no}</span>
                <span>
                  {row.original.to_acc_name !== ''
                    ? `${row.original.to_acc_name}`
                    : ``}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-row justify-between">
            <span>{t('global.label_reciprocal_account_name')}</span>
            {!row.original.is_debit ? (
              <div className="w-full flex flex-row justify-end align-middle">
                {row.original.frm_acc_bincode ? (
                  <img
                    src={BINCODE_PNG.get(row.original.frm_acc_bincode) || ''}
                    alt={BINCODE_MAP.get(row.original.frm_acc_bincode) || ''}
                    width={80}
                    height={160}
                  />
                ) : (
                  ''
                )}
                <span>{row.original.frm_acc_no}</span>
              </div>
            ) : (
              <div className="w-full flex flex-row justify-end align-middle">
                {row.original.to_acc_bincode ? (
                  <img
                    src={BINCODE_PNG.get(row.original.to_acc_bincode) || ''}
                    alt={BINCODE_MAP.get(row.original.to_acc_bincode) || ''}
                    width={80}
                    height={160}
                  />
                ) : (
                  ''
                )}
                <span>{row.original.to_acc_no}</span>
                {/*<span>{(row.getValue("to_acc_name") !== "") ? `${row.getValue("to_acc_name")}` : ``}</span>*/}
              </div>
            )}
            ,
          </div>
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
  ]

  useEffect(() => {
    const fetchDataFromBackEnd = async () => {
      setTxnData([])
      // setSummaryData({})
      const res1 = await fetchBankTxnGroup(
        {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        ['is_debit', 'txn_amount'],
        'is_debit',
        'is_debit ASC',
      )
      console.log('fetchBankTxnGroup result: ', res1)
      setSummaryData([
        {
          id: 'Cash In',
          value: res1[0]?.txn_amount || 0,

          placeholder: res1[0]?.is_debit_count || 0,
          delta: '',
        },
        {
          id: 'Cash Out',
          value: res1[1]?.txn_amount || 0,

          placeholder: res1[1]?.is_debit_count || 0,
          delta: '',
        },
      ])

      fetchBankTxn(dateRange, TABLE_FIELDS).then((res) => {
        setTxnData(res)
      })
    }
    fetchDataFromBackEnd()
  }, [dateRange])
  return (
    (permission?.r || false) && (
      <div
        className={cn(
          'w-full flex flex-col items-center align-top p-0 overflow-hidden min-h-[calc(100vh-64px)]',
        )}
      >
        <Tabs defaultValue="acc" className="w-full overflow-y-auto">
          <TabsList>
            <TabsTrigger value="acc">Account</TabsTrigger>
            <TabsTrigger value="txn">Transaction</TabsTrigger>
          </TabsList>
          <TabsContent value="acc" className=" overflow-y-auto">
            <BankAccountTable
              useMobile={true}
              title={t('bankAccountTable.lblAccountDesc')}
            />
          </TabsContent>
          <TabsContent value="txn" className=" overflow-y-auto">
            <BaseTable
              inputColumns={columns}
              summary={summaryData}
              data={txnData}
              dateFilter={dateRange}
              setDateFilter={setDateRange}
              title={t('bankAccountTable.lblBankTxn')}
              isMobile={isMobile}
            />
          </TabsContent>
        </Tabs>
      </div>
    )
  )
}
