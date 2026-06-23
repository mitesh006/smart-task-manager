import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import prismGridIconLogo from '/favicon-prismgrid.svg'

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
        <Link to="/" className="flex items-center gap-2 group" data-hoverable>
          <img 
            src={prismGridIconLogo} 
            alt="PrismGrid" 
            className="w-8 h-8 group-hover:opacity-80 transition-opacity duration-500" 
          />
          <span className="text-lg font-heading font-semibold tracking-wide text-mist-100 group-hover:text-gold-light transition-colors duration-500 hidden sm:inline">
            PRISMGRID
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
