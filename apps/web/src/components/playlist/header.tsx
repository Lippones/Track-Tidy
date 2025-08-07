import { auth } from '@workspace/auth'
import { headers } from 'next/headers'

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log('Session in Header:', session)

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">Track Tidy</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/credits" className="hover:underline">
              Buy Credits
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
