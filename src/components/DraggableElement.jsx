import React from 'react';
import TextElement from './elements/TextElement';
import CardElement from './elements/CardElement';
import ImageElement from './elements/ImageElement';

export default function DraggableElement({ element, isSelected, onSelect, onDrag, onResize, updateContent, renderChildren }) {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    onSelect(element.id);
    
    let startX = e.clientX;
    let startY = e.clientY;
    
    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onDrag(element.id, dx, dy);
      startX = moveEvent.clientX;
      startY = moveEvent.clientY;
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const baseStyle = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    zIndex: isSelected ? 100 : 1
  };

  if (element.type === 'text') {
    return <TextElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handleMouseDown} updateContent={updateContent} onResize={onResize} />;
  }
  if (element.type === 'image') {
    return <ImageElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handleMouseDown} onResize={onResize} />;
  }
  if (element.type === 'card') {
    return <CardElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handleMouseDown} renderChildren={renderChildren} onResize={onResize} />;
  }
  return null;
}
