import { useRef, useEffect, useState } from 'react';
import * as $3Dmol from '3dmol';
import ViewerCustom from './ViewerCustom';

const Viewer = ({molViewer, molFormat, molName}) => {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (viewerContainerRef.current) {
      viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'black' });
      viewerRef.current.addModel(molViewer, molFormat);
      if (molFormat === 'pdb') {
        viewerRef.current.setStyle({}, { cartoon: {color:'spectrum'} });
      }
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    }
  }, [molViewer]);

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
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {viewerRef.current.setBackgroundColor('white'); setDarkMode(false)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle-fill"></i></button>
          :
          <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {viewerRef.current.setBackgroundColor('black'); setDarkMode(true)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle"></i></button>
        }
        <div ref={viewerContainerRef} style={{ width: '100%', height: '425px', position: 'relative' }}></div>
      <ViewerCustom viewer={viewerRef} refreshViewer={() => setRefresh(prev => prev + 1)}/>
      </div>
    </div>
  );
};

export default Viewer;