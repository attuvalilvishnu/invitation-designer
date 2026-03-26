import React from 'react';
import DraggableElement from './DraggableElement';

export default function Canvas({ 
  canvasRef, 
  canvasBg, 
  bgImage, 
  selectedId, 
  setSelectedId, 
  renderChildren,
  numPages,
  exportMode,
  canvasHeight,
  bgFit,
  bgWidth
}) {
  const finalHeight = exportMode === 'png' ? numPages * 700 : canvasHeight;
  
  const dividers = [];
  if (exportMode === 'png') {
    for (let i = 1; i < numPages; i++) {
      dividers.push(
        <div key={`div-${i}`} className="page-divider" style={{ top: `${i * 700}px` }}></div>
      );
    }
  }

  const bgStyle = {
    backgroundColor: canvasBg,
    backgroundImage: bgImage && bgImage !== 'none' ? `url(${bgImage})` : 'none',
    backgroundAttachment: 'fixed',
    backgroundSize: bgFit,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <main 
      id="workspace" 
      onMouseDown={() => setSelectedId(null)}
      style={bgWidth === 'full' ? bgStyle : { backgroundColor: '#f4f6f9' }}
    >
      <div id="canvas-container" style={{ height: `${finalHeight}px` }}>
        <div 
          id="canvas" 
          ref={canvasRef} 
          style={{ 
            height: `${finalHeight}px`,
            ...(bgWidth === 'canvas' ? bgStyle : { backgroundColor: 'transparent' })
          }}
        >
          {dividers}
          {renderChildren(null)}
        </div>
      </div>
    </main>
  );
}
