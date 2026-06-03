import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../services/api'
import Loader from '../../components/Loader'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          API.get('/orders/all'),
          API.get('/auth'),
          API.get('/products'),
        ])
        setStats({
          totalOrders: ordersRes.data.total || ordersRes.data.orders?.length || 0,
          totalUsers: usersRes.data.length || 0,
          totalProducts: productsRes.data.total || 0,
          revenue: ordersRes.data.orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <Loader />

  const cards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, color: 'bg-blue-500', link: '/admin/products' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-green-500', link: '/admin/orders' },
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-purple-500', link: '/admin/users' },
    { label: 'Revenue', value: `₹${stats?.revenue || 0}`, color: 'bg-orange-500', link: '/admin/orders' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`${card.color} text-white rounded-xl p-6 hover:opacity-90 transition`}
          >
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm opacity-90 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Manage Products</h3>
          <p className="text-sm text-gray-600">Add, edit, or remove products</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Manage Orders</h3>
          <p className="text-sm text-gray-600">View and update order statuses</p>
        </Link>
        <Link
          to="/admin/users"
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage users</p>
        </Link>
      </div>
    </div>
  )
}
