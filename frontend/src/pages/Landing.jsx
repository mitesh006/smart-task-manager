import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from '../components/Navbar'
import {
  ArrowRight,
  Layers,
  Shield,
  BarChart3,
  Users,
  Zap,
  Target,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
  const containerRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroSubRef = useRef(null)
  const heroCTARef = useRef(null)
  const heroAccentRef = useRef(null)
  const floatingShapesRef = useRef([])
  const featureCardsRef = useRef([])
  const statsRef = useRef([])
  const statNumbersRef = useRef([])
  const ctaSectionRef = useRef(null)
  const parallaxBgRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      duration: 1.4,
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // ── Hero entrance timeline ──
    const heroTl = gsap.timeline({ delay: 0.3 })

    heroTl
      .fromTo(
        heroAccentRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.inOut' }
      )
      .fromTo(
        heroTitleRef.current?.children || [],
        { opacity: 0, y: 80, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        heroCTARef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.3'
      )

    // ── Floating shapes parallax ──
    floatingShapesRef.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        y: -100 - i * 40,
        rotation: 360 * (i % 2 === 0 ? 1 : -1),
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    })

    // ── Parallax background ──
    if (parallaxBgRef.current) {
      gsap.to(parallaxBgRef.current, {
        y: 200,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }

    // ── Feature cards stagger ──
    featureCardsRef.current.forEach((el) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    // ── Stats counter animation ──
    statsRef.current.forEach((el) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    // Animate stat numbers
    statNumbersRef.current.forEach((el) => {
      if (!el) return
      const target = parseInt(el.dataset.target, 10)
      gsap.fromTo(
        { val: 0 },
        { val: target },
        {
          val: target,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: function () {
            el.textContent = Math.floor(this.targets()[0].val).toLocaleString()
          },
        }
      )
    })

    // ── CTA section reveal ──
    if (ctaSectionRef.current) {
      gsap.fromTo(
        ctaSectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const features = [
    {
      icon: Layers,
      title: 'Project Architecture',
      desc: 'Organize complex projects with intuitive hierarchies. Define milestones, set dependencies, and track progress with surgical precision.',
    },
    {
      icon: Target,
      title: 'Task Precision',
      desc: 'Assign, prioritize, and track tasks with granular control. Real-time status updates keep your entire team synchronized.',
    },
    {
      icon: Users,
      title: 'Team Orchestration',
      desc: 'Manage roles, permissions, and collaboration workflows. Every team member knows exactly what to do and when.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Engine',
      desc: 'Data-driven insights into team velocity, project health, and resource allocation. Make decisions backed by real metrics.',
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      desc: 'JWT authentication, role-based access control, and encrypted data handling. Enterprise-grade security without compromise.',
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      desc: 'Built on modern React architecture with optimized rendering. Every interaction feels instant, every transition feels effortless.',
    },
  ]

  const stats = [
    { number: 2847, suffix: '+', label: 'Projects Managed' },
    { number: 18500, suffix: '+', label: 'Tasks Completed' },
    { number: 640, suffix: '+', label: 'Teams Active' },
    { number: 99, suffix: '%', label: 'Uptime Record' },
  ]

  return (
    <div ref={containerRef} className="relative bg-void overflow-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div ref={parallaxBgRef} className="absolute inset-0">
          {/* Radial gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,165,92,0.04) 0%, transparent 70%)',
            }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(201,165,92,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,92,0.5) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Floating geometric shapes */}
        <div
          ref={(el) => (floatingShapesRef.current[0] = el)}
          className="absolute top-[15%] left-[10%] w-24 h-24 border border-gold/10 rounded-full animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          ref={(el) => (floatingShapesRef.current[1] = el)}
          className="absolute top-[25%] right-[12%] w-16 h-16 border border-gold/8 rotate-45 animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          ref={(el) => (floatingShapesRef.current[2] = el)}
          className="absolute bottom-[20%] left-[18%] w-20 h-20 border border-mist-800/30 rounded-lg animate-float"
          style={{ animationDelay: '4s' }}
        />
        <div
          ref={(el) => (floatingShapesRef.current[3] = el)}
          className="absolute bottom-[30%] right-[20%] w-3 h-3 bg-gold/20 rounded-full"
        />
        <div
          ref={(el) => (floatingShapesRef.current[4] = el)}
          className="absolute top-[40%] left-[40%] w-2 h-2 bg-gold/15 rounded-full"
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Accent line */}
          <div
            ref={heroAccentRef}
            className="mx-auto mb-8 h-[1px] w-24 origin-center"
            style={{
              background: 'linear-gradient(90deg, transparent, #c9a55c, transparent)',
              transform: 'scaleX(0)',
            }}
          />

          {/* Title */}
          <div ref={heroTitleRef}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[0.95] tracking-tight">
              <span className="block text-mist-50">Orchestrate</span>
              <span className="block mt-2 text-gradient-gold">Your Team's</span>
              <span className="block mt-2 text-mist-50">Potential</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={heroSubRef}
            className="mt-8 text-base md:text-lg text-mist-400 font-light max-w-2xl mx-auto leading-relaxed tracking-wide opacity-0"
          >
            A precision-engineered task management platform where intelligent project orchestration
            meets effortless team collaboration. Built for teams that refuse to settle.
          </p>

          {/* CTA Buttons */}
          <div ref={heroCTARef} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary group" data-hoverable>
              <span className="flex items-center gap-2">
                Start Building
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </span>
            </Link>
            <a href="#features" className="btn-ghost" data-hoverable>
              <span>Explore Features</span>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '2s' }}>
            <span className="text-[10px] tracking-[0.3em] uppercase text-mist-600 font-heading">
              Scroll to discover
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-gold/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════ */}
      <section id="features" className="relative py-32 md:py-40">
        {/* Subtle top divider */}
        <div className="divider-gold mb-24 mx-auto w-3/4" />

        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Section header */}
          <div className="text-center mb-20">
            <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-heading font-medium">
              Capabilities
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-heading font-bold text-mist-50 tracking-tight">
              Everything you need,
              <br />
              <span className="text-gradient-gold">nothing you don't</span>
            </h2>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                ref={(el) => (featureCardsRef.current[i] = el)}
                className="glass-card rounded-xl p-8 group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gold/[0.06] border border-gold/10 flex items-center justify-center mb-6 group-hover:border-gold/25 transition-all duration-500">
                  <feature.icon size={20} className="text-gold" />
                </div>

                <h3 className="text-lg font-heading font-semibold text-mist-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-mist-400 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS SECTION
          ═══════════════════════════════════════════ */}
      <section id="about" className="relative py-24 md:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,165,92,0.03) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={(el) => (statsRef.current[i] = el)}
                className="text-center py-8 opacity-0"
              >
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    ref={(el) => (statNumbersRef.current[i] = el)}
                    data-target={stat.number}
                    className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold"
                  >
                    0
                  </span>
                  <span className="text-2xl md:text-3xl font-heading font-light text-gold-dim">
                    {stat.suffix}
                  </span>
                </div>
                <p className="mt-3 text-xs tracking-[0.2em] uppercase text-mist-500 font-heading">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40">
        <div className="divider-gold mb-24 mx-auto w-3/4" />

        <div
          ref={ctaSectionRef}
          className="max-w-3xl mx-auto px-6 text-center opacity-0"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-heading font-medium">
            Ready to begin?
          </span>
          <h2 className="mt-6 text-3xl md:text-5xl font-heading font-bold text-mist-50 tracking-tight leading-tight">
            Your team deserves
            <br />
            <span className="text-gradient-gold">better management</span>
          </h2>
          <p className="mt-6 text-mist-400 font-light max-w-xl mx-auto leading-relaxed">
            Join hundreds of teams already using TaskFlow to ship faster, collaborate smarter,
            and manage projects with unparalleled clarity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary group" data-hoverable>
              <span className="flex items-center gap-2">
                Create Free Account
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-mist-800/30 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm border border-gold/30 flex items-center justify-center">
              <span className="text-gold font-heading font-bold text-[10px]">T</span>
            </div>
            <span className="text-xs text-mist-500 tracking-wide">
              © 2026 TaskFlow. Engineered for excellence.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-mist-500 hover:text-mist-300 transition-colors duration-300" data-hoverable>
              Privacy
            </a>
            <a href="#" className="text-xs text-mist-500 hover:text-mist-300 transition-colors duration-300" data-hoverable>
              Terms
            </a>
            <a href="#" className="text-xs text-mist-500 hover:text-mist-300 transition-colors duration-300" data-hoverable>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
