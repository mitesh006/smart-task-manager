import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const lettersRef = useRef([])
  const lineRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete,
        })
      },
    })

    // Stagger each letter reveal
    tl.fromTo(
      lettersRef.current,
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power3.out',
      }
    )
      // Gold line expanding
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
        '-=0.2'
      )
      // Subtitle fade
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      // Hold briefly
      .to({}, { duration: 0.6 })

    return () => tl.kill()
  }, [onComplete])

  const letters = 'TASKFLOW'.split('')

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void"
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,165,92,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,92,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main title */}
      <div className="relative flex items-center gap-[2px]" style={{ perspective: '600px' }}>
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => (lettersRef.current[i] = el)}
            className="inline-block text-5xl md:text-7xl font-heading font-bold tracking-[0.15em] text-gradient-gold opacity-0"
            style={{ transformOrigin: 'center bottom' }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Gold line */}
      <div
        ref={lineRef}
        className="mt-5 h-[1px] w-32 origin-center"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a55c, transparent)',
          transform: 'scaleX(0)',
        }}
      />

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-4 text-xs tracking-[0.3em] uppercase text-mist-500 font-heading opacity-0"
      >
        Smart Team Management
      </p>
    </div>
  )
}
