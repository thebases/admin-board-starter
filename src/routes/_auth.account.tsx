import { BankAccountTable } from '@/components/base-ui/bank-account-table'
import ColorNumber from '@/components/base-ui/color-number'
import {
  BaseTable,
  type SummaryItem,
} from '@/components/base-ui/table/BaseTable'
import { useIsMobile } from '@/hooks/useIsMobile'
import { fetchBankTxn, fetchBankTxnGroup, TABLE_FIELDS } from '@/lib/api/txnApi'
import {
  BINCODE_MAP,
  BINCODE_PNG,
  CASH_FLOW,
  type VaTransactionType,
} from '@/lib/definitions'
import { formatDateToLocalTz, getThisYearTimestamps } from '@/lib/utils'
import { useAuth } from '@/providers/auth/auth'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_auth/account')({
  component: RouteComponent,
})

const visibilityState = {
  sm_cell: false,
  id: false,
  txn_status: false,
  currency: false,
  frm_acc_name: false,
  frm_acc_no: false,
  frm_acc_bankname: false,
  frm_acc_bincode: false,
  to_acc_va: false,
  to_acc_name: false,
  to_acc_bankname: false,
  to_acc_bincode: false,
  to_acc_no: false,
  is_debit: true,
  merchant_name: true,
}

