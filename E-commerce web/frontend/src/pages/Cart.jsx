import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
} from '../redux/slices/cartSlice'
import Message from '../components/Message'

export default function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Message>Your cart is empty.</Message>
        <Link
          to="/shop"
          className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-sm text-red-600 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
          >
            <Link to={`/product/${item._id}`} className="w-20 h-20 shrink-0">
              <img
                src={item.images?.[0]?.url || 'https://via.placeholder.com/80'}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item._id}`}>
                <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
              </Link>
              <p className="text-indigo-600 font-semibold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      id: item._id,
                      quantity: Math.max(1, item.quantity - 1),
                    })
                  )
                }
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-3 py-1 font-medium">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      id: item._id,
                      quantity: Math.min(item.stock || Infinity, item.quantity + 1),
                    })
                  )
                }
                disabled={item.stock !== undefined && item.quantity >= item.stock}
                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <p className="font-semibold text-gray-800 w-24 text-right">
              ₹{item.price * item.quantity}
            </p>
            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-800">Subtotal</span>
          <span className="text-2xl font-bold text-gray-900">₹{total}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {total > 500
            ? 'Free shipping eligible!'
            : `Add ₹${500 - total} more for free shipping`}
        </p>
        <Link
          to="/checkout"
          className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
