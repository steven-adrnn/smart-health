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

  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true })
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' })
      }
      res.status(200).json(updatedOrder)
    } catch (error) {
      res.status(500).json({ message: 'Error updating order' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