function RouteComponent() {
  const auth = useAuth()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const permission = auth.permission?.mp_view_banks
  const [summaryData, setSummaryData] = useState<SummaryItem[]>([])
  const [txnData, setTxnData] = useState<any[]>([])

  const [dateRange, setDateRange] = useState(getThisYearTimestamps())
  const columns: ColumnDef<VaTransactionType>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'txn_date',
      header: t('global.label_txn_date'),
      cell: ({ row }) => (
        <div className="w-[120px] text-wrap">
          {formatDateToLocalTz(row.getValue('txn_date'))}
        </div>
      ),
    },
    {
      accessorKey: 'bank_acc',
      header: t('global.label_bank_acc'),
      cell: ({ row }) => {
        if (row.getValue('is_debit')) {
          return (
            <div className="w-full flex flex-col items-center ">
              {row.getValue('frm_acc_bincode') ? (
                <img
                  src={BINCODE_PNG.get(row.getValue('frm_acc_bincode')) || ''}
                  alt={BINCODE_MAP.get(row.getValue('frm_acc_bincode')) || ''}
                  width={80}
                  height={160}
                />
              ) : (
                ''
              )}
              <span>{row.getValue('frm_acc_no')}</span>
              {/*<span>{(row.getValue("frm_acc_name") !== "") ? `${row.getValue("frm_acc_name")}` : ``}</span>*/}
              <span>
                {row.getValue('to_acc_name') !== ''
                  ? `${row.getValue('to_acc_name')}`
                  : ``}
              </span>
            </div>
          )
        } else {
          return (
            <div className="w-full flex flex-col items-center">
              {row.getValue('to_acc_bincode') ? (
                <img
                  src={BINCODE_PNG.get(row.getValue('to_acc_bincode')) || ''}
                  alt={BINCODE_MAP.get(row.getValue('to_acc_bincode')) || ''}
                  width={80}
                  height={160}
                />
              ) : (
                ''
              )}
              <span>{row.getValue('to_acc_no')}</span>
              <span>
                {row.getValue('to_acc_name') !== ''
                  ? `${row.getValue('to_acc_name')}`
                  : ``}
              </span>
            </div>
          )
        }
      },
    },
    {
      accessorKey: 'txn_amount',
      header: t('global.label_amount'),
      cell: ({ row }) => <ColorNumber number={row.getValue('txn_amount')} />,

      // filterFn: (row, id, value) => {
      //   return value.includes(row.getValue(id))
      // },
    },

    // {
    //     accessorKey: "reciprocalAccount",
    //     header: ({column}) => (
    //         <DataTableColumnHeader column={column} title={t("bank_page.label_bank")}/>
    //     ),
    //     cell: ({row}) => {
    //         if (!row.getValue("is_debit")) {
    //             return (<div className="w-[60px]">
    //                 {row.getValue("frm_acc_bincode") ?
    //                     <Image src={BINCODE_PNG.get(row.getValue("frm_acc_bincode")) || ""}
    //                            alt={BINCODE_MAP.get(row.getValue("frm_acc_bincode")) || ""} width={80}
    //                            height={160}/>
    //                     : ""}
    //             </div>)
    //         } else {
    //             return (<div className="w-[80px]">
    //                 {row.getValue("to_acc_bincode") ?
    //                     <Image src={BINCODE_PNG.get(row.getValue("to_acc_bincode")) || ""}
    //                            alt={BINCODE_MAP.get(row.getValue("to_acc_bincode")) || ""} width={80}
    //                            height={160}/>
    //                     : ""}
    //             </div>)
    //         }
    //     }
    //
    // },
    {
      accessorKey: 'reciprocalAccountName',
      header: t('global.label_reciprocal_account_name'),
      cell: ({ row }) => {
        if (!row.getValue('is_debit')) {
          return (
            <div className="w-full flex flex-col items-center">
              {BINCODE_PNG.get(row.getValue('frm_acc_bincode')) ? (
                <img
                  src={BINCODE_PNG.get(row.getValue('frm_acc_bincode')) || ''}
                  alt={BINCODE_MAP.get(row.getValue('frm_acc_bincode')) || ''}
                  width={80}
                  height={160}
                />
              ) : (
                ''
              )}
              <span>{row.getValue('frm_acc_no')}</span>
              {/*<span>{(row.getValue("frm_acc_name") !== "") ? `${row.getValue("frm_acc_name")}` : ``}</span>*/}
            </div>
          )
        } else {
          return (
            <div className="w-full flex flex-col items-center">
              {BINCODE_PNG.get(row.getValue('to_acc_bincode')) ? (
                <img
                  src={BINCODE_PNG.get(row.getValue('to_acc_bincode')) || ''}
                  alt={BINCODE_MAP.get(row.getValue('to_acc_bincode')) || ''}
                  width={80}
                  height={160}
                />
              ) : (
                ''
              )}
              <span>{row.getValue('to_acc_no')}</span>
              {/*<span>{(row.getValue("to_acc_name") !== "") ? `${row.getValue("to_acc_name")}` : ``}</span>*/}
            </div>
          )
        }
      },
      // filterFn: (row, id, value) => {
      //     console.log(value,row.getValue(id))
      //     return value.includes(row.getValue(id))
      // },
    },
    {
      accessorKey: 'narrative',
      header: t('global.label_narrative'),
      cell: ({ row }) => (
        <div className="w-[240px] text-wrap">{row.getValue('narrative')}</div>
      ),
    },
    {
      accessorKey: 'frm_acc_name',
      header: t('global.label_reciprocal_account'),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('frm_acc_name')}</div>
      ),
    },
    {
      accessorKey: 'frm_acc_no',
      header: t('global.label_frm_acc_no'),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('frm_acc_no')}</div>
      ),
    },
    {
      accessorKey: 'frm_acc_bincode',
      header: t('global.label_frm_acc_bankname'),
      cell: ({ row }) => (
        <div className="w-[80px]">
          {row.getValue('frm_acc_bincode') ? (
            <img
              src={BINCODE_PNG.get(row.getValue('frm_acc_bincode')) || ''}
              alt={BINCODE_MAP.get(row.getValue('frm_acc_bincode')) || ''}
              width={80}
              height={160}
            />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      accessorKey: 'to_acc_name',
      header: t('global.label_to_acc_name1'),
      cell: ({ row }) => (
        <div className="w-[80px]">
          {row.getValue('to_acc_no')} - {row.getValue('to_acc_name')}
        </div>
      ),
    },

    {
      accessorKey: 'to_acc_bincode',
      header: t('global.label_to_acc_bankname'),
      cell: ({ row }) => (
        <div className="w-[80px]">
          {row.getValue('to_acc_bincode') ? (
            <img
              src={BINCODE_PNG.get(row.getValue('to_acc_bincode')) || ''}
              alt={BINCODE_MAP.get(row.getValue('to_acc_bincode')) || ''}
              width={80}
              height={160}
            />
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      accessorKey: 'is_debit',
      header: 'Loại giao dịch',
      cell: ({ row }) => {
        const cashFlows = CASH_FLOW.find((cashFlow) => {
          return cashFlow.value === `${row.getValue('is_debit')}`
        })

        if (!cashFlows) {
          return null
        }

        return (
          <div className="flex w-[100px] items-center">
            {cashFlows.icon && (
              <cashFlows.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{cashFlows.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(`${row.getValue(id)}`)
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: 'to_acc_no',
      header: 'Tên merchant',
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('to_acc_no')}</div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(`${row.getValue(id)}`)
      },
    },
    // {
    //     accessorKey: "merchant_name",
    //     header: ({column}) => (
    //         <DataTableColumnHeader column={column} title={"Tên merchant"}/>
    //     ),
    //     cell: ({row}) => <div className="w-[80px]">{row.getValue("merchant_name")}</div>,
    // },

    // {
    //   id: "actions",
    //   cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
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

      const res2 = await fetchBankTxn(dateRange, TABLE_FIELDS)
      setTxnData(res2)
    }
    fetchDataFromBackEnd()
  }, [dateRange])

  return (
    (permission?.r || false) && (
      <div className="flex flex-col gap-4 py-4">
        <BankAccountTable title={t('bankAccountTable.lblAccountDesc')} />
        <BaseTable
          inputColumns={columns}
          summary={summaryData}
          data={txnData}
          dateFilter={dateRange}
          setDateFilter={setDateRange}
          title={t('bankAccountTable.lblBankTxn')}
          isMobile={isMobile}
          initialVisibilityState={visibilityState}
        />
        {/* <OtpDrawerForm /> */}
      </div>
    )
  )
}
