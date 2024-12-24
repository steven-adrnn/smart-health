import React from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Smart Health
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/products" className="text-gray-600 hover:text-primary">
            Products
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-primary">
            <ShoppingCartIcon className="h-6 w-6" />
          </Link>
          {session ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile" className="text-gray-600 hover:text-primary">
                <UserIcon className="h-6 w-6" />
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header

