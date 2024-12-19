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
      const { ingredients } = req.body

      // Fetch product details for the ingredients
      const products = await Product.find({ _id: { $in: ingredients } })

      // Simple recipe generation logic (to be replaced with a more sophisticated AI model)
      const recipe = {
        name: `${products[0].name} ${products[1] ? 'and ' + products[1].name : ''} Dish`,
        ingredients: products.map(p => `${p.name} - ${p.quantity || '1'} ${p.unit || 'piece'}`),
        instructions: [
          `1. Prepare all ingredients: ${products.map(p => p.name).join(', ')}`,
          '2. Mix ingredients in a large bowl',
          '3. Cook the mixture in a pan over medium heat for 10 minutes',
          '4. Serve and enjoy your dish!'
        ]
      }

      res.status(200).json({ recipe })
    } catch (error) {
      res.status(500).json({ message: 'Error generating recipe' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

