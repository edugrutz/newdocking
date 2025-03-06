import { useRef, useEffect, useState } from 'react';
import * as $3Dmol from '3dmol';

interface DockViewerProps {
  molViewer: any;
  molName: string;
  sizeBox: number[];
  centerBox: number[];
}

const DockViewer: React.FC<DockViewerProps> = ({molViewer, molName, sizeBox, centerBox}) => {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef<$3Dmol.GLViewer | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const box = true;

  useEffect(() => {
    if (viewerContainerRef.current) {
        if (!viewerRef.current) {
            viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'black' });
        }
      if (molViewer)
      {
        viewerRef.current.clear();
        viewerRef.current.addModel(molViewer, 'pdb');
        viewerRef.current.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewerRef.current.zoomTo();
        viewerRef.current.render();
      }

      if (box) {
        const shape = viewerRef.current.addShape({ color: 'red' });
        shape.addBox({
          corner: { x: centerBox[0], y: centerBox[1], z: centerBox[2] },
          dimensions: { w: sizeBox[0], h: sizeBox[1], d: sizeBox[2] }
        });
        shape.opacity = 0.7;
        viewerRef.current.render();
      }
    }
  }, [molViewer, sizeBox, centerBox]);

  return (
    <div>
      <h4>{molName}</h4>
      <div className='position-relative'>
        {darkMode ?
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {if (viewerRef.current) { viewerRef.current.setBackgroundColor('white', 1); setDarkMode(false); }}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle-fill"></i></button>
          :
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {if (viewerRef.current) { viewerRef.current.setBackgroundColor('black', 1); setDarkMode(true); }}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle"></i></button>
        }
        <div ref={viewerContainerRef} style={{ width: '600px', height: '450px', position: 'relative' }}></div>
      </div>
    </div>
  );
};

export default DockViewer;