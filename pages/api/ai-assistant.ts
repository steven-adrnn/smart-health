import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body

    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.8,
    })

    const suggestion = response.data.choices[0].text.trim()
    res.status(200).json({ suggestion })
  } catch (error) {
    console.error('Error in AI assistant:', error)
    res.status(500).json({ message: 'Error processing your request' })
  }
}

