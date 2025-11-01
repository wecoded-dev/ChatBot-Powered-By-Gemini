import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Palette } from 'lucide-react';
import { useThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useThemeContext();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative
        p-3
        rounded-2xl
        glass-morphism dark:glass-morphism-dark
        hover:shadow-2xl
        transition-all duration-300
        group
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </motion.div>

      {/* Theme indicator */}
      <motion.div
        className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full
          ${isDark ? 'bg-purple-500' : 'bg-blue-500'}
        `}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Tooltip */}
      <div className="
        absolute 
        top-1/2 right-12 
        transform -translate-y-1/2
        bg-gray-900 text-white text-sm px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        whitespace-nowrap
      ">
        {isDark ? 'Light Mode' : 'Dark Mode'}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </motion.button>
  );
};

export const ThemeSelector = ({ className = '' }) => {
  const { theme, setTheme, themes } = useThemeContext();

  const themeOptions = [
    { key: themes.LIGHT, name: 'Light', icon: Sun, gradient: 'from-gray-100 to-gray-300' },
    { key: themes.DARK, name: 'Dark', icon: Moon, gradient: 'from-gray-800 to-gray-900' },
    { key: themes.PREMIUM, name: 'Premium', icon: Palette, gradient: 'from-purple-500 to-blue-500' },
    { key: themes.NEON, name: 'Neon', icon: Palette, gradient: 'from-pink-500 via-red-500 to-yellow-500' },
  ];

  return (
    <motion.div
      className={`flex space-x-2 p-2 rounded-2xl glass-morphism ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {themeOptions.map((themeOption) => {
        const Icon = themeOption.icon;
        return (
          <motion.button
            key={themeOption.key}
            onClick={() => setTheme(themeOption.key)}
            className={`
              relative
              p-2
              rounded-xl
              transition-all duration-300
              ${theme === themeOption.key 
                ? 'ring-2 ring-white shadow-lg' 
                : 'hover:scale-110'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${themeOption.gradient}`}>
              <Icon className="w-4 h-4 m-1 text-white" />
            </div>
            
            {/* Tooltip */}
            <div className="
              absolute 
              top-12 left-1/2 
              transform -translate-x-1/2
              bg-gray-900 text-white text-xs px-2 py-1 rounded
              opacity-0 hover:opacity-100
              transition-opacity duration-200
              pointer-events-none
              whitespace-nowrap
            ">
              {themeOption.name}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ThemeToggle;
