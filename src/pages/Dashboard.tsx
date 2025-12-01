import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../stores/hooks'

export default function Dashboard() {
  const projects = useAppSelector((s) => s.projects.items)
  const currentUser = useAppSelector((s) => s.users.items.find((u) => u.id === s.users.currentUserId))
  const tasks = useAppSelector((s) => s.tasks.items)
  const navigate = useNavigate()

  // All users can see all projects
  const visibleProjects = projects

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId)
    const doneCount = projectTasks.filter((t) => t.status === 'done').length
    const inProgressCount = projectTasks.filter((t) => t.status === 'in-progress').length
    
    // Calculate progress: 50% for in-progress, 100% for done
    const progressWeight = doneCount * 100 + inProgressCount * 50
    const totalProgress = projectTasks.length > 0 ? Math.round(progressWeight / projectTasks.length) : 0
    
    return {
      total: projectTasks.length,
      todo: projectTasks.filter((t) => t.status === 'todo').length,
      inProgress: inProgressCount,
      done: doneCount,
      progressPercent: totalProgress,
    }
  }

  const totalTasks = tasks.length
  const totalProjects = visibleProjects.length
  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', count: totalProjects, icon: '📁', color: 'bg-purple-500' },
          { label: 'Total Tasks', count: totalTasks, icon: '✓', color: 'bg-blue-500' },
          { label: 'In Progress', count: inProgressTasks, icon: '⏳', color: 'bg-yellow-500' },
          { label: 'Completed', count: completedTasks, icon: '✅', color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color.replace('bg-', 'text-')}`}>{stat.count}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No projects yet. Create one to get started! 🚀</p>
            <button
              onClick={() => navigate('/projects')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProjects.map((project) => {
              const stats = getProjectStats(project.id)
              return (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{stats.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${stats.progressPercent}%`, backgroundColor: project.color }}
                        ></div>
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600">To Do</p>
                        <p className="font-semibold text-gray-900">{stats.todo}</p>
                      </div>
                      <div className="bg-yellow-50 rounded p-2">
                        <p className="text-xs text-gray-600">In Progress</p>
                        <p className="font-semibold text-yellow-600">{stats.inProgress}</p>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <p className="text-xs text-gray-600">Done</p>
                        <p className="font-semibold text-green-600">{stats.done}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/projects/${project.id}`)
                      }}
                      className="w-full mt-3 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
