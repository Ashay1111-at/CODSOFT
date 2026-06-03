export default function Message({ variant = 'info', children }) {
  const colors = {
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <div className={`border px-4 py-3 rounded-lg ${colors[variant] || colors.info}`}>
      {children}
    </div>
  )
}
