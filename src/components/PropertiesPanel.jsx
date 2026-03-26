import React from 'react';
export default function PropertiesPanel({ selectedElement, updateSelected, deleteSelected, setSelectedId }) {
  if (!selectedElement) return null;
  return (
    <div className="tool-section">
      <h3>Properties</h3>
      {selectedElement.type === 'text' && (
        <>
          <label>Font Size</label>
          <input type="range" min="10" max="150" value={selectedElement.fontSize || 32} onChange={e => updateSelected('fontSize', Number(e.target.value))} style={{ width: '100%' }} />
          <label>Color</label>
          <input type="color" value={selectedElement.color || '#000000'} onChange={e => updateSelected('color', e.target.value)} />
          <label>Font Family</label>
          <select value={selectedElement.font || 'Outfit'} onChange={e => updateSelected('font', e.target.value)} style={{ width: '100%' }}>
            <option value="Outfit">Outfit</option>
            <option value="Cormorant Garamond">Cormorant Garamond</option>
            <option value="Great Vibes">Great Vibes</option>
          </select>
        </>
      )}
      {selectedElement.type === 'card' && (
        <>
          <label>Background Color</label>
          <input type="color" value={selectedElement.bgColor} onChange={e => updateSelected('bgColor', e.target.value)} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input type="checkbox" checked={selectedElement.isGlass} onChange={e => updateSelected('isGlass', e.target.checked)} />
            Glassmorphism Effect
          </label>
        </>
      )}
      <button style={{ background: '#ff4d4f', color: 'white', marginTop: '10px', width: '100%', borderColor: '#ff4d4f' }} onClick={deleteSelected}>Delete Element</button>
      <button style={{ marginTop: '5px', width: '100%' }} onClick={() => setSelectedId(null)}>Deselect</button>
    </div>
  );
}
