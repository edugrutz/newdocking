import { useRef, useEffect, useState } from 'react';
import * as $3Dmol from '3dmol';

const Viewer = () => {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (viewerContainerRef.current) {
      viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'white' });

      // Carregar o modelo PDB
      $3Dmol.download('pdb:1CRN', viewerRef.current, {}, () => {
        viewerRef.current.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewerRef.current.zoomTo();
        viewerRef.current.render();
      });
    }
  }, []);

  return (
    <div>
      <div className='position-relative'>
        {darkMode ?
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {viewerRef.current.setBackgroundColor('white'); setDarkMode(false)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle-fill"></i></button>
          :
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {viewerRef.current.setBackgroundColor('black'); setDarkMode(true)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle"></i></button>
        }
        <div ref={viewerContainerRef} style={{ width: '100%', height: '400px', position: 'relative' }}></div>
      </div>
    </div>
  );
};

export default Viewer;