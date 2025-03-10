import { useRef, useEffect, useState } from 'react';
import * as $3Dmol from '3dmol';
import ViewerCustom from './ViewerCustom';
import type { AppProps } from '../App';

const Viewer: React.FC<Partial<AppProps>> = ({ molViewer, molFormat, molName, format }) => {
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<$3Dmol.GLViewer | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (viewerContainerRef.current && molViewer && molFormat) {
      viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'black' });
      viewerRef.current.addModel(molViewer, molFormat);
      if (molFormat === 'pdb') {
        viewerRef.current.setStyle({}, { cartoon: { color: 'spectrum' } });
      }
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    }
  }, [molViewer, molFormat]);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.render();
    }
  }, [refresh]);

  return (
    <div>
      <h1>{molName}</h1>
      <div className='position-relative'>
        {darkMode ?
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => { if (viewerRef.current) { viewerRef.current.setBackgroundColor('white', 1); } setDarkMode(false) }} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}><i className="bi bi-circle-fill"></i></button>
          :
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => { if (viewerRef.current) { viewerRef.current.setBackgroundColor('black', 1); } setDarkMode(true) }} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}><i className="bi bi-circle"></i></button>
        }
        <div ref={viewerContainerRef} style={{ width: '100%', height: '625px', position: 'relative' }}></div>
        <ViewerCustom viewer={viewerRef} refreshViewer={() => setRefresh(prev => prev + 1)} format={format}/>
      </div>
    </div>
  );
};

export default Viewer;