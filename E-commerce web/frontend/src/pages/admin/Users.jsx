import { useEffect, useState } from 'react'
import API from '../../services/api'
import Loader from '../../components/Loader'
import Message from '../../components/Message'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth')
      setUsers(res.data)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [])

  const handleToggleBlock = async (user) => {
    try {
      const updatedBlocked = !user.isBlocked
      const res = await API.put(`/auth/${user._id}`, { isBlocked: updatedBlocked })
      setUsers((prev) => prev.map((u) => (u._id === user._id ? res.data : u)))
      setMsg(`User status updated to ${updatedBlocked ? 'Blocked' : 'Active'}`)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update user status')
    }
  }

  const handleToggleRole = async (user) => {
    try {
      const updatedRole = user.role === 'admin' ? 'customer' : 'admin'
      const res = await API.put(`/auth/${user._id}`, { role: updatedRole })
      setUsers((prev) => prev.map((u) => (u._id === user._id ? res.data : u)))
      setMsg(`User role updated to ${updatedRole}`)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update user role')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await API.delete(`/auth/${id}`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
      setMsg('User deleted successfully')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
      {msg && (
        <Message variant={msg.includes('failed') || msg.includes('Failed') ? 'error' : 'success'}>
          {msg}
        </Message>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleToggleRole(user)}
                      className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-medium"
                    >
                      Make {user.role === 'admin' ? 'Customer' : 'Admin'}
                    </button>
                    <button
                      onClick={() => handleToggleBlock(user)}
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        user.isBlocked
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      }`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 font-medium"
                    >
                      Delete
                    </button>
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
