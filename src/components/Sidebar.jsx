import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Settings,
  Moon,
  Sun,
  Palette,
  History
} from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { THEMES } from '../utils/constants';
import GlassCard from './ui/GlassCard';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onClearChat, 
  onExportChat, 
  onImportChat,
  chatHistory = [],
  onSelectChat,
  currentChatId 
}) => {
  const { theme, setTheme, toggleTheme, isDark, themes } = useThemeContext();
  const [activeSection, setActiveSection] = useState('chats');

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      pointerEvents: 'auto'
    },
    closed: {
      opacity: 0,
      pointerEvents: 'none'
    }
  };

  const themeColors = {
    [THEMES.LIGHT]: { name: 'Light', bg: 'bg-white', text: 'text-gray-900' },
    [THEMES.DARK]: { name: 'Dark', bg: 'bg-gray-900', text: 'text-white' },
    [THEMES.PREMIUM]: { name: 'Premium', bg: 'bg-gradient-to-br from-purple-900 to-blue-800', text: 'text-white' },
    [THEMES.NEON]: { name: 'Neon', bg: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500', text: 'text-white' }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed left-0 top-0 h-full w-80
          glass-morphism dark:glass-morphism-dark
          shadow-2xl
          z-50
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gradient">Gemini Ultra</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('chats')}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeSection === 'chats' 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <History size={20} />
              <span>Chat History</span>
            </button>
            <button
              onClick={() => setActiveSection('themes')}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeSection === 'themes' 
                  ? 'bg-purple-500 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Palette size={20} />
              <span>Themes</span>
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                activeSection === 'settings' 
                  ? 'bg-green-500 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">
            {activeSection === 'chats' && (
              <motion.div
                key="chats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onNewChat}
                    className="flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                  >
                    <Plus size={16} />
                    <span>New Chat</span>
                  </button>
                  <button
                    onClick={onClearChat}
                    className="flex items-center justify-center space-x-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Clear All</span>
                  </button>
                </div>

                {/* Import/Export */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onExportChat}
                    className="flex items-center justify-center space-x-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                  >
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={onImportChat}
                    className="flex items-center justify-center space-x-2 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors"
                  >
                    <Upload size={16} />
                    <span>Import</span>
                  </button>
                </div>

                {/* Chat History */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Recent Chats</h3>
                  {chatHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No chat history yet
                    </p>
                  ) : (
                    chatHistory.slice(0, 10).map((chat, index) => (
                      <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          currentChatId === chat.id
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium truncate">
                          {chat.title || `Chat ${index + 1}`}
                        </div>
                        <div className="text-xs opacity-70">
                          {new Date(chat.timestamp).toLocaleDateString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === 'themes' && (
              <motion.div
                key="themes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Theme Settings</h3>
                
                {/* Theme Toggle */}
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
                    >
                      {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                  </div>
                </GlassCard>

                {/* Theme Selection */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Choose Theme
                  </h4>
                  {Object.entries(themeColors).map(([themeKey, themeConfig]) => (
                    <button
                      key={themeKey}
                      onClick={() => setTheme(themeKey)}
                      className={`w-full p-3 rounded-xl transition-all ${
                        theme === themeKey
                          ? 'ring-2 ring-blue-500'
                          : 'hover:opacity-90'
                      }`}
                    >
                      <div className={`${themeConfig.bg} ${themeConfig.text} p-3 rounded-lg text-center`}>
                        {themeConfig.name}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">App Settings</h3>
                
                <GlassCard className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable Animations</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Auto-scroll</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Markdown Support</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
