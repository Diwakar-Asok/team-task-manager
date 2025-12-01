import type { Task } from '../features/tasks/tasksSlice'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { updateTask, removeTask } from '../features/tasks/tasksSlice'

type Props = { task: Task }

export default function TaskCard({ task }: Props) {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((s) => s.projects.items)
  const users = useAppSelector((s) => s.users.items)
  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null
  const creator = task.createdBy ? users.find((u) => u.id === task.createdBy) : null
  const assignee = task.assignedTo ? users.find((u) => u.id === task.assignedTo) : null

  return (
    <div
      className="bg-white rounded-lg p-4 shadow-md border-l-4 hover:shadow-lg transition"
      style={{ borderLeftColor: project?.color || '#3B82F6' }}
    >
      {/* Project Badge */}
      {project && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          ></div>
          <span className="text-xs font-semibold text-gray-600 truncate">{project.name}</span>
        </div>
      )}
      
      {/* Task Title */}
      <div className={`font-semibold text-sm mb-2 ${
        task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
      }`}>
        {task.title}
      </div>
      
      {/* Task Description */}
      {task.description && (
        <div className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</div>
      )}
      
      {/* Status Badge and Creator/Assignee */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
          task.status === 'todo'
            ? 'bg-gray-100 text-gray-700'
            : task.status === 'in-progress'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {task.status === 'todo' ? '📋 To Do' : task.status === 'in-progress' ? '⏳ In Progress' : '✅ Done'}
        </span>
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="flex items-center gap-1 group relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer" title={`Assigned to: ${assignee.name}`}>
                {assignee.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap bottom-full mb-2 right-0">
                {assignee.name}
              </div>
            </div>
          )}
          {creator && (
            <div className="flex items-center gap-1 group relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer" title={`Created by: ${creator.name}`}>
                {creator.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden group-hover:block absolute z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap bottom-full mb-2 -right-6">
                {creator.name}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo'
            dispatch(updateTask({ id: task.id, status: nextStatus }))
          }}
          className="flex-1 text-xs px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-medium transition"
        >
          Next
        </button>
        <button
          onClick={() => dispatch(removeTask(task.id))}
          className="flex-1 text-xs px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
