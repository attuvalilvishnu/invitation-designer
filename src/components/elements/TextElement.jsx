import React from 'react';
import ResizeHandle from './ResizeHandle';

export default function TextElement({ element, isSelected, baseStyle, handleMouseDown, onResize, onInteractStart, onInteractEnd }) {
  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={{ 
        ...baseStyle, 
        width: element.width ? `${element.width}px` : 'max-content',
        height: 'auto',
        fontSize: `${element.fontSize}px`,
        color: element.color,
        fontFamily: element.font,
        textAlign: element.align || 'center',
        fontWeight: element.isBold ? 'bold' : 'normal',
        fontStyle: element.isItalic ? 'italic' : 'normal',
        textDecoration: element.isUnderline ? 'underline' : 'none',
        wordBreak: 'break-word',
        minWidth: '20px',
        minHeight: '20px',
        cursor: 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: baseStyle.zIndex,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      data-type="text"
    >
      <span style={{ 
        pointerEvents: 'auto', 
        display: 'inline-block',
        maxWidth: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.01)'
      }}>
        {element.content}
      </span>
      {isSelected && <ResizeHandle id={element.id} width={element.width || 150} height={element.height || 40} onResize={onResize} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />}
    </div>
  );
}
