import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface Recipe {
  name: string
  ingredients: string[]
  instructions: string[]
}

export default function RecipeGenerator() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const { data: session } = useSession()

  const handleIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options
    const selectedValues = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value)
      }
    }
    setSelectedIngredients(selectedValues)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      alert('Please sign in to use the recipe generator')
      return
    }

    try {
      const res = await fetch('/api/recipe-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      })
      const data = await res.json()
      setRecipe(data.recipe)
    } catch (error) {
      console.error('Error generating recipe:', error)
      alert('An error occurred while generating the recipe.')
    }
  }

  return (
    <div className="mt-8 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Recipe Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          multiple
          onChange={handleIngredientChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="1">Tomatoes</option>
          <option value="2">Chicken</option>
          <option value="3">Pasta</option>
          <option value="4">Spinach</option>
          <option value="5">Cheese</option>
        </select>
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Generate Recipe
        </button>
      </form>
      {recipe && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">{recipe.name}</h3>
          <h4 className="font-semibold mt-2">Ingredients:</h4>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h4 className="font-semibold mt-2">Instructions:</h4>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

