import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById, cancelOrder, clearOrder } from '../redux/slices/orderSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { order, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrderById(id))
    return () => dispatch(clearOrder())
  }, [dispatch, id])

  const handleCancel = () => {
    if (window.confirm('Cancel this order?')) {
      dispatch(cancelOrder(id))
    }
  }

  if (loading) return <Loader />
  if (error) return <Message variant="error">{error}</Message>
  if (!order) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-indigo-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Order #{order._id?.slice(-8).toUpperCase()}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.orderStatus]}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item._id} className="flex items-center gap-4">
              <div className="w-16 h-16 shrink-0">
                <img
                  src={item.image || 'https://via.placeholder.com/64'}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
              </div>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
            <p>{order.shippingAddress?.country}</p>
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost}`}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Payment Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span>{order.paymentInfo?.razorpayPaymentId === 'test_payment' ? 'Test Mode' : order.paymentInfo?.razorpayPaymentId ? 'Razorpay' : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID</span>
                <span className="text-xs font-mono">{order.paymentInfo?.razorpayPaymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="text-xs font-mono">{order.paymentInfo?.razorpayOrderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-semibold">
                  {order.paymentInfo?.razorpayPaymentId ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </div>
        </div>

      {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
        <button
          onClick={handleCancel}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Cancel Order
        </button>
      )}
    </div>
  )
}
