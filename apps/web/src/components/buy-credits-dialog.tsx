'use server'

import { useState } from 'react'
import { buyCredits } from '@/actions/buy-credits'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@workspace/ui/components/dialog'
import { CreditCard, QrCode } from 'lucide-react'
import { getCreditPackages } from '@/services/packages'
import { useSuspenseQuery } from '@tanstack/react-query'

interface BuyCreditsDialogProps {
  children: React.ReactNode
}

export function BuyCreditsDialog({ children }: BuyCreditsDialogProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['credit-packages'],
    queryFn: getCreditPackages
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compre créditos</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.creditPackage.map((pkg) => (
            <Card key={pkg.id} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{pkg.description}</p>
                <p className="text-lg font-bold">{pkg.price / 100} USD</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <button className="btn btn-secondary">
            <CreditCard className="mr-2" />
            Pay with Card
          </button>
          <button className="btn btn-secondary">
            <QrCode className="mr-2" />
            Pay with PIX
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
