import React from 'react';

const GlassCard = ({ children, className = '', hoverable = true, ...props }) => {
  return (
    <div 
      className={`glass-panel ${hoverable ? 'glass-panel-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
