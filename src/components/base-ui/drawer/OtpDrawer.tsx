'use client'

import * as React from 'react'
import { z, type ZodTypeAny } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn/ui imports (adjust paths to your setup)
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useTranslation } from 'react-i18next'

// Optional: your own hook to detect mobile if you want a bottom drawer on mobile
// const useIsMobile = () => false
// ========== COMPONENT'S SCHEMA ========
const FormSchema = z.object({
  otp: z.string().min(2, {
    message: 'Username có độ dài tối thiểu 2 kí tự',
  }),
})

/**
 * ---- TYPES ----
 */
export type DrawerActionHandlers<TValues> = Record<
  string,
  (values: TValues) => Promise<void> | void
>

export type FieldOverride = {
  label?: string
  placeholder?: string
  as?:
    | 'input'
    | 'textarea'
    | 'select'
    | 'switch'
    | 'date'
    | 'datetime'
    | 'number'
  options?: Array<{ label: string; value: string | number | boolean }>
  hidden?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export type FieldOverrides = Record<string, FieldOverride> // keys use dot-paths for nested fields e.g. "acc_obj.accNo"

export type StaticDrawerFormProps<TSchema extends ZodTypeAny> = {
  schema?: TSchema // MUST be a ZodObject (no optional/default wrappers at the root)
  title?: string
  description?: string
  defaultValues?: z.infer<TSchema> & { tag?: string }
  tag?: string
  handlers?: DrawerActionHandlers<z.infer<TSchema>>
  onSubmit?: (values: z.infer<TSchema>) => Promise<void> | void
  triggerLabel?: React.ReactNode
  className?: string
  direction?: 'right' | 'left' | 'top' | 'bottom'
  /** render a heading per nested object level */
  // groupObjects?: boolean
}

/**
 * ---- MAIN COMPONENT (root must be ZodObject; nested unwrapping supported) ----
 */
export function OtpDrawerForm<TSchema extends ZodTypeAny>(
  props: StaticDrawerFormProps<TSchema>,
) {
  const {
    title = 'Edit item',
    description,
    defaultValues,
    handlers,
    onSubmit,
    tag,
    triggerLabel = 'Open',
    className,
    direction,
    // groupObjects = true,
  } = props

  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const computedDirection = direction ?? (isMobile ? 'bottom' : 'right')

  const form = useForm<any>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues as any,
    mode: 'onBlur',
  })

  const handleSubmit = async (values: z.infer<TSchema>) => {
    const t = tag ?? (defaultValues as any)?.tag ?? ''
    const handler = t && handlers ? handlers[t] : undefined
    console.log(values)
    if (handler) {
      await handler(values)
      return
    }
    if (onSubmit) {
      await onSubmit(values)
      return
    }
    console.log('Submitted values (no handler matched):', { tag: t, values })
  }

  return (
    <Drawer direction={computedDirection}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {triggerLabel}
        </Button>
      </DrawerTrigger>
      <DrawerContent className={className}>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
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

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button type="submit">Submit</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
