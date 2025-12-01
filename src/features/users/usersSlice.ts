import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'member'
}

type UsersState = {
  items: User[]
  currentUserId?: string
}

const loadFromLocalStorage = (): User[] => {
  try {
    const stored = localStorage.getItem('users')
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Failed to load users from localStorage:', e)
    return []
  }
}

const loadCurrentUserIdFromLocalStorage = (): string | undefined => {
  try {
    const stored = localStorage.getItem('currentUserId')
    return stored ? JSON.parse(stored) : undefined
  } catch (e) {
    console.error('Failed to load currentUserId from localStorage:', e)
    return undefined
  }
}

const persistToLocalStorage = (users: User[]) => {
  try {
    localStorage.setItem('users', JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save users to localStorage:', e)
  }
}

const persistCurrentUserIdToLocalStorage = (userId: string) => {
  try {
    localStorage.setItem('currentUserId', JSON.stringify(userId))
  } catch (e) {
    console.error('Failed to save currentUserId to localStorage:', e)
  }
}

const initialState: UsersState = {
  items: loadFromLocalStorage().length > 0 ? loadFromLocalStorage() : [
    {
      id: 'default-user',
      name: 'You',
      email: 'user@example.com',
      role: 'admin',
    },
  ],
  currentUserId: loadCurrentUserIdFromLocalStorage(),
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: {
      reducer(state, action: PayloadAction<User>) {
        state.items.push(action.payload)
        persistToLocalStorage(state.items)
      },
      prepare(name: string, email: string, role: 'admin' | 'member' = 'member') {
        const payload: User = { id: uuidv4(), name, email, role }
        return { payload }
      },
    },
    updateUser(state, action: PayloadAction<Partial<User> & { id: string }>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload }
      persistToLocalStorage(state.items)
    },
    removeUser(state, action: PayloadAction<string>) {
      state.items = state.items.filter((u) => u.id !== action.payload)
      persistToLocalStorage(state.items)
    },
    setCurrentUser(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload
      persistCurrentUserIdToLocalStorage(action.payload)
    },
  },
})

export const { addUser, updateUser, removeUser, setCurrentUser } = usersSlice.actions
export default usersSlice.reducer
