import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import DraggableElement from './components/DraggableElement';
import { generateId } from './utils/exportUtils';
import { STARTER_TEMPLATE, DEFAULT_BG } from './utils/templateUtils';

export default function App() {
  const [elements, setElements] = useState(STARTER_TEMPLATE);
  const [selectedId, setSelectedId] = useState(null);
  const [numPages, setNumPages] = useState(5);
  const [exportMode, setExportMode] = useState('html');
  const [canvasHeight, setCanvasHeight] = useState(3500);
  const [canvasBg, setCanvasBg] = useState('#ffffff');
  const [bgImage, setBgImage] = useState(DEFAULT_BG);
  const [bgFit, setBgFit] = useState('cover');
  const [bgWidth, setBgWidth] = useState('full');
  const canvasRef = useRef(null);

  const selectedElement = elements.find(el => el.id === selectedId);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept backspace inside inputs or contenteditable
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        if (
          e.target.tagName !== 'INPUT' &&
          e.target.tagName !== 'TEXTAREA' &&
          !e.target.isContentEditable
        ) {
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
    const parentId = selectedElement?.type === 'card' ? selectedId : null;

    let dropY = 50;
    if (!parentId) {
      const workspace = document.getElementById('workspace');
      if (workspace) {
        // Adjust spawn point visually so root elements don't exclusively jump to Page 1
        dropY = workspace.scrollTop + 50;
      }
    }

    let newEl = { id: generateId(), type, x: 50, y: dropY, parentId };

    if (type === 'text') {
      newEl = { ...newEl, content: 'Text', fontSize: 32, color: '#000000', font: 'Cormorant Garamond' };
    } else if (type === 'card') {
      newEl = { ...newEl, x: 0, isGlass: false, bgColor: 'transparent', bgImage: 'none', width: 500, height: 400 };
    } else if (type === 'image') {
      newEl = { ...newEl, imageUrl: customImageUrl || 'https://images.unsplash.com/photo-1542614471-001ccf2b449c?auto=format&fit=crop&q=80&w=200', width: 150, height: 150 };
    }

    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handleDrag = (id, dx, dy) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = rect.width / canvasRef.current.offsetWidth;

    setElements(els => els.map(el => el.id === id ? { ...el, x: el.x + dx / scale, y: el.y + dy / scale } : el));
  };

  const updateSelected = (key, value) => {
    if (!selectedId) return;
    setElements(els => els.map(el => el.id === selectedId ? { ...el, [key]: value } : el));
  };

  const updateContent = (id, content) => {
    if (content.trim() === '') {
      setElements(els => els.filter(el => el.id !== id));
      if (selectedId === id) setSelectedId(null);
    } else {
      setElements(els => els.map(el => el.id === id ? { ...el, content } : el));
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
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
      setElements([]);
      setSelectedId(null);
    }
  };

  const handleResize = (id, width, height) => {
    setElements(els => els.map(el => el.id === id ? { ...el, width, height } : el));
  };

  // Recursive render logic
  const renderChildren = (parentId) => {
    return elements
      .filter(el => el.parentId === parentId)
      .map(el => (
        <DraggableElement
          key={el.id}
          element={el}
          isSelected={selectedId === el.id}
          onSelect={setSelectedId}
          onDrag={handleDrag}
          onResize={handleResize}
          updateContent={updateContent}
          renderChildren={renderChildren}
        />
      ));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
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
        canvasHeight={canvasHeight}
        setCanvasHeight={setCanvasHeight}
        canvasBg={canvasBg}
        setCanvasBg={setCanvasBg}
        setBgImage={setBgImage}
        bgFit={bgFit}
        setBgFit={setBgFit}
        bgWidth={bgWidth}
        setBgWidth={setBgWidth}
        canvasRef={canvasRef}
      />

      <Canvas
        canvasRef={canvasRef}
        canvasBg={canvasBg}
        bgImage={bgImage}
        bgFit={bgFit}
        bgWidth={bgWidth}
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
