import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  title, 
  message, 
  actionText, 
  onAction,
  secondaryActionText,
  onSecondaryAction 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        
        {actionText && (
          <div className="empty-state-actions">
            <button onClick={onAction} className="btn-primary">
              {actionText}
            </button>
            
            {secondaryActionText && (
              <button onClick={onSecondaryAction} className="btn-secondary">
                {secondaryActionText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;