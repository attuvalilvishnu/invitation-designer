import React from 'react';
import TextElement from './elements/TextElement';
import CardElement from './elements/CardElement';
import ImageElement from './elements/ImageElement';

export default function DraggableElement({ element, isSelected, onSelect, onDrag, onResize, onInteractStart, onInteractEnd, updateContent, renderChildren }) {
  const handlePointerDown = (e) => {
    e.stopPropagation();
    const wasSelected = isSelected;
    onSelect(element.id);
    
    let startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    let hasStartedInteraction = false;
    
    const onPointerMove = (moveEvent) => {
      const isTouch = moveEvent.type.includes('touch');
      if (isTouch && !wasSelected) {
        // Crucial usability fix: Don't drag unselected elements on touch (allows scrolling over them)
        return;
      }

      if (moveEvent.cancelable && isTouch) {
        moveEvent.preventDefault();
      }

      if (element.type === 'card') return; // Cards are absolutely restricted from being dragged

      if (!hasStartedInteraction) {
        hasStartedInteraction = true;
        if (onInteractStart) onInteractStart();
      }

      const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;
      onDrag(element.id, dx, dy);
      startX = clientX;
      startY = clientY;
    };
    
    const onPointerUp = () => {
      if (hasStartedInteraction && onInteractEnd) onInteractEnd();
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
    return <TextElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handlePointerDown} updateContent={updateContent} onResize={onResize} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />;
  }
  if (element.type === 'image') {
    return <ImageElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handlePointerDown} onResize={onResize} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />;
  }
  if (element.type === 'card') {
    return <CardElement element={element} isSelected={isSelected} baseStyle={baseStyle} handleMouseDown={handlePointerDown} renderChildren={renderChildren} onResize={onResize} onInteractStart={onInteractStart} onInteractEnd={onInteractEnd} />;
  }
  return null;
}
