import React from 'react';
import PropertiesPanel from './PropertiesPanel';
import { generateId, exportPNG, exportHTML } from '../utils/exportUtils';

export default function Toolbar({
  addElement,
  selectedElement,
  setSelectedId,
  updateSelected,
  deleteSelected,
  clearCanvas,
  elements,
  setElements,
  numPages,
  setNumPages,
  exportMode,
  setExportMode,
  canvasBg,
  setCanvasBg,
  bgImage,
  setBgImage,
  bgFit,
  setBgFit,
  bgWidth,
  setBgWidth,
  canvasRef,
  setIsPreviewMode,
  canvasOpacity,
  setCanvasOpacity,
  canvasBorderRadius,
  setCanvasBorderRadius,
  canvasBgOverlay,
  setCanvasBgOverlay,
  canvasIsGlass,
  setCanvasIsGlass,
  undo,
  redo,
  canUndo,
  canRedo
}) {
  const importTemplateRef = React.useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addElement('image', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageByUrl = () => {
    const url = window.prompt("Enter the Image URL:");
    if (url && url.trim() !== '') {
      addElement('image', url.trim());
    }
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBgImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleExportPNG = () => {
    setSelectedId(null);
    exportPNG(canvasRef, numPages);
  };

  const handleExportHTML = () => {
    setSelectedId(null);
    exportHTML(canvasRef);
  };



  // ── Template Export/Import ──
  const handleExportTemplate = () => {
    const templateData = JSON.stringify(elements, null, 2);
    const blob = new Blob([templateData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitation-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) {
          if (window.confirm(`Import ${imported.length} elements? This will replace your current design.`)) {
            setElements(imported);
            setSelectedId(null);
          }
        } else {
          alert('Invalid template file. Expected a JSON array of elements.');
        }
      } catch (err) {
        alert('Failed to parse template file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset so same file can be re-imported
  };

  return (
    <aside id="toolbar">
      <div style={{ 
        position: 'sticky', 
        top: '-20px', 
        background: 'var(--toolbar-bg)', 
        paddingTop: '20px',
        paddingBottom: '15px',
        marginTop: '-20px',
        marginLeft: '-20px',
        marginRight: '-20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', 
        gap: '6px', 
        zIndex: 100 
      }}>
        <button title="Undo" onClick={undo} disabled={!canUndo} className="icon-btn">
          <i className="fa-solid fa-rotate-left"></i>
        </button>
        <button title="Redo" onClick={redo} disabled={!canRedo} className="icon-btn">
          <i className="fa-solid fa-rotate-right"></i>
        </button>
        
        {exportMode === 'html' && (
          <>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }}></div>
            <button title="Export Template (JSON)" className="icon-btn" onClick={handleExportTemplate}>
              <i className="fa-solid fa-file-export"></i>
            </button>
            <button title="Import Template (JSON)" className="icon-btn" onClick={() => importTemplateRef.current?.click()}>
              <i className="fa-solid fa-file-import"></i>
              <input type="file" accept=".json" style={{ display: 'none' }} ref={importTemplateRef} onChange={handleImportTemplate} />
            </button>
          </>
        )}
        
        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }}></div>

        {exportMode !== 'png' && (
          <button title="Preview Design" className="icon-btn" onClick={() => { setSelectedId(null); setIsPreviewMode(true); }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        )}

        {exportMode === 'png' ? (
          <button title="Download PNG" className="icon-btn" onClick={handleExportPNG}>
            <i className="fa-solid fa-download"></i>
          </button>
        ) : (
          <button title="Download HTML" className="icon-btn" onClick={handleExportHTML}>
            <i className="fa-solid fa-file-code"></i>
          </button>
        )}

        <button title="Clear Content" className="icon-btn danger" onClick={clearCanvas}>
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      {selectedElement && (
        <PropertiesPanel
          selectedElement={selectedElement}
          updateSelected={updateSelected}
          deleteSelected={deleteSelected}
          setSelectedId={setSelectedId}
        />
      )}

      <div className="tool-section">
        <h3>Project Type</h3>
        <select value={exportMode} onChange={e => setExportMode(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="html">Scrolling Website (HTML)</option>
          <option value="png">Multi-Page Invitation (PNG)</option>
        </select>

        {exportMode === 'png' ? null : null}
      </div>

      <div className="tool-section">
        <h3>Add Elements</h3>
        <p style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
          {selectedElement?.type === 'card' ? 'Adding to selected Card' : 'Adding to Root Canvas'}
        </p>
        <button id="btn-add-text" onClick={() => addElement('text')}>Add Text</button>
        {exportMode === 'html' && (
          <button id="btn-add-card" onClick={() => addElement('card')}>Add Container Card</button>
        )}
        <button id="btn-add-image" onClick={handleAddImageByUrl}>Add Image by URL</button>
        <label className="upload-btn" style={{ display: 'block', marginTop: '10px' }}>
          Upload Image
          <input type="file" id="btn-upload-image" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </label>
      </div>

    </aside>
  );
}
