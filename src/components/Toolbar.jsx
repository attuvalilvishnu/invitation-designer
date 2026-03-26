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
  setBgImage,
  bgFit,
  setBgFit,
  bgWidth,
  setBgWidth,
  canvasRef,
  setIsPreviewMode,
  undo,
  redo,
  canUndo,
  canRedo
}) {
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

  const loadStarterTemplate = () => {
    if (window.confirm("This will replace all your current design elements with the starter template. Continue?")) {
      window.location.reload();
    }
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
      <h2>Designer</h2>

      {selectedElement && (
        <PropertiesPanel
          selectedElement={selectedElement}
          updateSelected={updateSelected}
          deleteSelected={deleteSelected}
          setSelectedId={setSelectedId}
        />
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button onClick={undo} disabled={!canUndo} style={{ flex: 1, padding: '8px', opacity: canUndo ? 1 : 0.5 }}>↩ Undo</button>
        <button onClick={redo} disabled={!canRedo} style={{ flex: 1, padding: '8px', opacity: canRedo ? 1 : 0.5 }}>Redo ↪</button>
      </div>

      <div className="tool-section">
        <h3>Project Type</h3>
        <select value={exportMode} onChange={e => setExportMode(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="html">Scrolling Website (HTML)</option>
          <option value="png">Multi-Page Invitation (PNG)</option>
        </select>

        {exportMode === 'png' ? (
          <>
            <label>Total Pages:</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '5px', marginTop: '5px' }}>
              <button style={{ flex: 1, padding: '5px' }} onClick={() => setNumPages(Math.max(1, numPages - 1))}>- Decrease</button>
              <button style={{ flex: 1, padding: '5px', background: '#8a2be2', color: 'white', borderColor: '#8a2be2' }} onClick={() => setNumPages(numPages + 1)}>+ Add Page</button>
            </div>
          </>
        ) : null}
      </div>

      <div className="tool-section">
        <h3>Add Elements</h3>
        <p style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
          {selectedElement?.type === 'card' ? 'Adding to selected Card' : 'Adding to Root Canvas'}
        </p>
        <button id="btn-add-text" onClick={() => addElement('text')}>Add Text</button>
        <button id="btn-add-card" onClick={() => addElement('card')}>Add Container Card</button>
        <button id="btn-add-image" onClick={handleAddImageByUrl}>Add Image by URL</button>
        <label className="upload-btn" style={{ display: 'block', marginTop: '10px' }}>
          Upload Image
          <input type="file" id="btn-upload-image" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </label>
      </div>

      <div className="tool-section">
        <h3>Canvas Settings</h3>
        <label>Background Color</label>
        <input
          type="color"
          value={canvasBg}
          onChange={e => { setCanvasBg(e.target.value); setBgImage('none'); }}
        />

        <label>Background Image</label>
        <input
          type="file"
          accept="image/*"
          style={{ fontFamily: 'var(--font-ui)', fontSize: '13px' }}
          onChange={handleBgImageUpload}
        />

        <label style={{ marginTop: '10px' }}>Image Fit</label>
        <select value={bgFit} onChange={e => setBgFit(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="cover">Fill Screen (Cover)</option>
          <option value="contain">Show Full Image (Contain)</option>
          <option value="100% auto">Fit Width (100% Width)</option>
          <option value="auto 100%">Fit Height (100% Height)</option>
        </select>

        <label style={{ marginTop: '10px' }}>Background Area</label>
        <select value={bgWidth} onChange={e => setBgWidth(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="full">Full Screen (Viewport)</option>
          <option value="canvas">Canvas Only (500px Wide)</option>
        </select>

        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <button id="btn-clear" style={{ background: '#ff4d4f', color: '#fff', borderColor: '#ff4d4f', width: '100%' }} onClick={clearCanvas}>Clear Canvas</button>
        <button id="btn-reset-template" style={{ background: '#555', color: '#fff', borderColor: '#555', width: '100%', marginTop: '10px' }} onClick={loadStarterTemplate}>Load Starter Template</button>

        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

        <h3>Template</h3>
        <button
          style={{ background: '#2d7d46', color: '#fff', borderColor: '#2d7d46', width: '100%' }}
          onClick={handleExportTemplate}
        >
          ⬇ Export Template (JSON)
        </button>
        <label
          className="upload-btn"
          style={{ display: 'block', marginTop: '10px', background: '#1a6fb5', cursor: 'pointer' }}
        >
          ⬆ Import Template (JSON)
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportTemplate} />
        </label>

        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <button
          style={{ background: '#4a90e2', color: '#fff', borderColor: '#4a90e2', width: '100%', marginBottom: '10px' }}
          onClick={() => { setSelectedId(null); setIsPreviewMode(true); }}
        >
          🔍 Preview Design
        </button>
        {exportMode === 'png' ? (
          <button id="btn-export" className="primary" style={{ width: '100%' }} onClick={handleExportPNG}>Export PNG Pages</button>
        ) : (
          <button id="btn-export-html" className="primary" style={{ background: '#e6b800', color: '#1a1a1a', width: '100%' }} onClick={handleExportHTML}>Export as HTML</button>
        )}
      </div>
    </aside>
  );
}
