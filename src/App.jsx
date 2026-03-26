import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import DraggableElement from './components/DraggableElement';
import { generateId } from './utils/exportUtils';
import { STARTER_TEMPLATE, DEFAULT_BG } from './utils/templateUtils';

export default function App() {
  const [elements, setElements] = useState(STARTER_TEMPLATE);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const dragInitialState = useRef(null);
  const historyTimeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  const [selectedId, setSelectedId] = useState(null);
  const [numPages, setNumPages] = useState(1);
  const [exportMode, setExportMode] = useState('png');
  const [canvasBg, setCanvasBg] = useState('#762c14');
  const [bgImage, setBgImage] = useState('none');
  const [bgFit, setBgFit] = useState('cover');
  const [bgWidth, setBgWidth] = useState('full');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [canvasBorderRadius, setCanvasBorderRadius] = useState(0);
  const [canvasBgOverlay, setCanvasBgOverlay] = useState(0);
  const [canvasIsGlass, setCanvasIsGlass] = useState(false);
  
  const canvasRef = useRef(null);

  const safeElements = Array.isArray(elements) ? elements : [];
  const canvasHeight = safeElements.filter(el => !el.parentId).reduce((max, el) => Math.max(max, el.y + (el.height || 0)), 0) + 100;

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast(past.slice(0, -1));
    if (!previous || !Array.isArray(previous)) return;
    setFuture([safeElements, ...future]);
    setElements(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    if (!next || !Array.isArray(next)) return;
    setPast([...past, safeElements]);
    setElements(next);
  };

  const handleInteractStart = () => {
    dragInitialState.current = elements;
  };

  const handleInteractEnd = () => {
    if (dragInitialState.current) {
      const snapshot = dragInitialState.current;
      setPast(prev => [...prev, snapshot]);
      setFuture([]);
      dragInitialState.current = null;
    }
  };

  const selectedElement = selectedId === 'canvas' ? {
    id: 'canvas',
    type: 'canvas',
    bgColor: canvasBg,
    bgImage: bgImage,
    bgOverlay: canvasBgOverlay,
    opacity: canvasOpacity,
    borderRadius: canvasBorderRadius,
    isGlass: canvasIsGlass
  } : safeElements.find(el => el.id === selectedId);

  useEffect(() => {
    // Migration: Strip hardcoded 500px width from text elements to prevent bounding box collisions natively
    setElements(els => els.map(el => {
      if (el.type === 'text' && el.width === 500 && el.x === 0) {
        // Mathematically center it back visually to retain starter aesthetic despite dropping full-width
        const estimatedWidth = el.content.length * ((el.fontSize || 32) * 0.45);
        const centeredX = Math.max(0, (500 - estimatedWidth) / 2);
        return { ...el, width: undefined, x: centeredX };
      }
      return el;
    }));
  }, []);
  useEffect(() => {
    if (exportMode === 'png') {
      setBgImage('none');
      setCanvasBg('#762c14');
      setCanvasIsGlass(false);
      setNumPages(1);
    } else {
      // Restore HTML mode defaults
      setBgImage(DEFAULT_BG);
      setCanvasBg('#ffffff');
    }
  }, [exportMode]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept backspace inside inputs or contenteditable
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (
          e.target.tagName !== 'INPUT' &&
          e.target.tagName !== 'TEXTAREA' &&
          !e.target.isContentEditable
        ) {
          setPast(prev => [...prev, elements]);
          setFuture([]);
          // Recursive delete: remove element and any children
          const getChildrenIds = (id) => elements.filter(el => el.parentId === id).map(el => el.id);
          let toDelete = [selectedId];
          let queue = [selectedId];
          while (queue.length > 0) {
            const curr = queue.pop();
            const children = getChildrenIds(curr);
            toDelete = [...toDelete, ...children];
            queue.push(...children);
          }

          setElements(els => els.filter(el => !toDelete.includes(el.id)));
          setSelectedId(null);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements]);

  const addElement = (type, customImageUrl = null) => {
    let parentId = undefined;
    let spawnY = 50;
    let spawnX = 50;

    const workspace = document.getElementById('workspace');
    if (workspace && canvasRef.current) {
      const scale = canvasRef.current.getBoundingClientRect().width / canvasRef.current.offsetWidth;
      // Absolute Y coordinate on the unscaled canvas that corresponds to the center of the scrolling viewport
      const absoluteCenterY = (workspace.scrollTop + workspace.clientHeight / 2) / scale;

      // Determine parent
      if (selectedId) {
        const selected = elements.find(el => el.id === selectedId);
        if (selected) {
          parentId = selected.type === 'card' ? selected.id : selected.parentId;
        }
      }

      if (!parentId) {
        const cards = elements.filter(el => !el.parentId && el.type === 'card');
        let minDistance = Infinity;
        cards.forEach(card => {
          const cardCenterY = card.y + (card.height || 700) / 2;
          const distance = Math.abs(absoluteCenterY - cardCenterY);
          if (distance < minDistance) {
            minDistance = distance;
            parentId = card.id;
          }
        });
      }

      if (parentId) {
        const parentCard = elements.find(el => el.id === parentId);
        if (parentCard) {
          spawnY = absoluteCenterY - parentCard.y - 20;
          const parentH = parentCard.height || 700;
          spawnY = Math.max(0, Math.min(spawnY, parentH - 40));
        }
      }
    }

    if (!parentId) {
      const fallbackCard = elements.find(el => !el.parentId && el.type === 'card');
      if (fallbackCard) parentId = fallbackCard.id;
    }

    let newEl = { id: generateId(), type, x: spawnX, y: spawnY, zIndex: elements.length + 1, parentId };

    if (type === 'text') {
      newEl = { ...newEl, content: 'text', fontSize: 32, font: 'Outfit', color: 'white', align: 'center', width: 250 };
    } else if (type === 'card') {
      newEl = { ...newEl, x: 0, isGlass: false, bgColor: 'transparent', bgImage: 'none', width: 500, height: 400 };
    } else if (type === 'image') {
      newEl = { ...newEl, imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1542614471-001ccf2b449c?auto=format&fit=crop&q=80&w=200', width: 150, height: 150 };
    }

    setPast(prev => [...prev, elements]);
    setFuture([]);
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handleDrag = (id, dx, dy) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = rect.width / canvasRef.current.offsetWidth;

    setElements(els => els.map(el => {
      if (el.id !== id) return el;

      let newX = el.x + dx / scale;
      let newY = el.y + dy / scale;

      // Restrict dragging natively to remain physically inside parent card bounds
      if (el.parentId) {
        const parent = els.find(p => p.id === el.parentId);
        if (parent) {
          const parentH = parent.height || 700;

          // Removed horizontal bounds to allow full left/right bleeding.
          // Loosened vertical bounds so it doesn't artificially block placement near the bottom edge.
          newY = Math.max(0, Math.min(newY, parentH - 20));
        }
      }

      return { ...el, x: newX, y: newY };
    }));
  };

  const updateSelected = (key, value) => {
    if (!selectedId) return;

    if (selectedId === 'canvas') {
      if (key === 'bgColor') { setCanvasBg(value); setBgImage('none'); }
      if (key === 'bgImage') setBgImage(value);
      if (key === 'bgOverlay') setCanvasBgOverlay(value);
      if (key === 'opacity') setCanvasOpacity(value);
      if (key === 'borderRadius') setCanvasBorderRadius(value);
      if (key === 'isGlass') setCanvasIsGlass(value);
      if (key === 'bgFit') setBgFit(value);
      if (key === 'bgWidth') setBgWidth(value);
      return;
    }

    if (!historyTimeoutRef.current) {
      setPast(prev => {
        if (prev.length > 0 && prev[prev.length - 1] === elements) return prev;
        return [...prev, elements];
      });
      setFuture([]);
    }

    clearTimeout(historyTimeoutRef.current);
    historyTimeoutRef.current = setTimeout(() => {
      historyTimeoutRef.current = null;
    }, 600);

    setElements(els => els.map(el => el.id === selectedId ? { ...el, [key]: value } : el));
  };

  const updateContent = (id, content) => {
    setPast(prev => [...prev, elements]);
    setFuture([]);
    if (content.trim() === '') {
      setElements(els => els.filter(el => el.id !== id));
      if (selectedId === id) setSelectedId(null);
    } else {
      setElements(els => els.map(el => el.id === id ? { ...el, content } : el));
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setPast(prev => [...prev, elements]);
    setFuture([]);
    const getChildrenIds = (id) => elements.filter(el => el.parentId === id).map(el => el.id);
    let toDelete = [selectedId];
    let queue = [selectedId];
    while (queue.length > 0) {
      const curr = queue.pop();
      const children = getChildrenIds(curr);
      toDelete = [...toDelete, ...children];
      queue.push(...children);
    }
    setElements(els => els.filter(el => !toDelete.includes(el.id)));
    setSelectedId(null);
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the entire canvas? This cannot be undone.")) {
      setPast(prev => [...prev, elements]);
      setFuture([]);
      setElements([]);
      setSelectedId(null);
    }
  };

  const handleResize = (id, width, height) => {
    setElements(els => els.map(el => el.id === id ? { ...el, width, height } : el));
  };

  // Recursive render logic
  const renderChildren = (parentId) => {
    if (exportMode === 'png') {
      // In PNG mode: skip cards, only render first card's children centered on page
      if (parentId === null) {
        // Root non-card elements
        const rootElements = safeElements.filter(el => !el.parentId && el.type !== 'card');
        
        // Only render children of the FIRST card (single page)
        const firstCard = safeElements.find(el => !el.parentId && el.type === 'card');
        const cardChildren = firstCard 
          ? safeElements.filter(el => el.parentId === firstCard.id).map(el => ({
              ...el, 
              x: el.x,
              y: el.y
            }))
          : [];
        
        return [...rootElements, ...cardChildren].map(el => (
          <DraggableElement
            key={el.id}
            element={el}
            isSelected={!isPreviewMode && selectedId === el.id}
            isParentOfSelected={false}
            onSelect={isPreviewMode ? () => { } : setSelectedId}
            onDrag={isPreviewMode ? () => { } : handleDrag}
            onResize={isPreviewMode ? () => { } : handleResize}
            onInteractStart={handleInteractStart}
            onInteractEnd={handleInteractEnd}
            updateContent={updateContent}
            renderChildren={() => []}
            isPreviewMode={isPreviewMode}
          />
        ));
      }
      return [];
    }

    // HTML mode: normal recursive rendering
    return safeElements
      .filter(el => el.parentId === parentId)
      .map(el => (
        <DraggableElement
          key={el.id}
          element={el}
          isSelected={!isPreviewMode && selectedId === el.id}
          isParentOfSelected={!isPreviewMode && selectedElement && selectedElement.parentId === el.id}
          onSelect={isPreviewMode ? () => { } : setSelectedId}
          onDrag={isPreviewMode ? () => { } : handleDrag}
          onResize={isPreviewMode ? () => { } : handleResize}
          onInteractStart={handleInteractStart}
          onInteractEnd={handleInteractEnd}
          updateContent={updateContent}
          renderChildren={renderChildren}
          isPreviewMode={isPreviewMode}
        />
      ));
  };

  return (
    <div id="app" className={isPreviewMode ? 'preview-mode' : ''} style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {!isPreviewMode && (
        <Toolbar
          addElement={addElement}
          selectedElement={selectedElement}
          setSelectedId={setSelectedId}
          updateSelected={updateSelected}
          deleteSelected={deleteSelected}
          clearCanvas={clearCanvas}
          elements={elements}
          setElements={setElements}
          numPages={numPages}
          setNumPages={setNumPages}
          exportMode={exportMode}
          setExportMode={setExportMode}
          canvasBg={canvasBg}
          setCanvasBg={setCanvasBg}
          bgImage={bgImage}
          setBgImage={setBgImage}
          bgFit={bgFit}
          setBgFit={setBgFit}
          bgWidth={bgWidth}
          setBgWidth={setBgWidth}
          canvasRef={canvasRef}
          setIsPreviewMode={setIsPreviewMode}
          canvasOpacity={canvasOpacity}
          setCanvasOpacity={setCanvasOpacity}
          canvasBorderRadius={canvasBorderRadius}
          setCanvasBorderRadius={setCanvasBorderRadius}
          canvasBgOverlay={canvasBgOverlay}
          setCanvasBgOverlay={setCanvasBgOverlay}
          canvasIsGlass={canvasIsGlass}
          setCanvasIsGlass={setCanvasIsGlass}
          undo={undo}
          redo={redo}
          canUndo={past.length > 0}
          canRedo={future.length > 0}
        />
      )}

      {isPreviewMode && (
        <button
          onClick={() => setIsPreviewMode(false)}
          className="exit-preview-btn"
        >
          Exit Preview
        </button>
      )}

      <Canvas
        canvasRef={canvasRef}
        canvasBg={canvasBg}
        bgImage={bgImage}
        bgFit={bgFit}
        bgWidth={bgWidth}
        canvasOpacity={canvasOpacity}
        canvasBorderRadius={canvasBorderRadius}
        canvasBgOverlay={canvasBgOverlay}
        canvasIsGlass={canvasIsGlass}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        renderChildren={renderChildren}
        numPages={numPages}
        exportMode={exportMode}
        canvasHeight={canvasHeight}
      />
    </div>
  );
}
