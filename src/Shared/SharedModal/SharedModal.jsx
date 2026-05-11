import React from 'react'
import Modal from 'react-modal'
import { Z_INDEX } from '../../constants/zIndex'

// Set the app element for react-modal accessibility
Modal.setAppElement('#root')

const SharedModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium', // 'small', 'medium', 'large', 'full'
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  customStyles = {},
  className = '',
  overlayClassName = '',
  showHeader = true,
  footer,
  onAfterOpen,
  onAfterClose
}) => {
  // Size configurations
  const sizeConfig = {
    small: 'max-w-sm sm:max-w-md',
    medium: 'max-w-sm sm:max-w-lg',
    large: 'max-w-sm sm:max-w-2xl',
    full: 'max-w-full mx-2 sm:mx-4'
  }

  // Default modal styles
  const defaultStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: Z_INDEX.MODAL_OVERLAY,
      ...customStyles.overlay
    },
      content: {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        border: 'none',
        borderRadius: '0.5rem',
        padding: '0',
        maxHeight: '95vh',
        overflow: 'auto',
        width: '95vw',
        maxWidth: '100%',
        ...customStyles.content
      }
  }


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={defaultStyles}
      className={`${sizeConfig[size]} ${className}`}
      overlayClassName={overlayClassName}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      shouldCloseOnOverlayClick={closeOnOverlayClick}
      shouldCloseOnEscape={closeOnEscape}
    >
      <div className="bg-white rounded-lg shadow-xl">
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-2">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default SharedModal