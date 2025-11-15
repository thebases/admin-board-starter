/*
 * Copyright (c) by The Base, 2024
 * These code are developed and maintained by The Base.
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
 */

'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { cn } from '@/lib/utils'

type VietQRCodeProps = {
  qrString: string // The prop that will be passed from the parent
  payment_amount?: number
  size?: number // Optional prop for QR code size
  className?: string
}

const VietQRCode: React.FC<VietQRCodeProps> = ({
  qrString,
  size = 240,
  className = '',
}) => {
  return (
    <div
      className={cn('flex flex-col justify-center items-center ', className)}
    >
      {/* QR Code Canvas */}
      <div className="flex flex-row justify-center ">
        <QRCodeCanvas
          className="p-2 border-4 border-black rounded-lg"
          value={qrString} // The value that will be encoded in the QR code
          size={size} // Size of the QR code
          bgColor="#ffffff" // Background color
          fgColor="#000000" // Foreground color (QR code color)
          level="H" // Error correction level
        />
      </div>
    </div>
  )
}
export default VietQRCode
