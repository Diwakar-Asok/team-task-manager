import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { addTask, removeTask, updateTask } from './tasksSlice'

const statusColors = {
  todo: { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-200' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-200' },
  done: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-200' },
}

export default function TaskList() {
  const tasks = useAppSelector((s) => s.tasks.items)
  const projects = useAppSelector((s) => s.projects.items)
  const currentUser = useAppSelector((s) => s.users.items.find((u) => u.id === s.users.currentUserId))
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')

  function onAdd() {
    if (!title.trim()) return
    dispatch(addTask(title.trim(), selectedProjectId || undefined, currentUser?.id))
    setTitle('')
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)
  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', count: tasks.length, color: 'bg-blue-500' },
          { label: 'To Do', count: todoCount, color: 'bg-gray-500' },
          { label: 'In Progress', count: inProgressCount, color: 'bg-yellow-500' },
          { label: 'Completed', count: doneCount, color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color.replace('bg-', 'text-')}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Add Task Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAdd()}
          />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition shadow-sm"
            onClick={onAdd}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'todo', 'in-progress', 'done'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No tasks yet. Create one to get started! 🚀</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const colors = statusColors[t.status as keyof typeof statusColors]
            const project = t.projectId ? projects.find((p) => p.id === t.projectId) : null
            return (
              <div
                key={t.id}
                className={`${colors.bg} border-l-4 ${
                  t.status === 'todo'
                    ? 'border-l-gray-400'
                    : t.status === 'in-progress'
                      ? 'border-l-blue-500'
                      : 'border-l-green-500'
                } bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${t.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {t.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} ${colors.text}`}>
                        {t.status === 'todo' ? '📋 To Do' : t.status === 'in-progress' ? '⏳ In Progress' : '✅ Done'}
                      </span>
                      {project && (
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: project.color }}
                        >
                          🗂️ {project.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        const nextStatus =
                          t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'done' : 'todo'
                        dispatch(updateTask({ id: t.id, status: nextStatus }))
                      }}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition text-sm font-medium"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => dispatch(removeTask(t.id))}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
