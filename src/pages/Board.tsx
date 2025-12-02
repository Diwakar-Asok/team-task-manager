import React from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { updateTask } from '../features/tasks/tasksSlice'
import TaskCard from '../components/TaskCard'
import type { Task } from '../features/tasks/tasksSlice'

const columns = ['todo', 'in-progress', 'done'] as const

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

function Column({ status, tasks }: { status: (typeof columns)[number]; tasks: Task[] }) {
  const { setNodeRef, isOver } = useSortable({
    id: status,
    data: { type: 'Column', status },
  })

  const columnTasks = tasks.filter((t) => t.status === status)
  const columnLabel = status === 'todo' ? '📋 To Do' : status === 'in-progress' ? '⏳ In Progress' : '✅ Done'
  const columnColor = status === 'todo' ? 'from-gray-50' : status === 'in-progress' ? 'from-yellow-50' : 'from-green-50'
  const borderColor = status === 'todo' ? 'border-gray-300' : status === 'in-progress' ? 'border-yellow-300' : 'border-green-300'
  const hoverColor = status === 'todo' ? 'hover:border-gray-400' : status === 'in-progress' ? 'hover:border-yellow-400' : 'hover:border-green-400'

  return (
    <div
      ref={setNodeRef}
      className={`bg-gradient-to-b ${columnColor} to-white p-5 rounded-xl border-2 min-h-[500px] transition-all ${
        isOver ? `border-blue-500 bg-blue-50 ring-2 ring-blue-200` : `${borderColor} ${hoverColor}`
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-900">{columnLabel}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{columnTasks.length}</span>
      </div>
      <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {columnTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No tasks here</p>
            </div>
          ) : (
            columnTasks.map((t) => (
              <SortableItem key={t.id} id={t.id}>
                <TaskCard task={t} />
              </SortableItem>
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function Board() {
  const tasks = useAppSelector((s) => s.tasks.items)
  const dispatch = useAppDispatch()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if we're dropping onto a column
    if (columns.includes(overId as any)) {
      const newStatus = overId as (typeof columns)[number]
      dispatch(updateTask({ id: activeId, status: newStatus }))
    } else {
      // Dropping onto a task in a column
      const overData = over.data?.current
      if (overData?.type === 'Column') {
        const newStatus = overData.status as (typeof columns)[number]
        dispatch(updateTask({ id: activeId, status: newStatus }))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Board Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
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

      {/* Kanban Board */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 shadow-sm">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">No tasks yet. Create a project and add tasks to get started!</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((col) => (
                <Column key={col} status={col} tasks={tasks} />
              ))}
            </div>
          </DndContext>
        )}
      </div>
    </div>
  )
}
