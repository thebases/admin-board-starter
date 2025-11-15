'use client'

import * as React from 'react'
import {
  z,
  type ZodTypeAny,
  ZodObject,
  ZodOptional,
  ZodDefault,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodEnum,
  ZodLiteral,
  ZodDate,
  ZodArray,
} from 'zod'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/useIsMobile'

// Optional: your own hook to detect mobile if you want a bottom drawer on mobile
// const useIsMobile = () => false

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
  disable?: boolean
  className?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export type FieldOverrides = Record<string, FieldOverride> // keys use dot-paths for nested fields e.g. "acc_obj.accNo"

export type DynamicDrawerFormProps<TSchema extends ZodTypeAny> = {
  schema: TSchema // MUST be a ZodObject (no optional/default wrappers at the root)
  title?: string
  description?: string
  defaultValues?: z.infer<TSchema> & { tag?: string }
  tag?: string
  handlers?: DrawerActionHandlers<z.infer<TSchema>>
  onSubmit?: (values: z.infer<TSchema>) => Promise<void> | void
  triggerLabel?: React.ReactNode
  buttonVariant?:
    | 'default'
    | 'link'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
  fieldOverrides?: FieldOverrides
  className?: string
  direction?: 'right' | 'left' | 'top' | 'bottom'
  /** render a heading per nested object level */
  groupObjects?: boolean
}

/**
 * ---- SCHEMA INTROSPECTION UTILS ----
 * We DO NOT unwrap the ROOT schema (must be ZodObject), but we do unwrap child fields
 * to handle optional/default/effects inside the object.
 */
function unwrapChildType(type: ZodTypeAny): ZodTypeAny {
  let t: any = type
  while (
    t instanceof ZodDefault ||
    t instanceof ZodOptional ||
    (t?._def?.typeName === 'ZodEffects' && typeof t.innerType === 'function')
  ) {
    if (
      t?._def?.typeName === 'ZodEffects' &&
      typeof t.innerType === 'function'
    ) {
      t = t.innerType()
      continue
    }
    if (t instanceof ZodDefault) {
      t = (t as ZodDefault<any>).removeDefault()
      continue
    }
    if (t instanceof ZodOptional) {
      t = (t as ZodOptional<any>).unwrap()
      continue
    }
  }
  return t as ZodTypeAny
}

export function isZodObject(schema: ZodTypeAny): schema is ZodObject<any> {
  return (
    schema instanceof ZodObject ||
    (schema as any)?._def?.typeName === 'ZodObject'
  )
}

export function getObjectShape(
  obj: ZodObject<any>,
): Record<string, ZodTypeAny> {
  const def: any = (obj as any)?._def
  // some zod builds expose def.shape as function; others via .shape getter
  return typeof def?.shape === 'function' ? def.shape() : (obj as any).shape
}

/**
 * ---- INPUT RENDERERS ----
 */
function DefaultInput({
  field,
  override,
}: {
  field: any
  override?: FieldOverride
}) {
  const as = override?.as
  if (as === 'textarea') {
    return (
      <Textarea
        disabled={override?.disable}
        {...field}
        placeholder={override?.placeholder}
        {...override?.inputProps}
        className={override?.className}
      />
    )
  }
  return (
    <Input
      disabled={override?.disable}
      {...field}
      placeholder={override?.placeholder}
      {...override?.inputProps}
      className={override?.className}
    />
  )
}

function NumberInput({
  field,
  override,
}: {
  field: any
  override?: FieldOverride
}) {
  return (
    <Input
      className={override?.className}
      disabled={override?.disable}
      type="number"
      {...field}
      placeholder={override?.placeholder}
      {...override?.inputProps}
      onChange={(e) =>
        field.onChange(
          e.target.value === '' ? undefined : Number(e.target.value),
        )
      }
    />
  )
}

function BooleanInput({
  field,
  override,
}: {
  field: any
  override?: FieldOverride
}) {
  if (override?.as === 'select') {
    return (
      <Select
        disabled={override?.disable}
        value={String(field.value ?? 'false')}
        onValueChange={(v) => field.onChange(v === 'true')}
      >
        <SelectTrigger className={override?.className}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    )
  }
  return (
    <Switch
      className={override?.className}
      checked={!!field.value}
      onCheckedChange={field.onChange}
      disabled={override?.disable}
    />
  )
}

