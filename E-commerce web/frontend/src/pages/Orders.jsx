import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../redux/slices/orderSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function Orders() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>No orders yet. <Link to="/shop" className="text-indigo-600 hover:underline">Start shopping</Link></Message>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item._id} className="w-14 h-14 shrink-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/56'}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <span className="text-xs text-gray-500">+{order.items.length - 3} more</span>
                )}
                <div className="ml-auto text-right">
                  <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
