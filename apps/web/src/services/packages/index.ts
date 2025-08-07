import type { CreditPackage } from '@workspace/prisma'

export async function getCreditPackages() {
  return fetch(`/api/packages`, {
    method: 'GET',
    next: {
      revalidate: 60 * 60 // 1 hour
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(
    (res) =>
      res.json() as Promise<{
        creditPackage: CreditPackage[]
      }>
  )
}
