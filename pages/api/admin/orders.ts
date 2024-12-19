import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@/lib/dbConnect'
import Order from '@/models/Order'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const orders = await Order.find({}).populate('user', 'name email')
      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

