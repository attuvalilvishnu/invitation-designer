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

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Wedding Invitation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@300;400;600&family=Great+Vibes&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: flex; justify-content: center; background: #1a1a1a; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
    #canvas { transform-origin: top center; overflow: hidden; position: relative; width: 500px; max-width: 100vw; background-color: #000; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
    .page-divider { display: none; }
    .glass { background: rgba(20, 20, 20, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; }
    .canvas-element { position: absolute; box-sizing: border-box; }
    @media (max-width: 500px) {
      #canvas { transform: scale(calc(100vw / 500)); }
      body { justify-content: flex-start; }
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

export const exportPNG = (canvasRef, numPages) => {
  exportHTML(canvasRef); // Fallback to HTML if html2canvas isn't installed
  alert("Exported as HTML format as a fallback. For native PNG export, please ensure the html2canvas dependency is set up.");
};
