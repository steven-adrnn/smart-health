import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@/lib/dbConnect'
import Feedback from '@/models/Feedback'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  await dbConnect()

  if (req.method === 'POST') {
    try {
      const { feedback } = req.body
      const newFeedback = await Feedback.create({
        user: session.user.id,
        content: feedback,
      })
      res.status(201).json(newFeedback)
    } catch (error) {
      res.status(500).json({ message: 'Error submitting feedback' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

