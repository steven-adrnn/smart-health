import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import clientPromise from '../lib/mongodb'

interface Product {
  _id: string
  name: string
  price: number
  image: string
}

interface CartProps {
  products: Product[]
}

const Cart: React.FC<CartProps> = ({ products }) => {
  const { data: session } = useSession()
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const updateQuantity = (productId: string, quantity: number) => {
    const newCart = { ...cart, [productId]: quantity }
    if (quantity === 0) {
      delete newCart[productId]
    }
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const totalPrice = products
    .filter((product) => cart[product._id])
    .reduce((total, product) => total + product.price * cart[product._id], 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {Object.keys(cart).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {products
            .filter((product) => cart[product._id])
            .map((product) => (
              <div key={product._id} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center">
                  <Image src={product.image} alt={product.name} width={100} height={100} className="w-24 h-24 object-cover rounded-md mr-4" />
                  <div>
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(product._id, cart[product._id] - 1)}
                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2">{cart[product._id]}</span>
                  <button
                    onClick={() => updateQuantity(product._id, cart[product._id] + 1)}
                    className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          <div className="mt-8">
            <p className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={() => {
                // Implement checkout logic here
                alert('Checkout functionality to be implemented')
              }}
              className="bg-primary text-white px-6 py-2 rounded-md mt-4 hover:bg-primary-dark"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
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

export default Cart

