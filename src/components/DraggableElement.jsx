import React from 'react';
import TextElement from './elements/TextElement';
import CardElement from './elements/CardElement';
import ImageElement from './elements/ImageElement';

export default function DraggableElement({ element, isSelected, onSelect, onDrag, onResize, updateContent, renderChildren }) {
  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(element.id);
    
    let startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const onPointerMove = (moveEvent) => {
      if (element.type === 'card') return; // Cards are not draggable completely

      if (moveEvent.cancelable && moveEvent.type.includes('touch')) {
        moveEvent.preventDefault();
      }

      const clientX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;
      onDrag(element.id, dx, dy);
      startX = clientX;
      startY = clientY;
    };
    
    const onPointerUp = () => {
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    };
    
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  };

  const baseStyle = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    zIndex: isSelected ? 100 : 1
  };

  if (element.type === 'text') {
    return <TextElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handlePointerDown} updateContent={updateContent} onResize={onResize} />;
  }
  if (element.type === 'image') {
    return <ImageElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handlePointerDown} onResize={onResize} />;
  }
  if (element.type === 'card') {
    return <CardElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handlePointerDown} renderChildren={renderChildren} onResize={onResize} />;
  }
  return null;
}
