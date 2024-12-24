import React from 'react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import clientPromise from '../../lib/mongodb'

interface AdminDashboardProps {
  productCount: number
  orderCount: number
  userCount: number
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ productCount, orderCount, userCount }) => {
  const { data: session } = useSession()

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    return <div>Access denied. You must be an admin to view this page.</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-3xl font-bold text-primary">{productCount}</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline mt-2 inline-block">
            Manage Products
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-3xl font-bold text-primary">{orderCount}</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline mt-2 inline-block">
            Manage Orders
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold text-primary">{userCount}</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await clientPromise
  const db = client.db('smart-health')

  const productCount = await db.collection('products').countDocuments()
  const orderCount = await db.collection('orders').countDocuments()
  const userCount = await db.collection('users').countDocuments()

  return {
    props: {
      productCount,
      orderCount,
      userCount,
    },
  }
}

export default AdminDashboard

