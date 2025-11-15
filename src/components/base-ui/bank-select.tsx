'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useState } from 'react'
import { cn } from '@/lib/utils' // Optional: utility to merge class names
import { BANKLIST } from '@/lib/enum'

type BankSelectProps = {
  id?: string
  className?: string
  value?: string
  placeholder?: string
  onChange?: (binCode: string) => void
}

export default function BankSelect({
  id,
  className,
  value,
  placeholder,
  onChange,
}: BankSelectProps) {
  const [internalValue, setInternalValue] = useState<string>(value || '')

  const handleChange = (val: string) => {
    setInternalValue(val)
    onChange?.(val)
  }

  return (
    <div className={cn('w-full max-w-sm', className)}>
      <Select value={internalValue} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue id={id} placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {BANKLIST.map((bank) => (
            <SelectItem key={bank.bin} value={bank.bin}>
              {bank.shortName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
