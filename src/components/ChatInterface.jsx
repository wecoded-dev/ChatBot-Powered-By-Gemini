import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Menu, 
  Download, 
  Upload, 
  Trash2,
  Settings,
  Bot,
  User
} from 'lucide-react';
import { useChatContext } from '../contexts/ChatContext';
import { useThemeContext } from '../contexts/ThemeContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './ui/TypingIndicator';
import LoadingSpinner from './ui/LoadingSpinner';
import GlassCard from './ui/GlassCard';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const ChatInterface = () => {
  const {
    messages,
    sendMessage,
    regenerateResponse,
    editMessage,
    deleteMessage,
    clearChat,
    exportChat,
    importChat,
    isLoading,
    error,
    messagesEndRef,
    isAutoScroll,
    toggleAutoScroll
  } = useChatContext();

  const { theme } = useThemeContext();

  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImportChat = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const success = importChat(content);
            if (success) {
              console.log('Chat imported successfully');
            } else {
              console.error('Failed to import chat');
            }
          }
        } catch (error) {
          console.error('Error importing chat:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportChat = () => {
    const chatData = exportChat('json');
    const blob = new Blob([chatData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-chat-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 transition-all duration-500">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-30 glass-morphism dark:glass-morphism-dark shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu size={24} />
              </button>

              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gemini Ultra
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Powered by Google AI
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportChat}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Export Chat"
              >
                <Download size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                className="p-2 rounded-xl hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-red-500"
                title="Clear Chat"
              >
                <Trash2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex h-[calc(100vh-140px)]">
          {/* Chat Area */}
          <GlassCard 
            className="flex-1 flex flex-col overflow-hidden"
            glow={theme === 'neon'}
            border={theme === 'premium'}
          >
            {/* Messages Container */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-6"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center space-y-6"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                    >
                      <Bot className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome to Gemini Ultra
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        Start a conversation with the most advanced AI assistant. 
                        Ask anything, get intelligent responses with beautiful animations.
                      </p>
                    </div>

                    {/* Quick Start Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                      {[
                        "Explain quantum computing in simple terms",
                        "Write a poem about artificial intelligence",
                        "Help me plan a healthy meal for the week",
                        "What's the latest in space exploration?"
                      ].map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            setInputMessage(suggestion);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="p-3 text-left rounded-xl glass-morphism hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        onEdit={editMessage}
                        onDelete={deleteMessage}
                        onRegenerate={regenerateResponse}
                        onCopy={() => console.log('Copied:', message.id)}
                      />
                    ))}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-center space-x-3 p-4 rounded-2xl glass-morphism">
                          <LoadingSpinner size="sm" />
                          <span className="text-gray-600 dark:text-gray-400">
                            AI is thinking...
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-6 mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-red-700 dark:text-red-300">{error}</span>
                    <button
                      onClick={() => console.log('Clear error')}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Shift + Enter for new line)"
                    className="
                      w-full
                      p-4
                      pr-12
                      rounded-2xl
                      glass-morphism dark:glass-morphism-dark
                      resize-none
                      focus:outline-none
                      focus:ring-2 focus:ring-blue-500
                      transition-all duration-300
                      min-h-[60px]
                      max-h-[200px]
                    "
                    rows={1}
                    disabled={isLoading}
                  />
                  
                  {/* Character counter */}
                  {inputMessage.length > 0 && (
                    <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                      {inputMessage.length}/5000
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`
                    px-6
                    rounded-2xl
                    flex items-center justify-center
                    transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${
                      !inputMessage.trim() || isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    }
                  `}
                  whileHover={!inputMessage.trim() || isLoading ? {} : { scale: 1.05 }}
                  whileTap={!inputMessage.trim() || isLoading ? {} : { scale: 0.95 }}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" color="primary" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <div className="flex space-x-4">
                  <button
                    onClick={handleImportChat}
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                  >
                    <Upload size={16} />
                    <span>Import</span>
                  </button>
                  
                  <button
                    onClick={toggleAutoScroll}
                    className={`flex items-center space-x-1 transition-colors ${
                      isAutoScroll ? 'text-green-500' : 'hover:text-green-500'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isAutoScroll ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Auto-scroll</span>
                  </button>
                </div>

                <div className="text-xs">
                  {messages.length} messages
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={clearChat}
        onClearChat={clearChat}
        onExportChat={handleExportChat}
        onImportChat={handleImportChat}
        chatHistory={[]} // You can implement proper chat history management
        onSelectChat={() => {}}
      />

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json,.txt"
        className="hidden"
      />

      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-2">Drop to Import Chat</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Release the file to import your chat history
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
