import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/client'
import gsap from 'gsap'
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg px-4 py-3">
        <p className="text-xs text-mist-400 font-heading">{label}</p>
        <p className="text-sm font-semibold text-gold mt-1">{payload[0].value} tasks</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [projects, setProjects] = useState([])
  const [projectMetrics, setProjectMetrics] = useState({})
  const [loading, setLoading] = useState(true)

  const containerRef = useRef(null)
  const metricCardsRef = useRef([])
  const chartRef = useRef(null)
  const projectsRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, projectsRes] = await Promise.all([
          API.get('/user/dashboard/metrics'),
          API.get('/projects'),
        ])

        const raw = metricsRes.data?.data || {}
        const statusCounts = raw.statusCounts || []
        const overDueCounts = raw.overDueCounts || []

        const getStatusCount = (status) => {
          const found = statusCounts.find((s) => s._id === status)
          return found ? found.count : 0
        }

        const projectsList = projectsRes.data.projects || projectsRes.data || []

        setMetrics({
          totalProjects: projectsList.length,
          activeTasks: getStatusCount('ToDo') + getStatusCount('In-Progress'),
          completedTasks: getStatusCount('Done'),
          overdueTasks: overDueCounts[0]?.count || 0,
          totalTasks: getStatusCount('ToDo') + getStatusCount('In-Progress') + getStatusCount('Done'),
        })
        setProjects(projectsList)

        // Fetch metrics for each project
        const metricsMap = {}
        await Promise.all(
          projectsList.map(async (proj) => {
            try {
              const res = await API.get(`/projects/${proj._id}/metrics`)
              metricsMap[proj._id] = res.data.metrics || res.data
            } catch (err) {
              console.error(`Failed to fetch metrics for project ${proj._id}:`, err)
              metricsMap[proj._id] = null
            }
          })
        )
        setProjectMetrics(metricsMap)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (loading) return

    const tl = gsap.timeline()

    // Stagger metric cards
    tl.fromTo(
      metricCardsRef.current.filter(Boolean),
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      }
    )

    // Chart reveal
    if (chartRef.current) {
      tl.fromTo(
        chartRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )
    }

    // Projects list reveal
    if (projectsRef.current) {
      tl.fromTo(
        projectsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
    }

    return () => tl.kill()
  }, [loading])

  const metricCards = [
    {
      label: 'Total Projects',
      value: metrics?.totalProjects ?? 0,
      icon: FolderKanban,
      iconWrap: 'bg-gold/[0.08] border-gold/15',
      iconColor: 'text-gold',
      gradient: 'from-gold/10 to-gold/[0.02]',
    },
    {
      label: 'Active Tasks',
      value: metrics?.activeTasks ?? metrics?.totalTasks ?? 0,
      icon: ListTodo,
      iconWrap: 'bg-sapphire/[0.08] border-sapphire/15',
      iconColor: 'text-sapphire',
      gradient: 'from-sapphire/10 to-sapphire/[0.02]',
    },
    {
      label: 'Completed',
      value: metrics?.completedTasks ?? 0,
      icon: CheckCircle2,
      iconWrap: 'bg-emerald/[0.08] border-emerald/15',
      iconColor: 'text-emerald',
      gradient: 'from-emerald/10 to-emerald/[0.02]',
    },
    {
      label: 'Overdue',
      value: metrics?.overdueTasks ?? 0,
      icon: AlertTriangle,
      iconWrap: 'bg-rose/[0.08] border-rose/15',
      iconColor: 'text-rose',
      gradient: 'from-rose/10 to-rose/[0.02]',
    },
  ]

  // Generate mock chart data based on actual metrics or provide defaults
  const chartData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const total = metrics?.completedTasks ?? 7
    return days.map((day, i) => ({
      day,
      tasks: Math.max(1, Math.round(total / 7 + Math.sin(i) * 2)),
    }))
  })()

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 shimmer rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 shimmer rounded-xl" />
          ))}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-gold font-heading mb-2">
          {dateStr}
        </p>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-mist-50">
          {greeting}, <span className="text-gradient-gold">{user?.name?.split(' ')[0] || 'there'}</span>
        </h1>
        <p className="mt-1 text-sm text-mist-400 font-light">
          Here's what's happening across your projects.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metricCards.map((card, i) => (
          <div
            key={i}
            ref={(el) => (metricCardsRef.current[i] = el)}
            className={`glass-card rounded-xl p-6 bg-gradient-to-br ${card.gradient} opacity-0`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${card.iconWrap}`}>
                <card.icon size={18} className={card.iconColor} />
              </div>
              <TrendingUp size={14} className="text-mist-600" />
            </div>
            <p className="text-2xl font-heading font-bold text-mist-50">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-mist-400 tracking-wide uppercase font-heading">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div ref={chartRef} className="lg:col-span-2 glass-card rounded-xl p-6 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-heading font-semibold text-mist-100">
                Weekly Activity
              </h3>
              <p className="text-xs text-mist-500 mt-1">Task completions this week</p>
            </div>
            <Clock size={16} className="text-mist-600" />
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a55c" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c9a55c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#c9a55c"
                strokeWidth={2}
                fill="url(#goldGradient)"
                dot={{ r: 3, fill: '#c9a55c', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#e8c472', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Projects */}
        <div ref={projectsRef} className="glass-card rounded-xl p-6 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-heading font-semibold text-mist-100">
              Recent Projects
            </h3>
            <Link
              to="/projects"
              className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1"
              data-hoverable
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderKanban size={24} className="text-mist-700 mx-auto mb-3" />
                <p className="text-sm text-mist-500">No projects yet</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 mt-3 text-xs text-gold hover:text-gold-light transition-colors"
                  data-hoverable
                >
                  <Plus size={12} />
                  Create your first project
                </Link>
              </div>
            ) : (
              projects.slice(0, 5).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-3 rounded-lg hover:bg-mist-800/20 transition-colors duration-300 group"
                  data-hoverable
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-gold/[0.06] border border-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-xs font-semibold">
                        {project.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-mist-100 truncate group-hover:text-gold-light transition-colors">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-mist-500 mt-0.5">
                        {project.members?.length || 0} members
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-mist-700 group-hover:text-gold transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Quick Create */}
          <div className="mt-4 pt-4 border-t border-mist-800/30">
            <Link
              to="/projects"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-mist-700 hover:border-gold/30 text-mist-500 hover:text-gold text-xs transition-all duration-300"
              data-hoverable
            >
              <Plus size={14} />
              <span className="font-heading tracking-wide">New Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Project Metrics Section */}
      {projects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-heading font-semibold text-mist-100 mb-4">Project Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const metrics = projectMetrics[project._id]
              return (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="glass-card rounded-xl p-5 hover:border-gold/30 transition-all duration-300"
                  data-hoverable
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-heading font-semibold text-mist-100 truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-mist-500 mt-1">{project.members?.length || 0} members</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gold/[0.08] border border-gold/15 flex items-center justify-center flex-shrink-0">
                      <FolderKanban size={14} className="text-gold" />
                    </div>
                  </div>
                  
                  {metrics ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-mist-400">Tasks:</span>
                        <span className="text-mist-100 font-semibold">{metrics.totalTasks || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-mist-400">Completed:</span>
                        <span className="text-emerald font-semibold">{metrics.completedTasks || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-mist-400">In Progress:</span>
                        <span className="text-sapphire font-semibold">{metrics.inProgressTasks || 0}</span>
                      </div>
                      {(metrics.overdueTasks || 0) > 0 && (
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-mist-800/30">
                          <span className="text-rose">Overdue:</span>
                          <span className="text-rose font-semibold">{metrics.overdueTasks}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-mist-500">Loading metrics...</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