function SelectInput({
  field,
  options,
  className,
}: {
  field: any
  options?: Array<{ label: string; value: any }>
  className?: string
}) {
  const value = field.value?.toString?.() ?? ''
  return (
    <Select value={value} onValueChange={(v) => field.onChange(v)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {(options ?? []).map((opt) => (
          <SelectItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function DateInput({
  field,
  override,
}: {
  field: any
  override?: FieldOverride
}) {
  // Decide between date-only and datetime-local
  const type = override?.as === 'date' ? 'date' : 'datetime-local'

  function toInputValue(date?: Date | string) {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    if (Number.isNaN(d.getTime())) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = d.getFullYear()
    const mm = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    if (type === 'date') return `${yyyy}-${mm}-${dd}`
    const hh = pad(d.getHours())
    const mi = pad(d.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
  }

  function fromInputValue(v: string) {
    if (!v) return undefined
    // browser's datetime-local is local time, construct Date accordingly
    return new Date(v)
  }

  return (
    <Input
      className={override?.className}
      disabled={override?.disable}
      type={type}
      value={toInputValue(field.value)}
      onChange={(e) => field.onChange(fromInputValue(e.target.value))}
      {...(override?.inputProps as any)}
    />
  )
}

/**
 * ---- HELPERS ----
 */
function humanLabel(key: string) {
  return key
    .split('.')
    .slice(-1)[0]
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function renderField(
  path: string,
  type: ZodTypeAny,
  form: any,
  groupObjects: boolean = true,
  fieldOverrides?: FieldOverrides,
): React.ReactNode {
  const unwrapped = unwrapChildType(type)
  const override = fieldOverrides?.[path]

  if (override?.hidden) return null

  // Objects (nested)
  if (isZodObject(unwrapped)) {
    const shape = getObjectShape(unwrapped as ZodObject<any>)
    const keys = Object.keys(shape)
    return (
      <div key={path} className="space-y-4">
        {groupObjects && path ? (
          <div className="pt-2">
            <div className="text-sm font-medium text-muted-foreground">
              {override?.label ?? humanLabel(path)}
            </div>
            <Separator className="my-2" />
          </div>
        ) : null}
        {keys.map((k) =>
          renderField(
            path ? `${path}.${k}` : k,
            shape[k],
            form,
            groupObjects,
            fieldOverrides,
          ),
        )}
      </div>
    )
  }

  // Arrays — primitive arrays only (for brevity). Complex arrays can be added later.
  if (unwrapped instanceof ZodArray) {
    const inner = unwrapChildType((unwrapped as ZodArray<any>).element)

    return (
      <FormField
        key={path}
        control={form.control}
        name={path as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
            <FormControl>
              <Input
                placeholder={override?.placeholder || 'Comma separated'}
                value={(Array.isArray(field.value) ? field.value : [])
                  .map((v: any) =>
                    v instanceof Date ? v.toISOString() : String(v ?? ''),
                  )
                  .join(', ')}
                onChange={(e) => {
                  const raw = e.target.value
                  const parts = raw
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                  const casted = parts.map((p) => {
                    if (inner instanceof ZodNumber) return Number(p)
                    if (inner instanceof ZodBoolean) return p === 'true'
                    if (inner instanceof ZodDate) return new Date(p)
                    return p
                  })
                  field.onChange(casted)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // Primitives
  if (unwrapped instanceof ZodString) {
    if (override?.as === 'select' && override.options) {
      return (
        <FormField
          key={path}
          control={form.control}
          name={path as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
              <FormControl>
                <SelectInput
                  field={field}
                  options={override.options}
                  className={override.className}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    }
    return (
      <FormField
        key={path}
        control={form.control}
        name={path as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
            <FormControl>
              <DefaultInput field={field} override={override} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  if (unwrapped instanceof ZodNumber) {
    return (
      <FormField
        key={path}
        control={form.control}
        name={path as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
            <FormControl>
              <NumberInput field={field} override={override} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  if (unwrapped instanceof ZodBoolean) {
    return (
      <FormField
        key={path}
        control={form.control}
        name={path as any}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
            </div>
            <FormControl>
              <BooleanInput field={field} override={override} />
            </FormControl>
          </FormItem>
        )}
      />
    )
  }

  if (unwrapped instanceof ZodEnum || unwrapped instanceof ZodLiteral) {
    const opts =
      override?.options ??
      (unwrapped instanceof ZodEnum
        ? (unwrapped.options as any[]).map((v) => ({
            label: String(v),
            value: v,
          }))
        : [
            {
              label: String((unwrapped as ZodLiteral<any>).value),
              value: (unwrapped as ZodLiteral<any>).value,
            },
          ])

    return (
      <FormField
        key={path}
        control={form.control}
        name={path as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
            <FormControl>
              <SelectInput field={field} options={opts} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  if (unwrapped instanceof ZodDate) {
    return (
      <FormField
        key={path}
        control={form.control}
        name={path as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{override?.label ?? humanLabel(path)}</FormLabel>
            <FormControl>
              <DateInput field={field} override={override} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // Fallback unsupported
  return (
    <FormField
      key={path}
      control={form.control}
      name={path as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {override?.label ?? `${humanLabel(path)} (unsupported)`}
          </FormLabel>
          <FormControl>
            <Input {...field} disabled placeholder="Unsupported field type" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/**
 * ---- MAIN COMPONENT (root must be ZodObject; nested unwrapping supported) ----
 */
export function DynamicDrawerForm<TSchema extends ZodTypeAny>(
  props: DynamicDrawerFormProps<TSchema>,
) {
  const {
    schema,
    title = 'Edit item',
    description,
    defaultValues,
    handlers,
    onSubmit,
    tag,
    triggerLabel = 'Open',
    buttonVariant = 'ghost',
    fieldOverrides,
    className,
    direction,
    groupObjects = true,
  } = props

  // Root schema MUST be a ZodObject; do NOT pass optional/default-wrapped roots
  if (!isZodObject(schema as any)) {
    const tn = (schema as any)?._def?.typeName ?? typeof schema
    throw new Error(
      `DynamicDrawerForm only supports ZodObject root schemas. Received: ${tn}`,
    )
  }
  const rootObject = schema as unknown as ZodObject<any>

  const isMobile = useIsMobile()
  const computedDirection = direction ?? (isMobile ? 'bottom' : 'right')

  const form = useForm<any>({
    resolver: zodResolver(schema as z.ZodType<any, any, any>),
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
        <Button
          variant={buttonVariant}
          className="text-foreground w-fit px-0 text-left"
        >
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
              {Object.keys(getObjectShape(rootObject)).map((k) => (
                <div key={k}>
                  {renderField(
                    k,
                    getObjectShape(rootObject)[k],
                    form,
                    groupObjects,
                    fieldOverrides,
                  )}
                </div>
              ))}

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
