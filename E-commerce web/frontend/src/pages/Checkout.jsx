import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../redux/slices/orderSlice'
import { clearCart, selectCartItems, selectCartTotal } from '../redux/slices/cartSlice'
import Message from '../components/Message'
import Loader from '../components/Loader'
import API from '../services/api'

function loadRazorpay(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true)
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const TEST_CREDENTIALS = [
  { type: 'Credit Card', number: '4111 1111 1111 1111', expiry: '12/28', cvv: '123', name: 'Any Name' },
  { type: 'Debit Card', number: '4012 8888 8888 1881', expiry: '12/28', cvv: '123', name: 'Any Name' },
  { type: 'UPI', handle: 'success@razorpay', note: 'Pay via any UPI app (Google Pay, PhonePe, Paytm)' },
  { type: 'Net Banking', handle: 'HDFC Bank / ICICI', note: 'Select any bank, use OTP 1234' },
  { type: 'Wallet', handle: 'Paytm / Freecharge', note: 'Select wallet, then pay' },
]

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const { loading: orderLoading } = useSelector((state) => state.orders)
  const { user } = useSelector((state) => state.auth)

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  })
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const placeOrder = async (paymentInfo = null) => {
    const order = await dispatch(
      createOrder({
        items: items.map((i) => ({
          product: i._id,
          quantity: i.quantity,
        })),
        shippingAddress: address,
      })
    ).unwrap()

    if (paymentInfo) {
      await API.post('/payment/verify', {
        ...paymentInfo,
        orderId: order._id,
      })
    } else {
      await API.post('/payment/test', { orderId: order._id })
    }

    dispatch(clearCart())
    navigate(`/orders/${order._id}`)
  }

  const handleTestPayment = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      setError('Please fill in all shipping address fields')
      return
    }
    setError('')
    setProcessing(true)
    try {
      await placeOrder()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Order failed')
      setProcessing(false)
    }
  }

  const handleRazorpayPayment = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      setError('Please fill in all shipping address fields')
      return
    }
    setError('')
    setProcessing(true)

    try {
      const loaded = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js')
      if (!loaded) {
        throw new Error('Failed to load Razorpay SDK')
      }

      const amount = total > 500 ? total : total + 40
      const { data: paymentOrder } = await API.post('/payment/create', {
        amount,
        currency: 'INR',
      })

      const { data: keyData } = await API.get('/payment/key')

      const options = {
        key: keyData.key,
        amount: paymentOrder.amount,
        currency: 'INR',
        name: 'ShopHub',
        description: 'Order Payment',
        order_id: paymentOrder.id,
        handler: async function (response) {
          await placeOrder({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.')
        setProcessing(false)
      })
      rzp.open()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed')
      setProcessing(false)
    }
  }

  const shippingCost = total > 500 ? 0 : 40
  const grandTotal = total + shippingCost

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      {error && <Message variant="error">{error}</Message>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate flex-1">
                  {item.title} x {item.quantity}
                </span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={processing || orderLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
            >
              {processing || orderLoading ? (
                <Loader />
              ) : (
                `Pay ₹${grandTotal} with Razorpay`
              )}
            </button>
            <button
              onClick={handleTestPayment}
              disabled={processing || orderLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {processing || orderLoading ? (
                <Loader />
              ) : (
                'Place Order (Test Mode - No Payment)'
              )}
            </button>
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-gray-600 text-center">
                Razorpay test credentials (click to expand)
              </summary>
              <div className="mt-2 space-y-1 bg-gray-50 p-3 rounded-lg">
                {TEST_CREDENTIALS.map((c, i) => (
                  <p key={i}>
                    <strong>{c.type}:</strong>{' '}
                    {c.number ? `${c.number} | Exp: ${c.expiry} | CVV: ${c.cvv}` : c.handle}
                    {c.note && <span className="block text-gray-500 ml-0">{c.note}</span>}
                  </p>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
