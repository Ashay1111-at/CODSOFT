import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Style
          </h1>
          <p className="text-lg md:text-xl mb-8 text-indigo-100">
            Shop the latest trends with exclusive deals and fast delivery.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}
