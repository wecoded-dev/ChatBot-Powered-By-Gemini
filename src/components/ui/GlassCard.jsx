import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '',
  hover = true,
  glow = false,
  border = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        relative
        glass-morphism
        rounded-2xl
        p-6
        backdrop-blur-xl
        ${border ? 'premium-border' : 'border-transparent'}
        ${glow ? 'neon-glow' : ''}
        ${hover ? 'hover:shadow-2xl transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl -z-10" />
      )}
      {children}
    </motion.div>
  );
};

export const AnimatedGlassCard = ({ 
  children, 
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      {...props}
    >
      <GlassCard {...props}>
        {children}
      </GlassCard>
    </motion.div>
  );
};

export default GlassCard;
