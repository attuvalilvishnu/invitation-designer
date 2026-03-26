import React from 'react';
import ResizeHandle from './ResizeHandle';

export default function ImageElement({ element, isSelected, baseStyle, handleMouseDown, onResize }) {
  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={{ 
        ...baseStyle, 
        width: `${element.width}px`, 
        height: `${element.height}px` 
      }}
      onMouseDown={handleMouseDown}
      data-type="image"
    >
      <img 
        src={element.imageUrl} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        draggable="false" 
        alt="Canvas Element"
      />
      {isSelected && <ResizeHandle id={element.id} width={element.width} height={element.height} onResize={onResize} />}
    </div>
  );
}
