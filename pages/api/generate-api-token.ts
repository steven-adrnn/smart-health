import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { clientId, clientName } = req.body

    if (!clientId || !clientName) {
      return res.status(400).json({ message: 'Missing clientId or clientName' })
    }

    const token = jwt.sign(
      { clientId, clientName },
      process.env.API_SECRET_KEY!,
      { expiresIn: '30d' }
    )

    return res.status(200).json({ token })
  }

  res.status(405).json({ message: 'Method not allowed' })
}

