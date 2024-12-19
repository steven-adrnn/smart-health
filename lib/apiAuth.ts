import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export function apiAuthMiddleware(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.API_SECRET_KEY!)
      ;(req as any).apiClient = decoded
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

