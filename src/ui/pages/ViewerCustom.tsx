import { SurfaceType } from '3dmol';
import React, { useEffect } from 'react'

interface ViewerCustomProps {
    viewer: any;
    refreshViewer: () => void;
    format: any;
}

const ViewerCustom: React.FC<ViewerCustomProps> = ({viewer, refreshViewer, format}) => {

    const [surface, setSurface] = React.useState(false);
    const [style, setStyle] = React.useState(false);
    const [white, setWhite] = React.useState(false);

    function changeStyle() {
        if (style) {
            if (format === 'receptor') {
                if (white) {
                    viewer.current.setStyle({}, {cartoon: {color: 'white'}});
                } else {
                    viewer.current.setStyle({}, {cartoon: {color: 'spectrum'}});
                }
            }
            if (format === 'ligand') {
                if (white) {
                    viewer.current.setStyle({}, {line: {color: 'white'}});
                } else {
                    viewer.current.setStyle({}, {line: {color: 'spectrum'}});
                }
            }
            setStyle(false);
        } else {
            if (format === 'receptor') {
                if (white) {
                    viewer.current.setStyle({}, {stick: {color: 'white'}});
                } else {
                    viewer.current.setStyle({}, {stick: {color: 'spectrum'}});
                }
            }
            if (format === 'ligand') {
                if (white) {
                    viewer.current.setStyle({}, {stick: {color: 'white'}});
                } else {
                    viewer.current.setStyle({}, {stick: {color: 'spectrum'}});
                }
            }
            setStyle(true);
        }
        refreshViewer();
    }

    function changeSurface() {
        if (format === 'receptor') {
            if (surface) {
                viewer.current.removeAllSurfaces();
                setSurface(false);
            } else {
                viewer.current.addSurface(SurfaceType.VDW, {opacity: 0.7, color: 'white'});
                setSurface(true);
            }
            refreshViewer();
        }
    }

    function changeColor() {
        if (white) {
            if (format === 'receptor') {
                if (style) {
                    viewer.current.setStyle({}, {stick: {color: 'spectrum'}});
                } else {
                    viewer.current.setStyle({}, {cartoon: {color: 'spectrum'}});
                }
            }
            if (format === 'ligand') {
                if (style) {
                    viewer.current.setStyle({}, {stick: {color: 'spectrum'}});
                } else {
                    viewer.current.setStyle({}, {line: {color: 'spectrum'}});
                }
            }
            setWhite(false);
        } else {
            if (format === 'receptor') {
                if (style) {
                    viewer.current.setStyle({}, {stick: {color: 'white'}});
                } else {
                    viewer.current.setStyle({}, {cartoon: {color: 'white'}});
                }
            }
            if (format === 'ligand') {
                if (style) {
                    viewer.current.setStyle({}, {stick: {color: 'white'}});
                } else {
                    viewer.current.setStyle({}, {line: {color: 'white'}});
                }
            }
            setWhite(true);
        }
        refreshViewer();
    }


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
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={changeStyle}>Style</button>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={changeSurface}>Surface</button>
            <button className='btn btn-sm border border-secondary text-secondary mt-2' onClick={changeColor}>Color</button>
        </div>
    </div>
  )
}

export default ViewerCustom