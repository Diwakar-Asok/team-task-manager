import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from './stores/hooks'
import { setCurrentUser } from './features/users/usersSlice'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Board from './pages/Board'
import Team from './pages/Team'
import Login from './pages/Login'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((s) => s.users.currentUserId)
  const currentUser = useAppSelector((s) => s.users.items.find((u) => u.id === currentUserId))

  // Redirect to login if not authenticated
  if (!currentUserId) {
    return <Navigate to="/login" replace />
  }

  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentPage('dashboard')
    } else if (location.pathname.startsWith('/projects')) {
      setCurrentPage('projects')
    } else if (location.pathname === '/board') {
      setCurrentPage('board')
    } else if (location.pathname === '/team') {
      setCurrentPage('team')
    }
  }, [location.pathname])

  const handleLogout = () => {
    dispatch(setCurrentUser(''))
    setShowUserMenu(false)
    navigate('/login')
  }

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/', roles: ['admin', 'member'] },
    { id: 'projects', icon: '📁', label: 'Projects', path: '/projects', roles: ['admin', 'member'] },
    { id: 'board', icon: '🗂️', label: 'Board', path: '/board', roles: ['admin', 'member'] },
    { id: 'team', icon: '👥', label: 'Team', path: '/team', roles: ['admin'] }, // Only admins can manage team
  ]

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) => item.roles.includes(currentUser?.role || 'member'))

  const roleColors = {
    admin: 'from-purple-600 to-purple-700',
    member: 'from-blue-600 to-blue-700',
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 shadow-lg`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">TTM</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-700 rounded">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="mt-8 space-y-2 px-2">
          {visibleNavItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                currentPage === item.id ? 'bg-blue-600' : 'hover:bg-slate-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Task Manager</h2>
              <p className="text-sm text-gray-500">Manage projects and tasks efficiently</p>
            </div>
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`bg-gradient-to-br ${roleColors[currentUser?.role || 'member']} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-pointer shadow-lg hover:shadow-xl transition`}
              >
                {currentUser?.name.charAt(0).toUpperCase()}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{currentUser?.name}</p>
                    <p className="text-sm text-gray-600">{currentUser?.email}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                        {currentUser?.role === 'admin' ? '👑 Admin' : '👤 Member'}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/board" element={<React.Suspense fallback={<div>Loading...</div>}><Board /></React.Suspense>} />
            <Route path="/team" element={currentUser?.role === 'admin' ? <Team /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
