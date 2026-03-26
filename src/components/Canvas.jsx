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
  bgWidth,
  canvasOpacity,
  canvasBorderRadius,
  canvasBgOverlay,
  canvasIsGlass
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

  const enhancedBgImage = bgImage && bgImage !== 'none' 
    ? `linear-gradient(rgba(0,0,0,${canvasBgOverlay}), rgba(0,0,0,${canvasBgOverlay})), url(${bgImage})` 
    : `linear-gradient(rgba(0,0,0,${canvasBgOverlay}), rgba(0,0,0,${canvasBgOverlay}))`;

  const bgStyle = {
    backgroundColor: canvasBg,
    backgroundImage: enhancedBgImage,
    backgroundAttachment: 'fixed',
    backgroundSize: bgFit,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <main 
      id="workspace" 
      onMouseDown={() => setSelectedId('canvas')}
      style={{
        ...(exportMode === 'png' 
          ? { backgroundColor: '#e0e0e0', padding: 0, overflow: 'hidden', position: 'relative' }
          : (bgWidth === 'full' ? bgStyle : { backgroundColor: '#f4f6f9' })
        )
      }}
    >
      <div 
        id="canvas-container" 
        className={exportMode === 'png' ? 'container-fullwidth' : ''}
        style={{ 
          height: exportMode === 'png' ? '100%' : `${finalHeight}px`, 
          '--canvas-height': `${finalHeight}px` 
        }}
      >
        <div 
          id="canvas" 
          ref={canvasRef}
          className={exportMode === 'png' ? 'canvas-fullwidth' : ''}
          style={{ 
            height: exportMode === 'png' ? '100%' : `${finalHeight}px`,
            ...(bgWidth === 'canvas' || exportMode === 'png' ? bgStyle : { backgroundColor: 'transparent' }),
            opacity: canvasOpacity,
            borderRadius: `${canvasBorderRadius}px`,
            backdropFilter: canvasIsGlass ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: canvasIsGlass ? 'blur(12px)' : 'none',
            border: canvasIsGlass ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'
          }}
        >
          {dividers}
          {exportMode === 'png' ? (() => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const scale = isMobile ? Math.min(1, window.innerWidth / 500) : 1;
            return (
              <div style={{ 
                width: '500px', 
                height: `${100 / scale}%`, 
                position: 'relative', 
                margin: '0 auto',
                transform: scale < 1 ? `scale(${scale})` : 'none',
                transformOrigin: 'top center'
              }}>
                {renderChildren(null)}
              </div>
            );
          })() : (
            renderChildren(null)
          )}
        </div>
      </div>
    </main>
  );
}
