import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import ProductGrid from '@/components/ProductGrid'
import ShoppingCart from '@/components/ShoppingCart'
import AIAssistant from '@/components/AIAssistant'
import RecipeGenerator from '@/components/RecipeGenerator'
import FeedbackForm from '@/components/FeedbackForm'

export default function Home() {
  const { data: session } = useSession()
  const [showCart, setShowCart] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showRecipeGenerator, setShowRecipeGenerator] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <div className="container mx-auto px-4">
      <header className="flex flex-wrap justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Fresh Farm Foods</h1>
        <nav className="space-x-2 mt-4 sm:mt-0">
          {session ? (
            <>
              <span className="mr-4">Welcome, {session.user.name}</span>
              <button onClick={() => signOut()} className="text-blue-500 hover:text-blue-700">Sign out</button>
              <button onClick={() => setShowCart(!showCart)} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                {showCart ? 'Hide Cart' : 'Show Cart'}
              </button>
              <button onClick={() => setShowAIAssistant(!showAIAssistant)} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                {showAIAssistant ? 'Hide AI Assistant' : 'Show AI Assistant'}
              </button>
              <button onClick={() => setShowRecipeGenerator(!showRecipeGenerator)} className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
                {showRecipeGenerator ? 'Hide Recipe Generator' : 'Show Recipe Generator'}
              </button>
              <button onClick={() => setShowFeedback(!showFeedback)} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                {showFeedback ? 'Hide Feedback' : 'Show Feedback'}
              </button>
            </>
          ) : (
            <button onClick={() => signIn()} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Sign in</button>
          )}
        </nav>
      </header>
      <main className="mt-8">
        {showCart ? <ShoppingCart /> : <ProductGrid />}
        {showAIAssistant && <AIAssistant />}
        {showRecipeGenerator && <RecipeGenerator />}
        {showFeedback && <FeedbackForm />}
      </main>
    </div>
  )
}

