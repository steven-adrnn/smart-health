import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await dbConnect()

  if (req.method === 'GET') {
    try {
      const products = await Product.find({})
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' })
    }
  } else if (req.method === 'POST') {
    try {
      const product = await Product.create(req.body)
      res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ message: 'Error creating product' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

