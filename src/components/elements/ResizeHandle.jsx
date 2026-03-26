import React from 'react';

export default function ResizeHandle({ id, width, height, onResize, lockWidth = false, onInteractStart, onInteractEnd }) {
  const handlePointerDown = (e) => {
    e.stopPropagation();
    let startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    let startW = width;
    let startH = height;
    let hasStartedInteraction = false;

    const onPointerMove = (moveEvent) => {
      if (moveEvent.cancelable && moveEvent.type.includes('touch')) {
        moveEvent.preventDefault();
      }

      if (!hasStartedInteraction) {
        hasStartedInteraction = true;
        if (onInteractStart) onInteractStart();
      }

      const clientX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;
      const canvas = document.getElementById('canvas');
      const scale = canvas ? canvas.getBoundingClientRect().width / canvas.offsetWidth : 1;
      
      const newWidth = lockWidth ? startW : Math.max(50, startW + dx / scale);
      const newHeight = Math.max(20, startH + dy / scale);
      
      onResize(id, newWidth, newHeight);
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

  return (
    <div
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      style={{
        position: 'absolute',
        right: '-6px',
        bottom: '-6px',
        width: '12px',
        height: '12px',
        backgroundColor: '#8a2be2',
        borderRadius: '50%',
        cursor: lockWidth ? 'ns-resize' : 'nwse-resize',
        border: '2px solid white',
        boxShadow: '0 0 4px rgba(0,0,0,0.3)',
        zIndex: 10
      }}
    />
  );
}
