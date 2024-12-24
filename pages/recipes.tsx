import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import clientPromise from '../lib/mongodb'

interface Recipe {
  _id: string
  name: string
  ingredients: string[]
  instructions: string[]
}

interface RecipesProps {
  recipes: Recipe[]
}

const Recipes: React.FC<RecipesProps> = ({ recipes }) => {
  const { data: session } = useSession()
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [generatedRecipe, setGeneratedRecipe] = useState<string>('')

  const handleIngredientChange = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  const generateRecipe = async () => {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Generate a recipe using the following ingredients: ${selectedIngredients.join(', ')}`,
      }),
    })

    const data = await response.json()
    setGeneratedRecipe(data.suggestion)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Recipes</h2>
          <ul className="space-y-4">
            {recipes.map((recipe) => (
              <li key={recipe._id} className="border p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
                <p className="text-gray-600 mb-2">Ingredients: {recipe.ingredients.join(', ')}</p>
                <details>
                  <summary className="cursor-pointer text-primary">View Instructions</summary>
                  <ol className="mt-2 list-decimal list-inside">
                    {recipe.instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </details>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generate a Recipe</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Ingredients:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(recipes.flatMap((r) => r.ingredients))).map((ingredient) => (
                <label key={ingredient} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedIngredients.includes(ingredient)}
                    onChange={() => handleIngredientChange(ingredient)}
                  />
                  <span className="ml-2">{ingredient}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={generateRecipe}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Generate Recipe
          </button>
          {generatedRecipe && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Generated Recipe:</h3>
              <p className="whitespace-pre-wrap">{generatedRecipe}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise
  const db = client.db('smart-health')
  const recipes = await db.collection('recipes').find({}).toArray()

  return {
    props: {
      recipes: JSON.parse(JSON.stringify(recipes)),
    },
  }
}

export default Recipes

