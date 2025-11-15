'use client'

import { z } from 'zod'

// shadcn/ui imports (adjust paths to your setup)
import {
  DynamicDrawerForm,
  isZodObject,
  type DrawerActionHandlers,
} from './DynamicDrawer'
/**
 * ---- EXAMPLE USAGE (BankAccountSchema requested fields) ----
 */
export const BankAccountSchema = z.object({
  acc_obj: z.object({
    accHolderName: z.string().min(1),
    accNo: z.string().min(1),
    accBinCode: z.string().min(1),
    accPartnerId: z.string().min(1),
  }),
  Active: z.boolean().default(true),
  ipnservice: z.enum(['enabled', 'disabled']).default('enabled'),
  tag: z.string().optional(),
})

const handlers: DrawerActionHandlers<z.infer<typeof BankAccountSchema>> = {
  create: async (values) => {
    console.log('CREATE called', values)
  },
  update: async (values) => {
    console.log('UPDATE called', values)
  },
}

export default function Example() {
  // The defaultValue can be current record or new one
  const defaultValues: z.infer<typeof BankAccountSchema> = {
    acc_obj: {
      accHolderName: 'Alex Doe',
      accNo: '1234567890',
      accBinCode: '9704',
      accPartnerId: 'partner_001',
    },
    Active: true,
    ipnservice: 'enabled',
    tag: 'create', // tag is used for define the Drawer will be update or create
  }

  return (
    <DynamicDrawerForm
      schema={BankAccountSchema}
      title="Edit section"
      description="Quickly update a proposal section"
      defaultValues={defaultValues}
      handlers={handlers}
      tag={defaultValues.tag}
      triggerLabel={<span>Open section</span>}
      fieldOverrides={{
        'acc_obj.accHolderName': { label: 'Account holder name' },
        'acc_obj.accNo': { label: 'Account number' },
        'acc_obj.accBinCode': { label: 'BIN code' },
        'acc_obj.accPartnerId': { label: 'Partner ID' },
        Active: { label: 'Active', as: 'switch' },
        ipnservice: {
          label: 'IPN Service',
          as: 'select',
          options: [
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled' },
          ],
        },
      }}
    />
  )
}

/**
 * ---- LIGHT RUNTIME TESTS (non-throwing) ----
 * These help validate the schema in dev without breaking the page.
 */
function runSchemaTests() {
  try {
    // valid
    const ok = BankAccountSchema.parse({
      acc_obj: {
        accHolderName: 'Jane',
        accNo: '555',
        accBinCode: '9704',
        accPartnerId: 'p-42',
      },
      Active: false,
      ipnservice: 'disabled',
    })
    console.log('[TEST] valid parse ok', ok)
  } catch (e) {
    console.error('[TEST] expected valid parse to succeed', e)
  }

  try {
    // invalid ipnservice
    BankAccountSchema.parse({
      acc_obj: {
        accHolderName: 'Jane',
        accNo: '555',
        accBinCode: '9704',
        accPartnerId: 'p-42',
      },
      Active: true,
      ipnservice: 'oops', // invalid
    } as any)
    console.error('[TEST] expected invalid ipnservice to fail but it passed')
  } catch {
    console.log('[TEST] invalid ipnservice rejected as expected')
  }

  try {
    // missing nested required
    BankAccountSchema.parse({
      acc_obj: {
        accHolderName: 'Jane',
        // accNo missing
        accBinCode: '9704',
        accPartnerId: 'p-42',
      },
      Active: true,
      ipnservice: 'enabled',
    } as any)
    console.error('[TEST] expected missing accNo to fail but it passed')
  } catch {
    console.log('[TEST] missing accNo rejected as expected')
  }

  try {
    // Root MUST be ZodObject: primitives should be rejected by the component contract
    const nonObj = z.string()
    const isObj = isZodObject(nonObj as any)
    console.log(
      '[TEST] primitive root recognized as non-object (should be false):',
      isObj === false,
    )
  } catch (e) {
    console.error('[TEST] primitive root type check failed', e)
  }

  try {
    // Ensure our root check passes for the actual schema
    const isObj = isZodObject(BankAccountSchema as any)
    console.log('[TEST] BankAccountSchema is object:', isObj)
  } catch (e) {
    console.error('[TEST] object root check failed', e)
  }
}

try {
  runSchemaTests()
} catch {
  /* ignore in prod */
}
