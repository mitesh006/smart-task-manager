import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/team', icon: Users, label: 'Team' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-obsidian border-r border-mist-800 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        expanded ? 'w-56' : 'w-[72px]'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-mist-800/30">
        <div className="w-8 h-8 rounded-sm border border-gold/40 flex items-center justify-center flex-shrink-0">
          <span className="text-gold font-heading font-bold text-sm">T</span>
        </div>
        <span
          className={`ml-3 font-heading font-semibold text-sm tracking-[0.15em] text-mist-100 transition-all duration-500 ${
            expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
        >
          TASKFLOW
        </span>
      </div>

      {/* User avatar area */}
      <div className="px-4 py-5 border-b border-mist-800/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold-dim/20 flex items-center justify-center flex-shrink-0 border border-gold/20">
            <span className="text-gold text-xs font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            }`}
          >
            <p className="text-sm font-medium text-mist-100 truncate max-w-[120px]">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-mist-500 truncate max-w-[120px]">
              {user?.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-400 relative ${
              isActive(path)
                ? 'text-gold bg-gold/[0.06]'
                : 'text-mist-500 hover:text-mist-200 hover:bg-mist-800/20'
            }`}
            data-hoverable
          >
            {/* Active indicator */}
            {isActive(path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-gold rounded-r-full" />
            )}

            <Icon size={18} className="flex-shrink-0" />
            <span
              className={`text-sm font-light tracking-wide transition-all duration-500 whitespace-nowrap ${
                expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Collapse toggle + Logout */}
      <div className="px-3 py-4 border-t border-mist-800/30 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-mist-500 hover:text-rose hover:bg-rose/[0.06] transition-all duration-400"
          data-hoverable
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span
            className={`text-sm font-light tracking-wide transition-all duration-500 whitespace-nowrap ${
              expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            Logout
          </span>
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-mist-600 hover:text-mist-300 transition-colors duration-300"
          data-hoverable
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  )
}
