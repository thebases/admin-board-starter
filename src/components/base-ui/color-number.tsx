/*
 * Copyright (c) by The Base, 2024
 * These code are developed and maintained by The Base.
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
 */
// components/ColorNumber.tsx
import React from 'react'
import { cn, formatCurrency } from '@/lib/utils'

interface ColorNumberProps {
  number: string | number
  className?: String
}

const ColorNumber: React.FC<ColorNumberProps> = ({ number, className }) => {
  // Ensure number is a valid number (even if passed as a string)
  const parsedNumber = typeof number === 'string' ? parseFloat(number) : number

  // Determine color based on the parsed number
  const numberColor = parsedNumber >= 0 ? 'text-green-500' : 'text-red-500'

  // If parsedNumber is NaN, handle gracefully
  if (isNaN(parsedNumber)) {
    return <span className="text-gray-500">Invalid number</span>
  }

  return (
    <div className="flex flex-row justify-end items-end w-full">
      <span className={cn(`font-bold ${numberColor}`, className)}>
        {formatCurrency(parsedNumber)}
      </span>
    </div>
  )
}

export default ColorNumber
