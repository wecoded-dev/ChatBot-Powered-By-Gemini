import React from 'react';
import { motion } from 'framer-motion';
import { MESSAGE_TYPES } from '../../utils/constants';

const AnimatedMessage = ({ 
  message,
  index,
  onEdit,
  onDelete,
  onRegenerate,
  className = '' 
}) => {
  const isUser = message.type === MESSAGE_TYPES.USER;
  const isError = message.type === MESSAGE_TYPES.ERROR;

  const messageVariants = {
    initial: { 
      opacity: 0, 
      y: 50,
      scale: 0.8 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: isUser ? 100 : -100,
      transition: { duration: 0.2 }
    }
  };

  const bubbleVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <motion.div
        variants={bubbleVariants}
        className={`
          relative
          max-w-3xl
          rounded-3xl
          p-4
          shadow-2xl
          backdrop-blur-sm
          ${isError 
            ? 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700' 
            : isUser
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'glass-morphism dark:glass-morphism-dark text-gray-800 dark:text-gray-200'
          }
          ${message.isStreaming ? 'animate-pulse-slow' : ''}
        `}
      >
        {/* Message content */}
        <div className="break-words whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Message actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -bottom-6 right-2 flex space-x-1"
        >
          {!isUser && !isError && (
            <button
              onClick={() => onRegenerate(message.id)}
              className="p-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
              title="Regenerate response"
            >
              ↻
            </button>
          )}
          {isUser && (
            <button
              onClick={() => onEdit(message.id, message.content)}
              className="p-1 text-xs text-gray-500 hover:text-green-500 transition-colors"
              title="Edit message"
            >
              ✏️
            </button>
          )}
          <button
            onClick={() => onDelete(message.id)}
            className="p-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            title="Delete message"
          >
            🗑️
          </button>
        </motion.div>

        {/* Timestamp */}
        <div className={`
          text-xs mt-2
          ${isUser ? 'text-blue-100' : 'text-gray-500'}
        `}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>

        {/* Streaming indicator */}
        {message.isStreaming && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export const MessageGroup = ({ messages, onMessageAction, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {messages.map((message, index) => (
        <AnimatedMessage
          key={message.id}
          message={message}
          index={index}
          onEdit={onMessageAction}
          onDelete={onMessageAction}
          onRegenerate={onMessageAction}
        />
      ))}
    </div>
  );
};

export default AnimatedMessage;
