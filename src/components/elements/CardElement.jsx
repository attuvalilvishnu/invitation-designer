import React from 'react';
import ResizeHandle from './ResizeHandle';

export default function CardElement({ element, isSelected, baseStyle, handleMouseDown, renderChildren, onResize, onInteractStart, onInteractEnd }) {
  return (
    <div
      className={`canvas-element ${element.isGlass ? 'glass' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        ...baseStyle,
        width: `${element.width}px`,
        height: `${element.height}px`,
        opacity: typeof element.opacity !== 'undefined' ? element.opacity : 1,
        backgroundColor: element.isGlass ? element.bgColor : (element.bgColor || 'transparent'),
        backgroundImage: element.bgImage && element.bgImage !== 'none' ? `url(${element.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 0,
        display: 'block' // override glass flex which messes up absolute positioning
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      data-type="card"
    >
      {renderChildren(element.id)}
      {isSelected && <ResizeHandle id={element.id} width={element.width} height={element.height} onResize={onResize} lockWidth={true} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />}
    </div>
  );
}
