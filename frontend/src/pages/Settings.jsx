import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import API from '../api/client'
import { User, Lock, Moon, Sun, Monitor, Save } from 'lucide-react'
import gsap from 'gsap'

export default function Settings() {
  const { user, checkAuth } = useAuth()
  const toast = useToast()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  const containerRef = useRef(null)

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }))
    }
  }, [user])

  useEffect(() => {
    // Animate in
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const payload = { name: formData.name }
      if (formData.password) payload.password = formData.password

      await API.put('/user/profile', payload)
      toast.success('Profile updated successfully')
      
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      checkAuth() // Refresh user context
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme')
    } else {
      document.documentElement.classList.remove('light-theme')
    }
  }

  return (
    <div ref={containerRef} className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-mist-50">
          Settings
        </h1>
        <p className="mt-2 text-sm text-mist-400 font-light">
          Manage your personal profile and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Navigation / Quick links (Static for now) */}
        <div className="hidden lg:block space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-gold/[0.04] text-gold border border-gold/10 font-semibold text-sm transition-all">
            General
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-mist-500 hover:text-mist-200 hover:bg-mist-800/20 font-semibold text-sm transition-all" disabled>
            Notifications (Coming Soon)
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-mist-500 hover:text-mist-200 hover:bg-mist-800/20 font-semibold text-sm transition-all" disabled>
            Security (Coming Soon)
          </button>
        </div>

        {/* Right Col: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

            <h2 className="text-lg font-heading font-semibold text-mist-50 mb-6 flex items-center gap-2">
              <User size={18} className="text-gold" />
              Personal Information
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-600" />
                  <input
                    type="text"
                    className="input-field pl-11"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field opacity-60 cursor-not-allowed"
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-[10px] text-mist-600 mt-1">Email cannot be changed.</p>
              </div>

              <div className="pt-4 mt-4 border-t border-mist-800/30">
                <h3 className="text-sm font-semibold text-mist-200 mb-4 flex items-center gap-2">
                  <Lock size={14} className="text-mist-400" />
                  Change Password
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Leave blank to keep current"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  data-hoverable
                >
                  <span className="flex items-center gap-2">
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Preferences Section */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-heading font-semibold text-mist-50 mb-6 flex items-center gap-2">
              <Monitor size={18} className="text-gold" />
              App Preferences
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-mist-100">Appearance (Theme)</h3>
                <p className="text-xs text-mist-500 mt-1">
                  Switch between the dark luxury aesthetic and a brighter light theme.
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none"
                style={{ backgroundColor: theme === 'dark' ? 'var(--color-mist-800)' : 'var(--color-gold-light)' }}
                data-hoverable
              >
                <span className="sr-only">Toggle Theme</span>
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-1 bg-mist-400' : 'translate-x-7 bg-white'
                  } inline-flex h-6 w-6 transform items-center justify-center rounded-full transition-transform`}
                >
                  {theme === 'dark' ? <Moon size={12} className="text-void" /> : <Sun size={12} className="text-gold" />}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
