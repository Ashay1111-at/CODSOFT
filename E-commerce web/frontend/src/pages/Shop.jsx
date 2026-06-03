import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function Shop() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, loading, error, pages, total } = useSelector(
    (state) => state.products
  )

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  })

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const params = {}
    if (filters.category) params.category = filters.category
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.rating) params.rating = filters.rating
    if (filters.inStock) params.inStock = filters.inStock
    if (filters.search) params.search = filters.search
    if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort
    if (currentPage > 1) params.page = currentPage

    setSearchParams(params, { replace: true })
    dispatch(fetchProducts({ ...params, page: currentPage }))
  }, [dispatch, filters, currentPage, setSearchParams])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', rating: '', inStock: '', search: '', sort: 'newest' })
    setCurrentPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Rating</h3>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Any Rating</option>
                <option value="4">4 &amp; Up</option>
                <option value="3">3 &amp; Up</option>
                <option value="2">2 &amp; Up</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock === 'true'}
                onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                className="mr-2"
              />
              <label htmlFor="inStock" className="text-sm text-gray-700">In Stock Only</label>
            </div>

            {(filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.inStock || filters.search) && (
              <button
                onClick={clearFilters}
                className="w-full text-sm text-red-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {total} product{total !== 1 ? 's' : ''} found
            </p>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : products.length === 0 ? (
            <Message>No products found.</Message>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                    disabled={currentPage === pages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
