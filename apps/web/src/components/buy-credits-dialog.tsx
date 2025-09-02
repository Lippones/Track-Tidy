'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@workspace/ui/components/dialog'
import { Check, Loader2 } from 'lucide-react'
import { useMutation, useQueries } from '@tanstack/react-query'
import { getCreditsPackages } from '@/actions/get-credits-packages'
import { getCreditsBalance } from '@/actions/get-credit-balance'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { buyCredits } from '@/actions/buy-credits'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface BuyCreditsDialogProps {
  children: React.ReactNode
}

export function BuyCreditsDialog({ children }: BuyCreditsDialogProps) {
  const router = useRouter()
  const [{ data }, { data: balance }] = useQueries({
    queries: [
      {
        queryKey: ['credit-packages'],
        queryFn: async () => {
          const { data, serverError, validationErrors } =
            await getCreditsPackages()
          if (serverError || validationErrors || !data) {
            throw new Error('Failed to fetch credit packages')
          }

          return data
        }
      },
      {
        queryKey: ['credits-balance'],
        queryFn: async () => {
          const { data, serverError, validationErrors } =
            await getCreditsBalance()
          if (serverError || validationErrors || !data) {
            throw new Error('Failed to fetch credit balance')
          }

          return data
        }
      }
    ]
  })

  async function handlePackageSelect(pkgId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const { data, serverError, validationErrors } = await buyCredits({
      packageId: pkgId
    })

    if (validationErrors) {
      toast.error('Invalid package selected')
      return
    }

    if (serverError || !data) {
      toast.error('Failed to create purchase')
      return
    }

    console.log(data)

    router.push(data.url ?? '')
  }

  const buyCreditMutation = useMutation({
    mutationFn: handlePackageSelect
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            Buy Credits
            <Badge variant="secondary" className="ml-2">
              Créditos: {balance ?? 0}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {buyCreditMutation.isPending && (
          <div className="absolute inset-0 bg-background/20 flex items-center justify-center z-10">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {data?.map((pkg, i) => (
            <Card
              key={pkg.id}
              className={`relative cursor-pointer transition-all hover:shadow-md ${
                i === 1 ? 'ring-2 ring-primary' : ''
              } ${buyCreditMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => buyCreditMutation.mutate(pkg.id)}
            >
              {i === 1 && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {pkg.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(pkg.price / 100)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.credits} créditos
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant={i === 1 ? 'default' : 'outline'}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
