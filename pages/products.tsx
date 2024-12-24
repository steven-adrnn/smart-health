import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import clientPromise from '../lib/mongodb'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  farm: string
}

interface ProductsProps {
  products: Product[]
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const { data: session } = useSession()
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = (productId: string) => {
    const newCart = { ...cart, [productId]: (cart[productId] || 0) + 1 }
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg overflow-hidden shadow-md">
            <Image src={product.image} alt={product.name} width={300} height={200} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-primary font-bold mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-4">From: {product.farm}</p>
              <button
                onClick={() => addToCart(product._id)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark w-full"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise
  const db = client.db('smart-health')
  const products = await db.collection('products').find({}).toArray()

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  }
}

export default Products

