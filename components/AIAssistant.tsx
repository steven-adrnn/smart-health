import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AIAssistant() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('Please sign in to use the AI assistant')
      return
    }

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error querying AI assistant:', error)
      setResponse('Sorry, an error occurred while processing your request.')
    }
  }

  return (
    <div className="mt-8 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for recommendations or seasonal products"
          className="w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Ask AI Assistant
        </button>
      </form>
      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}

