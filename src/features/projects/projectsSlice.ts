import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  createdAt: string
  createdBy: string
}

type ProjectsState = {
  items: Project[]
}

const loadFromLocalStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem('projects')
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Failed to load projects from localStorage:', e)
    return []
  }
}

const persistToLocalStorage = (projects: Project[]) => {
  try {
    localStorage.setItem('projects', JSON.stringify(projects))
  } catch (e) {
    console.error('Failed to save projects to localStorage:', e)
  }
}

const initialState: ProjectsState = { 
  items: loadFromLocalStorage()
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: {
      reducer(state, action: PayloadAction<Project>) {
        state.items.push(action.payload)
        persistToLocalStorage(state.items)
      },
      prepare(name: string, description?: string, createdBy?: string) {
        const colors = [
          '#3B82F6', // Blue
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#EC4899', // Pink
          '#10B981', // Green
          '#F97316', // Orange
          '#06B6D4', // Cyan
          '#6366F1', // Indigo
        ]
        const payload: Project = {
          id: uuidv4(),
          name,
          description,
          color: colors[Math.floor(Math.random() * colors.length)],
          createdAt: new Date().toISOString(),
          createdBy: createdBy || '',
        }
        return { payload }
      },
    },
    updateProject(state, action: PayloadAction<Partial<Project> & { id: string }>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
      persistToLocalStorage(state.items)
    },
    removeProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload)
      persistToLocalStorage(state.items)
    },
    setProjects(state, action: PayloadAction<Project[]>) {
      state.items = action.payload
      persistToLocalStorage(state.items)
    },
  },
})

export const { addProject, updateProject, removeProject, setProjects } = projectsSlice.actions
export default projectsSlice.reducer
