import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@/lib/dbConnect'
import Cart from '@/models/Cart'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await dbConnect()

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (req.method === 'GET') {
    try {
      let cart = await Cart.findOne({ user: user._id }).populate('items.product')
      if (!cart) {
        cart = await Cart.create({ user: user._id, items: [] })
      }
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart' })
    }
  } else if (req.method === 'POST') {
    try {
      const { productId, quantity = 1 } = req.body
      let cart = await Cart.findOne({ user: user._id })
      if (!cart) {
        cart = await Cart.create({ user: user._id, items: [] })
      }
      const existingItem = cart.items.find((item) => item.product.toString() === productId)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({ product: productId, quantity })
      }
      await cart.save()
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ message: 'Error updating cart' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

