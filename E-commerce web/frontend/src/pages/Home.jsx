import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedProducts, fetchTrendingProducts, fetchCategories } from '../redux/slices/productSlice'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'

export default function Home() {
  const dispatch = useDispatch()
  const { featured, trending, categories, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    dispatch(fetchTrendingProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div>
      <Hero />

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md hover:bg-indigo-50 transition"
              >
                <p className="font-medium text-gray-800 text-sm">{cat}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {featured.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
                <Link to="/shop" className="text-indigo-600 hover:underline text-sm">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {trending.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
                <Link to="/shop?sort=popular" className="text-indigo-600 hover:underline text-sm">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trending.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
