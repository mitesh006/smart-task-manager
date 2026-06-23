import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import gsap from 'gsap'
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import prismGridIconLogo from '/favicon-prismgrid.svg'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, user } = useAuth()
  const navigate = useNavigate()

  const containerRef = useRef(null)
  const formRef = useRef(null)
  const visualRef = useRef(null)

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(
      visualRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    ).fromTo(
      formRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      '-=0.7'
    )

    return () => tl.kill()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (!result.success) {
      setError(result.message)
      setLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen flex bg-void">
      {/* Left Visual Panel */}
      <div
        ref={visualRef}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden opacity-0"
      >
        {/* Background layers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, var(--color-obsidian) 0%, var(--color-void) 50%, rgba(201,165,92,0.08) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(201,165,92,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,92,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute top-[20%] left-[15%] w-32 h-32 border border-gold/8 rounded-full animate-float" />
        <div className="absolute bottom-[25%] right-[20%] w-20 h-20 border border-gold/6 rotate-45 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[50%] right-[30%] w-2 h-2 bg-gold/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Content */}
        <div className="relative z-10 px-16 max-w-lg">
          <div className="h-[1px] w-16 bg-gradient-to-r from-gold to-transparent mb-8" />
          <h2 className="text-4xl font-heading font-bold text-mist-50 leading-tight">
            Welcome
            <br />
            <span className="text-gradient-gold">back.</span>
          </h2>
          <p className="mt-6 text-mist-400 font-light leading-relaxed">
            Sign in to continue managing your projects, tracking tasks, and collaborating with your team.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div ref={formRef} className="w-full max-w-md opacity-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group" data-hoverable>
            <img 
              src={prismGridIconLogo} 
              alt="PrismGrid" 
              className="w-8 h-8 group-hover:opacity-80 transition-opacity duration-500" 
            />
            <span className="text-lg font-heading font-semibold tracking-wide text-mist-100">
              PRISMGRID
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-mist-50">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-mist-400 font-light">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose/[0.06] border border-rose/20 text-rose text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-600" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-600" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-600 hover:text-mist-300 transition-colors"
                  data-hoverable
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:pointer-events-none"
              data-hoverable
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-mist-500 font-light">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-gold hover:text-gold-light transition-colors duration-300"
              data-hoverable
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
