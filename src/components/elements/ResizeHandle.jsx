import React from 'react';

export default function ResizeHandle({ id, width, height, onResize, lockWidth = false }) {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    let startX = e.clientX;
    let startY = e.clientY;
    let startW = width;
    let startH = height;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const canvas = document.getElementById('canvas');
      const scale = canvas ? canvas.getBoundingClientRect().width / canvas.offsetWidth : 1;
      
      const newWidth = lockWidth ? startW : Math.max(50, startW + dx / scale);
      const newHeight = Math.max(20, startH + dy / scale);
      
      onResize(id, newWidth, newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
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
