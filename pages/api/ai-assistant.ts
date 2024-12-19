import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Product from '@/models/Product'

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

  if (req.method === 'POST') {
    try {
      const { query } = req.body

      // Fetch user preferences and purchase history
      const preferences = user.preferences || []
      const purchaseHistory = user.purchaseHistory || []

      // Fetch all products
      const products = await Product.find({})

      // Simple AI logic (to be replaced with a more sophisticated AI model)
      let response = ''

      if (query.toLowerCase().includes('recommend')) {
        const recommendedProducts = products.filter(product => 
          preferences.includes(product.category) || 
          purchaseHistory.some(item => item.product.toString() === product._id.toString())
        )
        response = `Based on your preferences and purchase history, I recommend: ${recommendedProducts.map(p => p.name).join(', ')}`
      } else if (query.toLowerCase().includes('seasonal')) {
        const seasonalProducts = products.filter(product => product.isSeasonal)
        response = `Current seasonal products are: ${seasonalProducts.map(p => p.name).join(', ')}`
      } else {
        response = "I'm sorry, I didn't understand your query. You can ask me for product recommendations or about seasonal products."
      }

      res.status(200).json({ response })
    } catch (error) {
      res.status(500).json({ message: 'Error processing AI assistant request' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

