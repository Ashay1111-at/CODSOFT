import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearProduct } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import API from '../services/api'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading, error } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewMsg, setReviewMsg] = useState('')

  useEffect(() => {
    dispatch(fetchProductById(id))
    window.scrollTo(0, 0)
    return () => dispatch(clearProduct())
  }, [dispatch, id])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/product/${id}`)
        setReviews(res.data)
      } catch (err) {
        console.error('Failed to fetch reviews', err)
      }
    }
    fetchReviews()
  }, [id])

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }))
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post(`/reviews/product/${id}`, reviewForm)
      setReviewForm({ rating: 5, comment: '' })
      setReviewMsg('Review submitted!')
      const res = await API.get(`/reviews/product/${id}`)
      setReviews(res.data)
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) return <Loader />
  if (error) return <Message variant="error">{error}</Message>
  if (!product) return null

  const imageUrl = product.images?.[selectedImage]?.url || 'https://via.placeholder.com/500x500?text=No+Image'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${selectedImage === i ? 'border-indigo-600' : 'border-gray-200'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(product.ratings) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.numReviews} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.comparePrice > product.price && (
              <span className="text-xl text-gray-400 line-through ml-3">₹{product.comparePrice}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {user && (
          <form onSubmit={handleReviewSubmit} className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
            {reviewMsg && <Message variant={reviewMsg.includes('submitted') ? 'success' : 'error'}>{reviewMsg}</Message>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="px-3 py-2 border rounded-lg"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Submit Review
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
