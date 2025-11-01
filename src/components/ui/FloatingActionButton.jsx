import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionButton = ({
  icon,
  onClick,
  tooltip,
  position = 'bottom-right',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    success: 'bg-green-500 hover:bg-green-600',
    danger: 'bg-red-500 hover:bg-red-600',
    premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 20 : -20 }}
            className={`
              absolute 
              ${position.includes('right') ? 'right-14' : 'left-14'}
              top-1/2 transform -translate-y-1/2
              bg-gray-900 text-white text-sm px-3 py-1 rounded-lg
              whitespace-nowrap
              pointer-events-none
            `}
          >
            {tooltip}
            <div className={`
              absolute 
              top-1/2 transform -translate-y-1/2
              ${position.includes('right') ? '-right-1' : '-left-1'}
              w-2 h-2 bg-gray-900 rotate-45
            `} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full
          text-white
          shadow-2xl
          flex items-center justify-center
          transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-opacity-50
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'}
        `}
      >
        {icon}
      </button>
    </motion.div>
  );
};

export const FloatingActionMenu = ({ 
  mainIcon,
  actions = [],
  position = 'bottom-right',
  isOpen = false,
  onToggle 
}) => {
  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.onClick}
                className={`
                  w-12 h-12
                  bg-white dark:bg-gray-800
                  rounded-full
                  shadow-2xl
                  flex items-center justify-center
                  hover:shadow-3xl
                  transition-all duration-300
                  text-gray-700 dark:text-gray-300
                  hover:text-blue-500
                `}
                title={action.tooltip}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingActionButton
        icon={mainIcon}
        onClick={onToggle}
        variant="primary"
        tooltip={isOpen ? 'Close menu' : 'Open menu'}
      />
    </div>
  );
};

export default FloatingActionButton;
