import React from 'react'
import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Health</h3>
            <p className="text-gray-600">Fresh and healthy food from local farms to your table.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-gray-600 hover:text-primary">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600">Email: info@smarthealth.com</p>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">&copy; 2023 Smart Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

