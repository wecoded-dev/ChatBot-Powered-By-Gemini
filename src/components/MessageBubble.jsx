import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react';
import { MESSAGE_TYPES } from '../utils/constants';
import { copyToClipboard } from '../utils/helpers';
import { speechService } from '../services/speechService';

const MessageBubble = ({
  message,
  onEdit,
  onDelete,
  onRegenerate,
  onCopy,
  showActions = true,
  className = ''
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.type === MESSAGE_TYPES.USER;
  const isError = message.type === MESSAGE_TYPES.ERROR;
  const isAI = message.type === MESSAGE_TYPES.AI;

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onCopy?.(message.id);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      const success = speechService.speak(message.content, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
      if (!success) {
        console.warn('Speech synthesis not supported');
      }
    }
  };

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    if (!inline && language) {
      return (
        <div className="relative">
          <SyntaxHighlighter
            style={atomDark}
            language={language}
            PreTag="div"
            className="rounded-lg my-2"
            {...props}
          >
            {code}
          </SyntaxHighlighter>
          <button
            onClick={() => copyToClipboard(code)}
            className="absolute top-2 right-2 p-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            title="Copy code"
          >
            <Copy size={14} />
          </button>
        </div>
      );
    }

    return (
      <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm" {...props}>
        {children}
      </code>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: isUser ? 100 : -100 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-4xl`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
          ${isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : isError
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-green-500 to-teal-500'
          }
        `}>
          {isUser ? 'U' : isError ? '!' : 'AI'}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2 flex-1`}>
          <motion.div
            className={`
              relative
              rounded-2xl
              p-4
              shadow-2xl
              backdrop-blur-sm
              max-w-full
              ${isError 
                ? 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700' 
                : isUser
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'glass-morphism dark:glass-morphism-dark text-gray-800 dark:text-gray-200'
              }
              ${message.isStreaming ? 'animate-pulse-slow' : ''}
            `}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={4}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {isAI && !isError ? (
                  <ReactMarkdown
                    components={{
                      code: CodeBlock,
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                )}
              </>
            )}

            {/* Streaming indicator */}
            {message.isStreaming && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Message Actions */}
          <AnimatePresence>
            {showActions && !isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex space-x-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  title="Copy message"
                >
                  {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>

                {/* Speech button (for AI messages) */}
                {isAI && !isError && speechService.isSupported() && (
                  <button
                    onClick={handleSpeech}
                    className="p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}

                {/* Edit button (for user messages) */}
                {isUser && (
                  <button
                    onClick={handleEdit}
                    className="p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    title="Edit message"
                  >
                    <Edit3 size={14} />
                  </button>
                )}

                {/* Regenerate button (for AI messages) */}
                {isAI && !isError && (
                  <button
                    onClick={() => onRegenerate(message.id)}
                    className="p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    title="Regenerate response"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}

                {/* Delete button */}
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:text-red-500"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timestamp */}
          <div className={`
            text-xs opacity-70
            ${isUser ? 'text-right' : 'text-left'}
          `}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
