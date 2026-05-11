// Z-Index Constants for consistent layering
// Higher numbers appear above lower numbers

export const Z_INDEX = {
  // Base content layers
  CONTENT: 1,
  SIDEBAR_STICKY: 10,
  
  // Navigation layers
  // On mobile: Sidebar should appear above header when opened
  // On desktop: They are side-by-side, but sidebar should not cover header
  HEADER: 30,
  MOBILE_OVERLAY: 40,
  SIDEBAR: 50,
  
  // Dropdown and overlay layers (always on top)
  DROPDOWN: 100,
  
  // Modal layers
  MODAL_OVERLAY: 1000,
  MODAL_CONTENT: 1001,
  
  // Toast/notification layers
  TOAST: 1500,
  
  // Alert libraries (SweetAlert2, etc.)
  ALERT: 2000,
  
  // Emergency/error overlays (highest - rarely used)
  EMERGENCY: 9999
}

export default Z_INDEX
