import { SurfaceType } from '3dmol';
import { MeshDoubleLambertMaterial } from '3dmol/build/types/WebGL';
import React from 'react'

const ViewerCustom = ({viewer, refreshViewer}) => {

    const [surface, setSurface] = React.useState(false);
    const [style, setStyle] = React.useState(false);
    const [white, setWhite] = React.useState(false);

  return (
    <div className='d-flex'>
        <div>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => {viewer.current.zoom(1.1)}}><i className="bi bi-zoom-in"></i></button>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => viewer.current.zoom(0.9)}><i className="bi bi-zoom-out"></i></button>
        </div>
        <div>
          <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => viewer.current.rotate(5)}><i className="bi bi-arrow-clockwise"></i></button>
          <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => viewer.current.rotate(-5)}><i className="bi bi-arrow-counterclockwise"></i></button>
          <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => viewer.current.rotate(5, 'x')}><i className="bi bi-arrow-up"></i></button>
          <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => viewer.current.rotate(-5, 'x')}><i className="bi bi-arrow-down"></i></button>
        </div>  
        <div className='ms-auto'>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => {
                if (!style) {
                    viewer.current.setStyle({stick: {}}); 
                    setStyle(true);
                }
                else {
                    viewer.current.setStyle({cartoon: {color:'spectrum'}});
                    setStyle(false);
                }
                refreshViewer();
            }}>Stick</button>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => {
                if (surface) {
                    viewer.current.removeAllSurfaces();
                    setSurface(false);
                }
                else {
                    viewer.current.addSurface(SurfaceType.VDW, {opacity:0.85});
                    setSurface(true);
                }
                refreshViewer();
            }}>Surface</button>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={() => {
                if (white) {
                    viewer.current.setStyle({cartoon: {color: 'spectrum'}}); 
                    setWhite(false);
                }
                else {
                    viewer.current.setStyle({cartoon: {color: 'white'}});
                    setWhite(true);
                }
                refreshViewer();
            }}>Color</button>
        </div>
    </div>
  )
}

export default ViewerCustom