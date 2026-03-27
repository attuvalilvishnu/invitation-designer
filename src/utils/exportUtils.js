import html2canvas from 'html2canvas';
export const generateId = () => Math.random().toString(36).substr(2, 9);

export const exportHTML = (canvasRef) => {
  if (!canvasRef.current) return;
  const clone = canvasRef.current.cloneNode(true);
  
  clone.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected');
    // Remove the resize handle from the exported output
    const handle = el.querySelector('div[style*="absolute"]');
    if (handle && handle.style.right === '-6px') {
        handle.remove();
    }
  });

  const workspace = document.getElementById('workspace');
  let bodyBgCSS = "background: #f4f6f9;";
  if (workspace) {
    const s = workspace.style;
    bodyBgCSS = `background-color: ${s.backgroundColor || '#f4f6f9'};`;
    if (s.backgroundImage && s.backgroundImage !== 'none' && s.backgroundImage !== '') {
       bodyBgCSS += ` background-image: ${s.backgroundImage}; background-size: ${s.backgroundSize || 'cover'}; background-attachment: fixed; background-position: center; background-repeat: no-repeat;`;
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Wedding Invitation</title>
  <meta name="viewport" content="width=500, user-scalable=yes">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Cormorant+Garamond:wght@400;600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Lato:wght@300;400;700&family=Dancing+Script:wght@400;600&family=Pacifico&family=Lora:ital,wght@0,400;0,600;1,400&family=Amatic+SC:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: flex; justify-content: center; font-family: 'Outfit', sans-serif; overflow-x: hidden; ${bodyBgCSS} }
    #canvas { transform-origin: top center; overflow: hidden; position: relative; width: 500px; box-shadow: 0 0 50px rgba(0,0,0,0.5); border-radius: 4px; }
    .page-divider { display: none !important; }
    
    .canvas-element {
      position: absolute;
      box-sizing: border-box;
      font-family: 'Cormorant Garamond', serif;
      line-height: 1.2;
      white-space: pre-wrap;
      min-width: 50px;
      min-height: 20px;
    }
    
    .canvas-element.glass {
      background: rgba(20, 20, 20, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 20px;
      color: white;
      display: block;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    img.canvas-element {
      object-fit: cover;
      pointer-events: none;
    }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'invitation.html';
  a.click();
};

export const exportPNG = async (canvasRef, numPages) => {
  if (!canvasRef.current) return;
  const canvasElement = canvasRef.current;
  
  // Automatically strip UI elements from the canvas natively before taking the picture mathematically
  const selections = canvasElement.querySelectorAll('.selected');
  selections.forEach(el => el.classList.remove('selected'));
  const handles = canvasElement.querySelectorAll('div[style*="absolute"]');
  const removedHandles = [];
  handles.forEach(handle => {
    if (handle.style.right === '-6px') {
        handle.style.display = 'none'; // strictly visually hide exactly for the screenshot explicitly
        removedHandles.push(handle);
    }
  });

  // Apply "Fast Flicker" high-quality mode: 
  // Temporarily unscale the live DOM to 1:1 so html2canvas sees full-size pixels. 
  document.body.classList.add('export-active');

  try {
    // Wait for the browser to recalculate the layout at 1:1 scale
    await new Promise(resolve => setTimeout(resolve, 50));

    const canvas = await html2canvas(canvasElement, {
      scale: 4, // High-quality 4x resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    
    const dataUrl = canvas.toDataURL('image/png');
    
    // trigger download
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'invitation-screenshot.png';
    a.click();
  } catch (error) {
    console.error("Error exporting PNG:", error);
    alert("Failed to export as image natively. Reverting to HTML fallback...");
    exportHTML(canvasRef);
  } finally {
    // Restore mobile layout immediately
    document.body.classList.remove('export-active');
    selections.forEach(el => el.classList.add('selected'));
    removedHandles.forEach(handle => handle.style.display = 'block');
  }
};
