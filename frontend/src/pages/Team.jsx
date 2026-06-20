import { useEffect, useRef, useState } from 'react'
import API from '../api/client'
import gsap from 'gsap'
import {
  Users,
  Search,
  Shield,
  Code,
  Eye,
  Crown,
  FolderKanban,
} from 'lucide-react'

const roleConfig = {
  Owner: { icon: Crown, color: 'gold', label: 'Owner' },
  Manager: { icon: Shield, color: 'sapphire', label: 'Manager' },
  Developer: { icon: Code, color: 'emerald', label: 'Developer' },
  Viewer: { icon: Eye, color: 'mist-400', label: 'Viewer' },
}

export default function Team() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects')
        setProjects(res.data.projects || res.data || [])
      } catch (err) {
        console.error('Fetch projects error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (loading) return
    gsap.fromTo(
      cardsRef.current.filter(Boolean),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      }
    )
  }, [loading])

  // Build a unified team member list from all projects
  const teamMembers = (() => {
    const memberMap = new Map()

    projects.forEach((project) => {
      // Add owner
      if (project.owner) {
        const ownerId = project.owner._id || project.owner
        if (!memberMap.has(ownerId)) {
          memberMap.set(ownerId, {
            id: ownerId,
            name: project.owner.name || 'Unknown',
            email: project.owner.email || '',
            projects: [],
          })
        }
        memberMap.get(ownerId).projects.push({
          id: project._id,
          name: project.name,
          role: 'Owner',
        })
      }

      // Add members
      project.members?.forEach((m) => {
        const userId = m.user?._id || m._id
        if (!userId) return
        if (!memberMap.has(userId)) {
          memberMap.set(userId, {
            id: userId,
            name: m.user?.name || m.name || 'Unknown',
            email: m.user?.email || m.email || '',
            projects: [],
          })
        }
        // Avoid duplicate project entries
        const existing = memberMap.get(userId)
        if (!existing.projects.find((p) => p.id === project._id)) {
          existing.projects.push({
            id: project._id,
            name: project.name,
            role: m.role || 'Developer',
          })
        }
      })
    })

    return Array.from(memberMap.values())
  })()

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return (
    <div ref={containerRef} className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-mist-50">
          Team
        </h1>
        <p className="mt-1 text-sm text-mist-400 font-light">
          {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} across {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      {teamMembers.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-600" />
          <input
            className="input-field pl-10"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-20">
          <Users size={40} className="text-mist-700 mx-auto mb-4" />
          <p className="text-mist-400 font-heading">
            {searchQuery ? 'No members match your search' : 'No team members yet'}
          </p>
          <p className="text-xs text-mist-500 mt-2">
            Add members to your projects to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member, i) => (
            <div
              key={member.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="glass-card rounded-xl p-6 opacity-0"
            >
              {/* Member info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-heading font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-heading font-semibold text-mist-100 truncate">
                    {member.name}
                  </h3>
                  <p className="text-[10px] text-mist-500 truncate">{member.email}</p>
                </div>
              </div>

              {/* Project assignments */}
              <div className="space-y-2">
                <p className="text-[10px] text-mist-500 uppercase tracking-wider mb-2">
                  Project Roles
                </p>
                {member.projects.map((proj) => {
                  const config = roleConfig[proj.role] || roleConfig.Developer
                  const RoleIcon = config.icon
                  return (
                    <div
                      key={proj.id}
                      className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-mist-800/15"
                    >
                      <FolderKanban size={12} className="text-mist-500 flex-shrink-0" />
                      <span className="text-xs text-mist-300 flex-1 truncate">
                        {proj.name}
                      </span>
                      <span className={`badge badge-${config.color === 'mist-400' ? 'mist' : config.color}`}>
                        <RoleIcon size={9} />
                        {config.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
