import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-out ${
        scrolled
          ? 'glass-strong py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" data-hoverable>
          <div className="w-8 h-8 rounded-sm border border-gold/40 flex items-center justify-center group-hover:border-gold transition-colors duration-500">
            <span className="text-gold font-heading font-bold text-sm">T</span>
          </div>
          <span className="text-lg font-heading font-semibold tracking-wide text-mist-100 group-hover:text-gold-light transition-colors duration-500">
            TASKFLOW
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#features"
            className="text-sm text-mist-400 hover:text-mist-100 transition-colors duration-400 font-light tracking-wide"
            data-hoverable
          >
            Features
          </a>
          <a
            href="#about"
            className="text-sm text-mist-400 hover:text-mist-100 transition-colors duration-400 font-light tracking-wide"
            data-hoverable
          >
            About
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-mist-300 hover:text-gold transition-colors duration-400 font-light tracking-wide hidden sm:block"
            data-hoverable
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-primary btn-sm group"
            data-hoverable
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight size={14} className="transition-transform duration-400 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
