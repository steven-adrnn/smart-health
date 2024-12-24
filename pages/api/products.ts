import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const db = client.db('smart-health')

  switch (req.method) {
    case 'GET':
      const products = await db.collection('products').find({}).toArray()
      res.status(200).json(products)
      break
    case 'POST':
      const newProduct = req.body
      const result = await db.collection('products').insertOne(newProduct)
      res.status(201).json(result)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

