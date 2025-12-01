import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { addProject, removeProject } from '../features/projects/projectsSlice'

export default function Projects() {
  const projects = useAppSelector((s) => s.projects.items)
  const currentUser = useAppSelector((s) => s.users.items.find((u) => u.id === s.users.currentUserId))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const canCreate = currentUser?.role === 'admin'
  const canDelete = currentUser?.role === 'admin'

  // All users can see all projects
  const visibleProjects = projects

  const onAdd = () => {
    if (!name.trim()) return
    dispatch(addProject(name.trim(), description.trim(), currentUser?.id))
    setName('')
    setDescription('')
  }

  return (
    <div className="space-y-6">
      {/* Add Project Card */}
      {canCreate && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Project</h3>
          <div className="space-y-3">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project description (optional)"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition"
              onClick={onAdd}
            >
              + Create Project
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Projects ({visibleProjects.length})</h2>
        {visibleProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No projects yet. {canCreate ? 'Create one to organize your tasks! 📁' : 'Wait for admin to create projects. 📁'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProjects.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="h-3" style={{ backgroundColor: p.color }} />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 hover:text-blue-600">{p.name}</h4>
                  {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/projects/${p.id}`)
                      }}
                      className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition"
                    >
                      View
                    </button>
                    {canDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(removeProject(p.id))
                        }}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
