// Scroll utility functions

/**
 * Scroll to top of the page
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export const scrollToTop = (smooth = true) => {
  if (smooth) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  } else {
    window.scrollTo(0, 0)
  }
}

/**
 * Scroll to top with fallback for older browsers
 */
export const scrollToTopWithFallback = () => {
  // Try smooth scrolling first
  if ('scrollBehavior' in document.documentElement.style) {
    scrollToTop(true)
  } else {
    // Fallback for older browsers
    scrollToTop(false)
  }
}

/**
 * Scroll to top after a delay (useful for route changes)
 * @param {number} delay - Delay in milliseconds
 */
export const scrollToTopDelayed = (delay = 0) => {
  setTimeout(() => {
    scrollToTopWithFallback()
  }, delay)
}

/**
 * Scroll to top using requestAnimationFrame for better timing
 */
export const scrollToTopRAF = () => {
  requestAnimationFrame(() => {
    scrollToTopWithFallback()
  })
}

/**
 * Reset scroll position immediately (no animation)
 */
export const resetScrollPosition = () => {
  window.scrollTo(0, 0)
  // Also reset any scroll containers
  const scrollContainers = document.querySelectorAll('[data-scroll-container]')
  scrollContainers.forEach(container => {
    container.scrollTop = 0
  })
}
