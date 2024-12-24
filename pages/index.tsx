import React from 'react'
import Link from 'next/link'

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Smart Health</h1>
      <p className="text-xl mb-8">Discover fresh and healthy food from local farms</p>
      <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-md text-lg hover:bg-primary-dark">
        Shop Now
      </Link>
    </div>
  )
}

export default Home

