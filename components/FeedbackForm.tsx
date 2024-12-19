import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('Please sign in to submit feedback')
      return
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      })

      if (res.ok) {
        setSubmitted(true)
        setFeedback('')
      } else {
        alert('Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('An error occurred while submitting feedback')
    }
  }

  return (
    <div className="mt-8 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Feedback & Support</h2>
      {submitted ? (
        <p className="text-green-600">Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please provide your feedback or support request here"
            className="w-full px-3 py-2 border rounded"
            rows={4}
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  )
}

