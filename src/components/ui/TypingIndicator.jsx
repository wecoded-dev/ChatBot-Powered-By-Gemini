import React from 'react';
import { motion } from 'framer-motion';
import { DotLoader } from './LoadingSpinner';

const TypingIndicator = ({ 
  isVisible = false, 
  user = 'AI',
  className = '' 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center space-x-3 p-4 rounded-2xl glass-morphism max-w-sm ${className}`}
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user} is typing
        </span>
        <DotLoader />
      </div>
    </motion.div>
  );
};

export const AdvancedTypingIndicator = ({ 
  isVisible = false,
  speed = 'normal',
  variant = 'dots'
}) => {
  if (!isVisible) return null;

  const speedClasses = {
    slow: 'duration-1000',
    normal: 'duration-500',
    fast: 'duration-300'
  };

  if (variant === 'wave') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center space-x-1"
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"
            animate={{
              scaleY: [1, 1.5, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center space-x-1"
    >
      <span className="text-sm text-gray-500">Thinking</span>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="text-gray-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        >
          .
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TypingIndicator;
