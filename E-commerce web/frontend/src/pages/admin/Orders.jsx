import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { allOrders, loading, error } = useSelector((state) => state.orders)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    dispatch(fetchAllOrders({ limit: 100 }))
  }, [dispatch])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, orderStatus: newStatus })).unwrap()
      setMsg(`Order status updated to ${newStatus}`)
    } catch (err) {
      setMsg(err || 'Failed to update')
    }
  }

  const orders = allOrders?.orders || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>
      {msg && <Message variant={msg.includes('Failed') ? 'error' : 'success'}>{msg}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>No orders found.</Message>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">
                    {order._id?.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-3">{order.user?.name || 'N/A'}</td>
                  <td className="p-3">{order.items?.length || 0}</td>
                  <td className="p-3 font-semibold">₹{order.totalAmount}</td>
                  <td className="p-3 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="px-2 py-1 border rounded text-xs"
                      disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
