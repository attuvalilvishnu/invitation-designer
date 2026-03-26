import React from 'react';
import ResizeHandle from './ResizeHandle';

export default function ImageElement({ element, isSelected, baseStyle, handleMouseDown, onResize, onInteractStart, onInteractEnd }) {
  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={{ 
        ...baseStyle, 
        width: `${element.width}px`, 
        height: `${element.height}px`,
        touchAction: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.01)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      data-type="image"
    >
      <img 
        src={element.imageUrl} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          borderRadius: typeof element.borderRadius === 'undefined' ? '4px' : `${element.borderRadius}px`,
          opacity: typeof element.opacity === 'undefined' ? 1 : element.opacity
        }} 
        draggable="false" 
        alt="Canvas Element"
      />
      {isSelected && <ResizeHandle id={element.id} width={element.width} height={element.height} onResize={onResize} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />}
    </div>
  );
}
