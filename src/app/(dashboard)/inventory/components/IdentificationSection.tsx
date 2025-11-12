"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScanLine, QrCode } from "lucide-react"

interface IdentificationSectionProps {
  barcode: string
  qrCode: string
  onBarcodeChange: (value: string) => void
  onQRCodeChange: (value: string) => void
  onGenerateBarcode: () => void
  onGenerateQRCode: () => void
}

export function IdentificationSection({
  barcode,
  qrCode,
  onBarcodeChange,
  onQRCodeChange,
  onGenerateBarcode,
  onGenerateQRCode
}: IdentificationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-cyan-600 rounded-full"></span>
        Identification
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="barcode" className="text-sm font-medium">
            Barcode
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="barcode"
              value={barcode}
              onChange={(e) => onBarcodeChange(e.target.value)}
              placeholder="e.g., 1234567890123"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onGenerateBarcode}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ScanLine className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="qr_code" className="text-sm font-medium">
            QR Code
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="qr_code"
              value={qrCode}
              onChange={(e) => onQRCodeChange(e.target.value)}
              placeholder="QR code data"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onGenerateQRCode}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

