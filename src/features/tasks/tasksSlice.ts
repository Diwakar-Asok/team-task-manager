import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  projectId?: string
  createdBy: string
  createdAt: string
  assignedTo?: string // User ID of the person assigned to this task
}

type TasksState = {
  items: Task[]
}

const loadFromLocalStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem('tasks')
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Failed to load tasks from localStorage:', e)
    return []
  }
}

const initialState: TasksState = { 
  items: loadFromLocalStorage()
}

const persistToLocalStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e)
  }
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        state.items.push(action.payload)
        persistToLocalStorage(state.items)
      },
      prepare(title: string, projectId?: string, createdBy?: string, assignedTo?: string, description?: string) {
        const payload = { 
          id: uuidv4(), 
          title, 
          description: description || undefined,
          status: 'todo' as const, 
          projectId, 
          createdBy: createdBy || '', 
          createdAt: new Date().toISOString(),
          assignedTo: assignedTo || undefined
        } as Task
        return { payload }
      },
    },
    updateTask(state, action: PayloadAction<Partial<Task> & { id: string }>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
      persistToLocalStorage(state.items)
    },
    removeTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload)
      persistToLocalStorage(state.items)
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload
      persistToLocalStorage(state.items)
    },
  },
})

export const { addTask, updateTask, removeTask, setTasks } = tasksSlice.actions
export default tasksSlice.reducer
