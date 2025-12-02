import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { setCurrentUser } from '../features/users/usersSlice'

export default function Login() {
  const users = useAppSelector((s) => s.users.items)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState(users.length > 0 ? users[0].id : '')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!selectedUserId) {
      setError('Please select a user')
      return
    }
    dispatch(setCurrentUser(selectedUserId))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trackify</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">TTM</span>
            </div>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* User Details Preview */}
          {selectedUserId && users.find((u) => u.id === selectedUserId) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              {(() => {
                const user = users.find((u) => u.id === selectedUserId)
                if (!user) return null
                const roleIcons = { admin: '👑', member: '👤' }
                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">{roleIcons[user.role as keyof typeof roleIcons]}</span>
                      <span className="font-medium text-gray-700">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition shadow-lg"
          >
            Sign In
          </button>

          {/* Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Demo Mode:</span> Select any team member to login with their role permissions.
            </p>
          </div>
        </div>

        {/* No Users Message */}
        {users.length === 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700 text-sm">
              No users found. Please add team members first.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
