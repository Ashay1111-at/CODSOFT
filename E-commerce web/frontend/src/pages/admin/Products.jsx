import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../../redux/slices/productSlice'
import API from '../../services/api'
import Loader from '../../components/Loader'
import Message from '../../components/Message'

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, categories, loading } = useSelector((state) => state.products)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    stock: '',
    images: [],
    isFeatured: false,
    isTrending: false,
  })
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }))
    dispatch(fetchCategories())
  }, [dispatch])

  const resetForm = () => {
    setForm({ title: '', description: '', category: '', price: '', comparePrice: '', stock: '', images: [], isFeatured: false, isTrending: false })
    setEditing(null)
    setShowForm(false)
    setMsg('')
  }

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      comparePrice: product.comparePrice || '',
      stock: product.stock,
      images: product.images || [],
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
    })
    setEditing(product._id)
    setShowForm(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, { public_id: res.data.public_id, url: res.data.url }],
      }))
    } catch (err) {
      console.error(err)
      setMsg('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        comparePrice: Number(form.comparePrice) || 0,
        stock: Number(form.stock),
      }
      if (editing) {
        await API.put(`/products/${editing}`, payload)
        setMsg('Product updated!')
      } else {
        await API.post('/products', payload)
        setMsg('Product created!')
      }
      resetForm()
      dispatch(fetchProducts({ limit: 100 }))
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      dispatch(fetchProducts({ limit: 100 }))
    } catch (err) {
      console.error(err)
      setMsg('Delete failed')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {msg && <Message variant={msg.includes('failed') || msg.includes('Failed') ? 'error' : 'success'}>{msg}</Message>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} list="categories" className="w-full px-3 py-2 border rounded-lg" />
              <datalist id="categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
              <input type="number" min="0" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">x</button>
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm" />
              {uploading && <span className="text-sm text-gray-500 ml-2">Uploading...</span>}
            </div>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="mr-2" />
                Featured
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm({ ...form, isTrending: e.target.checked })} className="mr-2" />
                Trending
              </label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                {editing ? 'Update' : 'Create'} Product
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <img src={p.images?.[0]?.url || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover rounded" />
                  </td>
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Delete</button>
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
