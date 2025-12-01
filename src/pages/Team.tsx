import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { addUser, removeUser, updateUser } from '../features/users/usersSlice'

const roleColors: Record<string, { bg: string; text: string; badge: string }> = {
  admin: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100' },
  member: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' },
}

export default function Team() {
  const users = useAppSelector((s) => s.users.items)
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'member'>('member')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'all'>('all')

  const onAdd = () => {
    if (!name.trim() || !email.trim()) return
    dispatch(addUser(name.trim(), email.trim(), role))
    setName('')
    setEmail('')
    setRole('member')
  }

  const filteredUsers = selectedRole === 'all' ? users : users.filter((u) => u.role === selectedRole)

  const roleLabels = {
    admin: '👑 Admin',
    member: '👤 Member',
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full access, can manage projects and team'
      case 'member':
        return 'Can create and manage tasks'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Team Member Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Team Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Member name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition"
            onClick={onAdd}
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Team Members ({users.length})</h2>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 mb-4">
          {(['all', 'admin', 'member'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSelectedRole(f)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedRole === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f === 'admin' ? '👑 Admin' : '👤 Members'}
            </button>
          ))}
        </div>

        {/* Members Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">
              {selectedRole === 'all' ? 'No team members yet.' : `No ${selectedRole}s in the team.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const colors = roleColors[user.role]
              return (
                <div
                  key={user.id}
                  className={`${colors.bg} border border-gray-200 rounded-lg p-5 hover:shadow-md transition`}
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} ${colors.text}`}>
                      {roleLabels[user.role as keyof typeof roleLabels]}
                    </span>
                  </div>

                  {/* Role Description */}
                  <p className="text-xs text-gray-600 mb-4">{getRoleDescription(user.role)}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {user.id !== 'default-user' && (
                      <>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            dispatch(updateUser({ id: user.id, role: e.target.value as 'admin' | 'member' }))
                          }
                          className="flex-1 text-xs px-2 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                        </select>
                        <button
                          onClick={() => dispatch(removeUser(user.id))}
                          className="flex-1 text-xs px-2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium transition"
                        >
                          Remove
                        </button>
                      </>
                    )}
                    {user.id === 'default-user' && (
                      <div className="flex-1 text-xs px-2 py-2 bg-green-100 text-green-700 rounded font-medium text-center">
                        ✓ Current User
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['admin', 'member'].map((role) => (
            <div key={role} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className={`font-semibold ${roleColors[role].text} mb-2`}>{roleLabels[role as keyof typeof roleLabels]}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {role === 'admin' && (
                  <>
                    <li>✓ Create projects</li>
                    <li>✓ Manage tasks</li>
                    <li>✓ Manage team</li>
                    <li>✓ Delete projects</li>
                  </>
                )}
                {role === 'member' && (
                  <>
                    <li>✓ Create tasks</li>
                    <li>✓ Update tasks</li>
                    <li>✓ View projects</li>
                    <li>✗ Delete projects</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
