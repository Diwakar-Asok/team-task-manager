import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { addTask, removeTask, updateTask } from '../features/tasks/tasksSlice'
import { removeProject } from '../features/projects/projectsSlice'
import TaskModal from '../components/TaskModal'
import type { Task } from '../features/tasks/tasksSlice'

const statusColors = {
  todo: { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-200' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-200' },
  done: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-200' },
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const projects = useAppSelector((s) => s.projects.items)
  const tasks = useAppSelector((s) => s.tasks.items)
  const users = useAppSelector((s) => s.users.items)
  const currentUser = useAppSelector((s) => s.users.items.find((u) => u.id === s.users.currentUserId))
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const project = projects.find((p) => p.id === projectId)
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  const filteredTasks = showMyTasksOnly 
    ? projectTasks.filter((t) => t.assignedTo === currentUser?.id)
    : projectTasks
  const todoCount = projectTasks.filter((t) => t.status === 'todo').length
  const inProgressCount = projectTasks.filter((t) => t.status === 'in-progress').length
  const doneCount = projectTasks.filter((t) => t.status === 'done').length

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Project not found</p>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return
    dispatch(addTask(newTaskTitle.trim(), projectId, currentUser?.id, assignedTo || undefined, newTaskDescription.trim() || undefined))
    setNewTaskTitle('')
    setNewTaskDescription('')
    setAssignedTo('')
  }

  function handleDeleteProject() {
    dispatch(removeProject(projectId!))
    navigate('/projects')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 overflow-hidden">
        <div
          className="h-1 mb-4 rounded-full"
          style={{ backgroundColor: project.color }}
        ></div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: project.color }}
              ></div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            </div>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Project?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{project.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', count: projectTasks.length, color: 'bg-blue-500' },
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
        <div className="space-y-3">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task description (optional)"
            rows={2}
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Assign to...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            <button
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg transition shadow-sm"
              onClick={handleAddTask}
            >
              + Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Filter Button */}
        <button
          onClick={() => setShowMyTasksOnly(!showMyTasksOnly)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            showMyTasksOnly
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {showMyTasksOnly ? '✓ My Tasks' : 'All Tasks'}
        </button>

        {projectTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No tasks assigned to you.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((t) => {
            const colors = statusColors[t.status as keyof typeof statusColors]
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`${colors.bg} border-l-4 ${
                  t.status === 'todo'
                    ? 'border-l-gray-400'
                    : t.status === 'in-progress'
                      ? 'border-l-blue-500'
                      : 'border-l-green-500'
                } bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${t.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {t.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} ${colors.text}`}>
                        {t.status === 'todo' ? '📋 To Do' : t.status === 'in-progress' ? '⏳ In Progress' : '✅ Done'}
                      </span>
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
            })}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  )
}
