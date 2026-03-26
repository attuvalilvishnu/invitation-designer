import React, { useRef, useState, useEffect } from 'react';
import ResizeHandle from './ResizeHandle';

export default function TextElement({ element, isSelected, baseStyle, handleMouseDown, updateContent, onResize, onInteractStart, onInteractEnd }) {
  const contentRef = useRef(element.content);
  const spanRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && spanRef.current) {
      spanRef.current.focus();
      if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
        const range = document.createRange();
        range.selectNodeContents(spanRef.current);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [isEditing]);

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

  const handleClick = (e) => {
    e.stopPropagation();
    if (isSelected && !isEditing) {
      setIsEditing(true);
    }
  };

  const sizeStyle = {};
  if (element.width) sizeStyle.width = `${element.width}px`;
  if (element.height) sizeStyle.height = `${element.height}px`;

  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={{ 
        ...baseStyle, 
        width: element.width ? `${element.width}px` : (isEditing ? '150px' : 'auto'),
        height: element.height ? `${element.height}px` : (isEditing ? '40px' : 'auto'),
        fontSize: `${element.fontSize}px`,
        color: element.color,
        fontFamily: element.font,
        textAlign: element.align,
        fontWeight: element.isBold ? 'bold' : 'normal',
        fontStyle: element.isItalic ? 'italic' : 'normal',
        textDecoration: element.isUnderline ? 'underline' : 'none',
        wordBreak: 'break-word',
        outline: isEditing ? '2px solid #8a2be2' : 'none',
        minWidth: '20px',
        minHeight: '20px',
        cursor: isEditing ? 'text' : 'grab',
        userSelect: isEditing ? 'text' : 'none',
        WebkitUserSelect: isEditing ? 'text' : 'none',
        zIndex: isEditing ? 100 : baseStyle.zIndex,
        touchAction: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.01)'
      }}
      onMouseDown={isEditing ? (e) => e.stopPropagation() : handleMouseDown}
      onTouchStart={isEditing ? (e) => e.stopPropagation() : handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      onTouchEnd={handleClick}
      data-type="text"
    >
      <span
        ref={spanRef}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onBlur={handleBlur}
        style={{ 
          outline: 'none', 
          display: 'block', 
          width: '100%', 
          height: '100%',
          cursor: isEditing ? 'text' : 'inherit'
        }}
      >
        {element.content}
      </span>
      {isSelected && <ResizeHandle id={element.id} width={element.width || 150} height={element.height || 40} onResize={onResize} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />}
    </div>
  );
}
