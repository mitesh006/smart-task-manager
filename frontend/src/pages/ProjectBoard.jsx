import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/client'
import { useToast } from '../components/Toast'
import gsap from 'gsap'
import {
  Plus,
  X,
  FolderKanban,
  MoreVertical,
  Edit3,
  Trash2,
  UserPlus,
  ArrowLeft,
  Calendar,
  Flag,
  Users,
  CheckCircle2,
  Clock,
  ListTodo,
  ChevronDown,
  Search,
  UserMinus,
} from 'lucide-react'

/* ═══════════════════════════════════════════
   MODAL COMPONENT
   ═══════════════════════════════════════════ */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-mist-50">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-mist-500 hover:text-mist-200 hover:bg-mist-800/30 transition-colors"
            data-hoverable
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   TASK CARD
   ═══════════════════════════════════════════ */
function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const priorityClass = {
    High: 'badge-rose',
    Medium: 'badge-gold',
    Low: 'badge-emerald',
  }

  return (
    <div
      className="glass-card rounded-lg p-4 group relative cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task._id)
        e.dataTransfer.effectAllowed = 'move'
        e.currentTarget.classList.add('dragging-card')
        onDragStart?.(task._id)
      }}
      onDragEnd={(e) => {
        e.currentTarget.classList.remove('dragging-card')
        onDragEnd?.()
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium text-mist-100 leading-snug flex-1">
          {task.title}
        </h4>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-6 h-6 rounded flex items-center justify-center text-mist-600 hover:text-mist-300 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-32 glass-strong rounded-lg py-1 z-30 animate-fade-in-down">
              <button
                onClick={() => { onEdit(task); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-mist-300 hover:text-mist-100 hover:bg-mist-800/20 transition-colors"
              >
                <Edit3 size={12} /> Edit
              </button>
              <button
                onClick={() => { onDelete(task._id); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose hover:bg-rose/[0.06] transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-mist-500 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`badge ${priorityClass[task.priority] || 'badge-mist'}`}>
          <Flag size={10} />
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="badge badge-mist">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {task.assignedTo && (
        <div className="mt-3 pt-3 border-t border-mist-800/30 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center">
            <span className="text-[8px] text-gold font-semibold">
              {task.assignedTo?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="text-[10px] text-mist-500">{task.assignedTo?.name || 'Assigned'}</span>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   KANBAN COLUMN
   ═══════════════════════════════════════════ */
function KanbanColumn({ title, icon, tasks, count, accentColor, status, onEdit, onDelete, onDrop, onDragStart, onDragEnd }) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      onDrop?.(taskId, status)
    }
  }

  return (
    <div
      className={`flex-1 min-w-[280px] kanban-drop-zone ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className={`text-${accentColor}`}>{icon}</span>
        <h3 className="text-sm font-heading font-semibold text-mist-200 tracking-wide uppercase">
          {title}
        </h3>
        <span className="ml-auto text-xs text-mist-600 bg-mist-800/30 rounded-full px-2 py-0.5">
          {count}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        {tasks.length === 0 && (
          <div className={`text-center py-8 rounded-lg border border-dashed transition-colors duration-300 ${dragOver ? 'border-gold/30 bg-gold/[0.03]' : 'border-mist-800/30'}`}>
            <p className="text-xs text-mist-600">{dragOver ? 'Drop here' : 'No tasks'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PROJECT CARD
   ═══════════════════════════════════════════ */
function ProjectCard({ project, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Link
      to={`/projects/${project._id}`}
      className="glass-card rounded-xl p-6 group block relative"
      data-hoverable
    >
      {/* Menu */}
      <div className="absolute top-4 right-4" onClick={(e) => e.preventDefault()}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-mist-600 hover:text-mist-300 opacity-0 group-hover:opacity-100 transition-all"
          data-hoverable
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 w-36 glass-strong rounded-lg py-1 z-30 animate-fade-in-down">
            <button
              onClick={() => { onDelete(project._id); setMenuOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose hover:bg-rose/[0.06] transition-colors"
              data-hoverable
            >
              <Trash2 size={12} /> Delete Project
            </button>
          </div>
        )}
      </div>

      {/* Project icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/10 to-gold/[0.02] border border-gold/10 flex items-center justify-center mb-5 group-hover:border-gold/25 transition-all duration-500">
        <span className="text-gold font-heading font-bold">
          {project.name?.charAt(0)?.toUpperCase()}
        </span>
      </div>

      <h3 className="text-base font-heading font-semibold text-mist-100 mb-2 group-hover:text-gold-light transition-colors duration-400">
        {project.name}
      </h3>

      {project.description && (
        <p className="text-xs text-mist-500 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-3 text-[10px] text-mist-500 uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <Users size={11} />
          {project.members?.length || 0} members
        </span>
        <span>•</span>
        <span>
          {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════
   MAIN PROJECT BOARD
   ═══════════════════════════════════════════ */
export default function ProjectBoard() {
  const { projectID } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  // ── State ──
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showEditTask, setShowEditTask] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Form states
  const [projectForm, setProjectForm] = useState({ name: '', description: '' })
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'ToDo',
    dueDate: '',
    assignedTo: '',
  })
  const [memberEmail, setMemberEmail] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const containerRef = useRef(null)
  const cardsRef = useRef([])

  // ── Fetch data ──
  const fetchProjects = useCallback(async () => {
    try {
      const res = await API.get('/projects')
      setProjects(res.data.projects || res.data || [])
    } catch (err) {
      console.error('Fetch projects error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProject = useCallback(async () => {
    try {
      const res = await API.get(`/projects/${projectID}`)
      const proj = res.data.project || res.data
      setProject(proj)
      setTasks(res.data.tasks || [])
    } catch (err) {
      console.error('Fetch project error:', err)
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }, [projectID, navigate])

  useEffect(() => {
    setLoading(true)
    if (projectID) {
      fetchProject()
    } else {
      fetchProjects()
    }
  }, [projectID, fetchProject, fetchProjects])

  // ── Animate cards ──
  useEffect(() => {
    if (loading || projectID) return
    gsap.fromTo(
      cardsRef.current.filter(Boolean),
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      }
    )
  }, [loading, projectID, projects])

  // ── Handlers ──
  const handleCreateProject = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      await API.post('/projects', projectForm)
      setProjectForm({ name: '', description: '' })
      setShowCreateProject(false)
      toast.success('Project created successfully')
      fetchProjects()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project? This action cannot be undone.')) return
    try {
      await API.delete(`/projects/${id}`)
      toast.success('Project deleted successfully')
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project')
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      const payload = { ...taskForm, project: projectID }
      if (!payload.assignedTo) delete payload.assignedTo
      if (!payload.dueDate) delete payload.dueDate
      await API.post('/tasks', payload)
      setTaskForm({ title: '', description: '', priority: 'Medium', status: 'ToDo', dueDate: '', assignedTo: '' })
      setShowCreateTask(false)
      toast.success('Task created successfully')
      fetchProject()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditTask = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      const payload = { ...taskForm }
      if (!payload.assignedTo) delete payload.assignedTo
      if (!payload.dueDate) delete payload.dueDate
      await API.put(`/tasks/${editingTask._id}`, payload)
      setShowEditTask(false)
      setEditingTask(null)
      toast.success('Task updated successfully')
      fetchProject()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update task')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      toast.success('Task deleted')
      fetchProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const openEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
    })
    setFormError('')
    setShowEditTask(true)
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)
    try {
      const res = await API.post(`/projects/${projectID}/members`, { email: memberEmail })
      setMemberEmail('')
      setShowAddMember(false)
      toast.success(res.data?.message || 'Member added successfully')
      fetchProject()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add member')
    } finally {
      setFormLoading(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      const res = await API.delete(`/projects/${projectID}/members`, { data: { targetUserId: userId } })
      toast.success(res.data?.message || 'Member removed successfully')
      fetchProject()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member')
    }
  }

  // ── Drag & Drop handler ──
  const handleTaskDrop = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    )

    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus })
      toast.success(`Task moved to ${newStatus === 'ToDo' ? 'To Do' : newStatus === 'In-Progress' ? 'In Progress' : 'Done'}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task status')
      fetchProject() // Revert on error
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 shimmer rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 shimmer rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // ── Task form fields (shared between create & edit) ──
  const renderTaskForm = (onSubmit, submitLabel) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 rounded-lg bg-rose/[0.06] border border-rose/20 text-rose text-sm">
          {formError}
        </div>
      )}
      <div>
        <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">Title</label>
        <input
          className="input-field"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          placeholder="Task title"
          required
        />
      </div>
      <div>
        <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">Description</label>
        <textarea
          className="input-field resize-none h-20"
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          placeholder="Optional description"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">Priority</label>
          <select
            className="input-field"
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">Status</label>
          <select
            className="input-field"
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
          >
            <option value="ToDo">To Do</option>
            <option value="In-Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">Due Date</label>
        <input
          type="date"
          className="input-field"
          value={taskForm.dueDate}
          onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
        />
      </div>
      {project?.members?.length > 0 && (
        <div>
          <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">Assign To</label>
          <select
            className="input-field"
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
          >
            <option value="">Unassigned</option>
            {project.members.map((m) => (
              <option key={m.user?._id || m._id} value={m.user?._id || m._id}>
                {m.user?.name || m.name || 'Member'}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        disabled={formLoading}
        className="btn-primary w-full disabled:opacity-50"
        data-hoverable
      >
        <span>{formLoading ? 'Saving...' : submitLabel}</span>
      </button>
    </form>
  )

  /* ═══════════════════════════════════════════
     SINGLE PROJECT VIEW
     ═══════════════════════════════════════════ */
  if (projectID && project) {
    const todoTasks = tasks.filter((t) => t.status === 'ToDo')
    const inProgressTasks = tasks.filter((t) => t.status === 'In-Progress')
    const doneTasks = tasks.filter((t) => t.status === 'Done')

    return (
      <div ref={containerRef} className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/projects"
              className="w-9 h-9 rounded-lg border border-mist-800 flex items-center justify-center text-mist-500 hover:text-mist-200 hover:border-mist-600 transition-all"
              data-hoverable
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-mist-50">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-xs text-mist-400 mt-1">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddMember(true)}
              className="btn-ghost btn-sm"
              data-hoverable
            >
              <span className="flex items-center gap-2">
                <UserPlus size={14} />
                Add Member
              </span>
            </button>
            <button
              onClick={() => {
                setTaskForm({ title: '', description: '', priority: 'Medium', status: 'ToDo', dueDate: '', assignedTo: '' })
                setFormError('')
                setShowCreateTask(true)
              }}
              className="btn-primary btn-sm"
              data-hoverable
            >
              <span className="flex items-center gap-2">
                <Plus size={14} />
                Add Task
              </span>
            </button>
          </div>
        </div>

        {/* Members strip */}
        {project.members?.length > 0 && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-mist-500 uppercase tracking-wider mr-2">Team:</span>
            {project.members.map((m) => (
              <div key={m.user?._id || m._id} className="group relative flex items-center gap-1.5 px-2 py-1 rounded-full bg-mist-800/20 border border-mist-800/30">
                <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center">
                  <span className="text-[8px] text-gold font-semibold">
                    {(m.user?.name || m.name || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-mist-300">{m.user?.name || m.name}</span>
                <span className="text-[8px] text-mist-600">• {m.role}</span>
                <button
                  onClick={() => handleRemoveMember(m.user?._id || m._id)}
                  className="opacity-0 group-hover:opacity-100 ml-1 text-mist-600 hover:text-rose transition-all"
                  data-hoverable
                >
                  <UserMinus size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          <KanbanColumn
            title="To Do"
            icon={<ListTodo size={14} />}
            tasks={todoTasks}
            count={todoTasks.length}
            accentColor="mist-400"
            status="ToDo"
            onEdit={openEditTask}
            onDelete={handleDeleteTask}
            onDrop={handleTaskDrop}
          />
          <KanbanColumn
            title="In Progress"
            icon={<Clock size={14} />}
            tasks={inProgressTasks}
            count={inProgressTasks.length}
            accentColor="gold"
            status="In-Progress"
            onEdit={openEditTask}
            onDelete={handleDeleteTask}
            onDrop={handleTaskDrop}
          />
          <KanbanColumn
            title="Done"
            icon={<CheckCircle2 size={14} />}
            tasks={doneTasks}
            count={doneTasks.length}
            accentColor="emerald"
            status="Done"
            onEdit={openEditTask}
            onDelete={handleDeleteTask}
            onDrop={handleTaskDrop}
          />
        </div>

        {/* Create Task Modal */}
        <Modal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} title="Create Task">
          {renderTaskForm(handleCreateTask, "Create Task")}
        </Modal>

        {/* Edit Task Modal */}
        <Modal isOpen={showEditTask} onClose={() => { setShowEditTask(false); setEditingTask(null) }} title="Edit Task">
          {renderTaskForm(handleEditTask, "Save Changes")}
        </Modal>

        {/* Add Member Modal */}
        <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Team Member">
          <form onSubmit={handleAddMember} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-rose/[0.06] border border-rose/20 text-rose text-sm">
                {formError}
              </div>
            )}
            <div>
              <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">
                Member Email
              </label>
              <input
                className="input-field"
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="btn-primary w-full disabled:opacity-50"
              data-hoverable
            >
              <span>{formLoading ? 'Adding...' : 'Add Member'}</span>
            </button>
          </form>
        </Modal>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     PROJECTS LIST VIEW
     ═══════════════════════════════════════════ */
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div ref={containerRef} className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-mist-50">
            Projects
          </h1>
          <p className="mt-1 text-sm text-mist-400 font-light">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        <button
          onClick={() => {
            setProjectForm({ name: '', description: '' })
            setFormError('')
            setShowCreateProject(true)
          }}
          className="btn-primary btn-sm"
          data-hoverable
        >
          <span className="flex items-center gap-2">
            <Plus size={14} />
            New Project
          </span>
        </button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-600" />
          <input
            className="input-field pl-10"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban size={40} className="text-mist-700 mx-auto mb-4" />
          <p className="text-mist-400 font-heading">
            {searchQuery ? 'No projects match your search' : 'No projects yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => {
                setProjectForm({ name: '', description: '' })
                setFormError('')
                setShowCreateProject(true)
              }}
              className="btn-primary btn-sm mt-4"
              data-hoverable
            >
              <span className="flex items-center gap-2">
                <Plus size={14} />
                Create Your First Project
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj, i) => (
            <div key={proj._id} ref={(el) => (cardsRef.current[i] = el)} className="opacity-0">
              <ProjectCard project={proj} onDelete={handleDeleteProject} />
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={showCreateProject} onClose={() => setShowCreateProject(false)} title="Create Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-rose/[0.06] border border-rose/20 text-rose text-sm">
              {formError}
            </div>
          )}
          <div>
            <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">
              Project Name
            </label>
            <input
              className="input-field"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              placeholder="My Awesome Project"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-mist-400 tracking-wide uppercase mb-1.5 font-heading">
              Description
            </label>
            <textarea
              className="input-field resize-none h-24"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Brief project description"
            />
          </div>
          <button
            type="submit"
            disabled={formLoading}
            className="btn-primary w-full disabled:opacity-50"
            data-hoverable
          >
            <span>{formLoading ? 'Creating...' : 'Create Project'}</span>
          </button>
        </form>
      </Modal>
    </div>
  )
}
