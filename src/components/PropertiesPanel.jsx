import React from 'react';
export default function PropertiesPanel({ selectedElement, updateSelected, deleteSelected, setSelectedId }) {
  if (!selectedElement) return null;
  return (
    <div className="tool-section">
      <h3>Properties</h3>
      {selectedElement.type === 'text' && (
        <>
          <label>Text Content</label>
          <textarea 
            value={selectedElement.content} 
            onChange={e => updateSelected('content', e.target.value)} 
            style={{ width: '100%', minHeight: '60px', padding: '8px', marginBottom: '10px', fontFamily: 'var(--font-ui)', border: '1px solid var(--border)', borderRadius: '4px', boxSizing: 'border-box' }}
          />

          <label>Width (px)</label>
          <input type="number" placeholder="Auto" value={selectedElement.width || ''} onChange={e => updateSelected('width', e.target.value ? Number(e.target.value) : undefined)} style={{ width: '100%', padding: '6px', marginBottom: '10px', boxSizing: 'border-box' }} />

          <label>Font Size</label>
          <input type="range" min="10" max="150" value={selectedElement.fontSize || 32} onChange={e => updateSelected('fontSize', Number(e.target.value))} style={{ width: '100%' }} />
          <label>Color</label>
          <input type="color" value={selectedElement.color || '#000000'} onChange={e => updateSelected('color', e.target.value)} />
          <label>Font Family</label>
          <select value={selectedElement.font || 'Outfit'} onChange={e => updateSelected('font', e.target.value)} style={{ width: '100%' }}>
            <option value="Outfit">Outfit</option>
            <option value="Cormorant Garamond">Cormorant Garamond</option>
            <option value="Great Vibes">Great Vibes</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Lato">Lato</option>
            <option value="Dancing Script">Dancing Script</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Lora">Lora</option>
            <option value="Amatic SC">Amatic SC</option>
          </select>
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <button 
              onClick={() => updateSelected('isBold', !selectedElement.isBold)}
              style={{ flex: 1, fontWeight: 'bold', background: selectedElement.isBold ? '#e0e0e0' : '#fff' }}
            >B</button>
            <button 
              onClick={() => updateSelected('isItalic', !selectedElement.isItalic)}
              style={{ flex: 1, fontStyle: 'italic', background: selectedElement.isItalic ? '#e0e0e0' : '#fff' }}
            >I</button>
            <button 
              onClick={() => updateSelected('isUnderline', !selectedElement.isUnderline)}
              style={{ flex: 1, textDecoration: 'underline', background: selectedElement.isUnderline ? '#e0e0e0' : '#fff' }}
            >U</button>
          </div>
        </>
      )}
      {selectedElement.type === 'card' && (
        <>
          <label>Background Color</label>
          <input type="color" value={selectedElement.bgColor || '#ffffff'} onChange={e => updateSelected('bgColor', e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          
          <label>Card Opacity: {Math.round((typeof selectedElement.opacity === 'undefined' ? 1 : selectedElement.opacity) * 100)}%</label>
          <input type="range" min="0" max="100" value={(typeof selectedElement.opacity === 'undefined' ? 1 : selectedElement.opacity) * 100} onChange={e => updateSelected('opacity', Number(e.target.value) / 100)} style={{ width: '100%', marginBottom: '10px' }} />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input type="checkbox" checked={selectedElement.isGlass} onChange={e => updateSelected('isGlass', e.target.checked)} />
            Glassmorphism Effect
          </label>
        </>
      )}
      {selectedElement.type === 'image' && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Width (px)</label>
              <input type="number" value={Math.round(selectedElement.width)} onChange={e => updateSelected('width', Number(e.target.value))} style={{ width: '100%', padding: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Height (px)</label>
              <input type="number" value={Math.round(selectedElement.height)} onChange={e => updateSelected('height', Number(e.target.value))} style={{ width: '100%', padding: '6px' }} />
            </div>
          </div>
          
          <label>Opacity: {Math.round((typeof selectedElement.opacity === 'undefined' ? 1 : selectedElement.opacity) * 100)}%</label>
          <input type="range" min="10" max="100" value={(typeof selectedElement.opacity === 'undefined' ? 1 : selectedElement.opacity) * 100} onChange={e => updateSelected('opacity', Number(e.target.value) / 100)} style={{ width: '100%' }} />
          
          <label>Roundness (Border Radius)</label>
          <input type="range" min="0" max="250" value={typeof selectedElement.borderRadius === 'undefined' ? 4 : selectedElement.borderRadius} onChange={e => updateSelected('borderRadius', Number(e.target.value))} style={{ width: '100%' }} />
        </>
      )}
      <button style={{ background: '#ff4d4f', color: 'white', marginTop: '10px', width: '100%', borderColor: '#ff4d4f' }} onClick={deleteSelected}>Delete Element</button>
      <button style={{ marginTop: '5px', width: '100%' }} onClick={() => setSelectedId(null)}>Deselect</button>
    </div>
  );
}
