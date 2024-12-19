import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  farm: { name: string }
  image: string
  isSeasonal: boolean
  isPartOfBox: boolean
  boxName?: string
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  const addToCart = async (productId: string) => {
    if (!session) {
      alert('Please sign in to add items to your cart')
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (res.ok) {
        alert('Product added to cart')
      } else {
        alert('Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding product to cart:', error)
      alert('An error occurred while adding the product to cart')
    }
  }

  const seasonalProducts = products.filter(product => product.isSeasonal)
  const farmToTableBoxes = products.filter(product => product.isPartOfBox)
  const regularProducts = products.filter(product => !product.isSeasonal && !product.isPartOfBox)

  return (
    <div className="space-y-8">
      {seasonalProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Seasonal Specials</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {seasonalProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </div>
      )}

      {farmToTableBoxes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Farm-to-Table Boxes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {farmToTableBoxes.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {regularProducts.map((product) => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, addToCart }: { product: Product; addToCart: (id: string) => void }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <Image src={product.image} alt={product.name} width={300} height={200} className="w-full" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.farm.name}</p>
        {product.isSeasonal && (
          <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-2">
            Seasonal
          </span>
        )}
        {product.isPartOfBox && (
          <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-2">
            {product.boxName}
          </span>
        )}
        <p className="mt-2">{product.description}</p>
        <p className="mt-2 text-lg font-bold">${product.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product._id)}
          className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

