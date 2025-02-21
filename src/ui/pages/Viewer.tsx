import {useRef, useEffect} from 'react'
import { createViewer } from '3dmol'

const Viewer = () => {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    viewerRef.current = createViewer(viewerContainerRef.current, {backgroundColor: 'white'});
    viewerRef.current.addModel('pdb', 'https://files.rcsb.org/download/1CRN.pdb', {keepH: true});
    viewerRef.current.zoomTo();
  }, [])

  return (
    <div>
        <div ref={viewerContainerRef} style={{width: '100%', height: '800px'}}></div>
    </div>
  )
}

export default Viewer