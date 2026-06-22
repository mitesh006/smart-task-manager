import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/client'
import gsap from 'gsap'
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react'

export default function Register() {
  // ── Step state ──
  const [step, setStep] = useState(1) // 1 = details, 2 = OTP verification

  // ── Form fields ──
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  // ── UI state ──
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const { user, login } = useAuth()
  const navigate = useNavigate()

  // ── Refs ──
  const containerRef = useRef(null)
  const formRef = useRef(null)
  const visualRef = useRef(null)
  const step2Ref = useRef(null)
  const otpInputsRef = useRef([])
  const cooldownRef = useRef(null)

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(
      formRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    ).fromTo(
      visualRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
      '-=0.7'
    )
    return () => tl.kill()
  }, [])

  // ── Cooldown timer ──
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
      return
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(cooldownRef.current)
  }, [resendCooldown])

  // ── Step 1: Send OTP ──
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await API.post('/auth/send-otp', { name, email, password })
      setStep(2)
      setResendCooldown(60)

      // Animate transition
      setTimeout(() => {
        if (step2Ref.current) {
          gsap.fromTo(
            step2Ref.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          )
        }
        // Focus first OTP input
        otpInputsRef.current[0]?.focus()
      }, 50)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e?.preventDefault?.()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await API.post('/auth/verify-otp', { email, otp: code })
      // Auto-login after verification
      const result = await login(email, password)
      if (!result.success) {
        setError('Account created but login failed. Please sign in manually.')
        setLoading(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
      setLoading(false)
    }
  }

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setError('')
    setLoading(true)
    setOtp(['', '', '', '', '', ''])

    try {
      await API.post('/auth/send-otp', { name, email, password })
      setResendCooldown(60)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  // ── OTP Input handlers ──
  const handleOtpChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (digit && index === 5) {
      const code = newOtp.join('')
      if (code.length === 6) {
        setTimeout(() => handleVerifyOtp(), 100)
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length > 0) {
      const newOtp = [...otp]
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char
      })
      setOtp(newOtp)
      // Focus the next empty input or the last one
      const nextEmpty = newOtp.findIndex((d) => !d)
      otpInputsRef.current[nextEmpty >= 0 ? nextEmpty : 5]?.focus()

      // Auto-submit if all filled
      if (newOtp.every((d) => d)) {
        setTimeout(() => handleVerifyOtp(), 100)
      }
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen flex bg-void">
      {/* Left Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div ref={formRef} className="w-full max-w-md opacity-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-8 h-8 rounded-sm border border-gold/40 flex items-center justify-center group-hover:border-gold transition-colors duration-500">
              <span className="text-gold font-heading font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-heading font-semibold tracking-wide text-mist-100">
              TASKFLOW
            </span>
          </Link>

          {/* ════════════════════════════════════
              STEP 1: Registration Details
              ════════════════════════════════════ */}
          {step === 1 && (
            <>
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-2xl font-heading font-bold text-mist-50">
                  Create account
                </h1>
                <p className="mt-2 text-sm text-mist-400 font-light">
                  Set up your workspace in seconds.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-3 rounded-lg bg-rose/[0.06] border border-rose/20 text-rose text-sm animate-fade-in">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-600" />
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-mist-400 tracking-wide uppercase mb-2 font-heading">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-600" />
                    <input
                      id="register-email"
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
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-600 hover:text-mist-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[10px] text-mist-600">
                    Min 8 chars, uppercase, lowercase, number & special character
                  </p>
                </div>

                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight size={16} />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-sm text-mist-500 font-light">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ════════════════════════════════════
              STEP 2: OTP Verification
              ════════════════════════════════════ */}
          {step === 2 && (
            <div ref={step2Ref}>
              {/* Back button */}
              <button
                onClick={() => { setStep(1); setError(''); setOtp(['', '', '', '', '', '']) }}
                className="flex items-center gap-2 text-xs text-mist-500 hover:text-mist-300 transition-colors mb-8"
              >
                <ArrowLeft size={14} />
                Back to details
              </button>

              {/* Heading */}
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-gold/[0.06] border border-gold/15 flex items-center justify-center mb-5">
                  <ShieldCheck size={20} className="text-gold" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-mist-50">
                  Verify your email
                </h1>
                <p className="mt-2 text-sm text-mist-400 font-light">
                  We sent a 6-digit code to{' '}
                  <span className="text-gold font-medium">{email}</span>
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-3 rounded-lg bg-rose/[0.06] border border-rose/20 text-rose text-sm animate-fade-in">
                  {error}
                </div>
              )}

              {/* OTP Input */}
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-xs text-mist-400 tracking-wide uppercase mb-3 font-heading">
                    Verification Code
                  </label>
                  <div className="flex gap-2 sm:gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputsRef.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="otp-input"
                        autoComplete="off"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Create Account
                        <ShieldCheck size={16} />
                      </>
                    )}
                  </span>
                </button>

                {/* Resend */}
                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="text-xs text-mist-500 font-light">
                      Resend code in{' '}
                      <span className="text-gold font-medium">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-xs text-gold hover:text-gold-light transition-colors font-medium flex items-center gap-1.5 mx-auto"
                    >
                      <RefreshCw size={12} />
                      Resend verification code
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right Visual Panel */}
      <div
        ref={visualRef}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden opacity-0"
      >
        {/* Background layers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(225deg, rgba(10,10,15,1) 0%, rgba(5,5,8,0.95) 50%, rgba(201,165,92,0.08) 100%)',
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
        <div className="absolute top-[18%] right-[15%] w-28 h-28 border border-gold/8 rounded-full animate-float" />
        <div className="absolute bottom-[22%] left-[18%] w-16 h-16 border border-gold/6 rotate-12 rounded-lg animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[45%] left-[35%] w-3 h-3 bg-gold/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />

        {/* Content */}
        <div className="relative z-10 px-16 max-w-lg">
          <div className="h-[1px] w-16 bg-gradient-to-r from-gold to-transparent mb-8" />
          <h2 className="text-4xl font-heading font-bold text-mist-50 leading-tight">
            Build
            <br />
            <span className="text-gradient-gold">something great.</span>
          </h2>
          <p className="mt-6 text-mist-400 font-light leading-relaxed">
            Create your free account and start orchestrating projects, assigning tasks, and leading your team with precision.
          </p>
        </div>
      </div>
    </div>
  )
}
