import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Multiple attempts to ensure scrolling works
    const scrollToTop = () => {
      try {
        // Method 1: Modern smooth scrolling
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        })
        
        // Method 2: Direct DOM manipulation
        if (document.documentElement) {
          document.documentElement.scrollTop = 0
          document.documentElement.scrollLeft = 0
        }
        
        if (document.body) {
          document.body.scrollTop = 0
          document.body.scrollLeft = 0
        }
        
        // Method 3: Reset scroll containers
        const scrollContainers = document.querySelectorAll(
          'main, [data-scroll-container], .overflow-auto, .overflow-y-auto, .overflow-x-auto'
        )
        
        scrollContainers.forEach(container => {
          if (container.scrollTop > 0) {
            container.scrollTop = 0
          }
          if (container.scrollLeft > 0) {
            container.scrollLeft = 0
          }
        })
        
        // Method 4: Force scroll on specific elements
        const mainElement = document.querySelector('main')
        if (mainElement && mainElement.scrollTop > 0) {
          mainElement.scrollTop = 0
        }
        
        // Method 5: Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
        })
        
      } catch (error) {
        console.error('useScrollToTop error:', error)
      }
    }

    // Immediate execution
    scrollToTop()
    
    // Multiple delayed attempts to handle different loading scenarios
    const timeouts = [
      setTimeout(scrollToTop, 0),
      setTimeout(scrollToTop, 50),
      setTimeout(scrollToTop, 100),
      setTimeout(scrollToTop, 200),
      setTimeout(scrollToTop, 500)
    ]
    
    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [pathname])
}

export default useScrollToTop