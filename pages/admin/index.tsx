import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface Product {
  _id: string
  name: string
  price: number
  category: string
  farm: string
}

interface Order {
  _id: string
  user: string
  items: { product: Product; quantity: number }[]
  total: number
  status: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role !== 'admin') {
      router.push('/')
    } else {
      fetchProducts()
      fetchOrders()
    }
  }, [session, status, router])

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(data)
  }

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data)
  }

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const productData = Object.fromEntries(formData)

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })

    if (res.ok) {
      fetchProducts()
      form.reset()
    } else {
      alert('Failed to add product')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      fetchOrders()
    } else {
      alert('Failed to update order status')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <form onSubmit={handleAddProduct} className="mb-4">
            <input type="text" name="name" placeholder="Product Name" required className="w-full px-3 py-2 mb-2 border rounded" />
            <input type="number" name="price" placeholder="Price" required className="w-full px-3 py-2 mb-2 border rounded" />
            <input type="text" name="category" placeholder="Category" required className="w-full px-3 py-2 mb-2 border rounded" />
            <input type="text" name="farm" placeholder="Farm ID" required className="w-full px-3 py-2 mb-2 border rounded" />
            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Product</button>
          </form>
          <ul>
            {products.map((product) => (
              <li key={product._id} className="mb-2">
                {product.name} - ${product.price} - {product.category}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Orders</h2>
          <ul>
            {orders.map((order) => (
              <li key={order._id} className="mb-4 p-4 border rounded">
                <p>Order ID: {order._id}</p>
                <p>User: {order.user}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                  className="mt-2 px-3 py-2 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

