import { useState } from 'react'
import type { Task } from '../features/tasks/tasksSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { updateTask } from '../features/tasks/tasksSlice'

type Props = {
  task: Task
  onClose: () => void
}

export default function TaskModal({ task, onClose }: Props) {
  const dispatch = useAppDispatch()
  const users = useAppSelector((s) => s.users.items)
  const projects = useAppSelector((s) => s.projects.items)
  const [isEditing, setIsEditing] = useState(false)
  const [editedAssignee, setEditedAssignee] = useState(task.assignedTo || '')
  const [editedDescription, setEditedDescription] = useState(task.description || '')

  const creator = task.createdBy ? users.find((u) => u.id === task.createdBy) : null
  const assignee = task.assignedTo ? users.find((u) => u.id === task.assignedTo) : null
  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null

  const handleSave = () => {
    dispatch(
      updateTask({
        id: task.id,
        assignedTo: editedAssignee || undefined,
        description: editedDescription,
      })
    )
    setIsEditing(false)
  }

  const statusColors = {
    todo: { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-700' },
    'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    done: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  }

  const colors = statusColors[task.status]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {project && (
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                ></div>
              )}
              <span className="text-sm font-medium text-gray-600">{project?.name}</span>
            </div>
            <h2 className={`text-2xl font-bold ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <span className={`inline-block px-4 py-2 rounded-full font-medium ${colors.badge}`}>
              {task.status === 'todo' ? '📋 To Do' : task.status === 'in-progress' ? '⏳ In Progress' : '✅ Done'}
            </span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Add task description..."
              />
            ) : (
              <div className={`px-4 py-3 rounded-lg ${task.description ? 'bg-gray-50 text-gray-700' : 'text-gray-400 italic'}`}>
                {task.description || 'No description added'}
              </div>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned To</label>
            {isEditing ? (
              <select
                value={editedAssignee}
                onChange={(e) => setEditedAssignee(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3">
                {assignee ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                      {assignee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{assignee.name}</p>
                      <p className="text-sm text-gray-600">{assignee.email}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 italic">Unassigned</p>
                )}
              </div>
            )}
          </div>

          {/* Creator */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Created By</label>
            <div className="flex items-center gap-3">
              {creator && (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{creator.name}</p>
                    <p className="text-sm text-gray-600">{creator.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Created Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
            <p className="text-gray-600">{new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedAssignee(task.assignedTo || '')
                  setEditedDescription(task.description || '')
                }}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Edit
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
