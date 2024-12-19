import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'
import { apiAuthMiddleware } from '@/lib/apiAuth'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === 'GET') {
    try {
      const products = await Product.find({}).populate('farm', 'name')
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default apiAuthMiddleware(handler)

