import { useEffect } from 'react'
import Lenis from 'lenis'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="flex min-h-screen bg-void">
      <Sidebar />
      <main className="flex-1 ml-[72px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
