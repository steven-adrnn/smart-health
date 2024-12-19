import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
    image: string
  }
  quantity: number
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchCart()
    }
  }, [session])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      setCartItems(data.items)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })
      if (res.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
      if (res.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <Image src={item.product.image} alt={item.product.name} width={80} height={80} className="rounded" />
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h3>
            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

