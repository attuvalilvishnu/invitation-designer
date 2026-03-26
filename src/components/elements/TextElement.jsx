import React, { useRef, useState } from 'react';
import ResizeHandle from './ResizeHandle';

export default function TextElement({ element, isSelected, baseStyle, handleMouseDown, updateContent, onResize }) {
  const contentRef = useRef(element.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleInput = (e) => {
    contentRef.current = e.currentTarget.textContent;
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current !== element.content) {
      updateContent(element.id, contentRef.current);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const sizeStyle = {};
  if (element.width) sizeStyle.width = `${element.width}px`;
  if (element.height) sizeStyle.height = `${element.height}px`;

  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={{ 
        ...baseStyle, 
        ...sizeStyle,
        fontSize: `${element.fontSize}px`, 
        color: element.color, 
        fontFamily: element.font,
        outline: 'none',
        minWidth: '20px',
        minHeight: '20px',
        cursor: isEditing ? 'text' : 'grab',
        overflow: 'hidden',
        wordBreak: 'break-word',
        userSelect: isEditing ? 'text' : 'none',
        WebkitUserSelect: isEditing ? 'text' : 'none'
      }}
      onMouseDown={isEditing ? undefined : handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <span
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onBlur={handleBlur}
        style={{ 
          outline: 'none', 
          display: 'block', 
          width: '100%', 
          height: '100%',
          cursor: isEditing ? 'text' : 'inherit',
          pointerEvents: isEditing ? 'auto' : 'none'
        }}
      >
        {element.content}
      </span>
      {isSelected && <ResizeHandle id={element.id} width={element.width || 150} height={element.height || 40} onResize={onResize} />}
    </div>
  );
}
