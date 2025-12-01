import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasks/tasksSlice'
import projectsReducer from '../features/projects/projectsSlice'
import usersReducer from '../features/users/usersSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
