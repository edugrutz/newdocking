import {useRef, useEffect, useState, use} from 'react'
import * as $3Dmol from '3dmol'
import ViewerCustom from './ViewerCustom';

interface ResultViewerProps {
    viewerData: any;
    selectedResult: any;
    activeTab: string;
}

const ResultViewer: React.FC<ResultViewerProps> = ({viewerData, selectedResult, activeTab}) => {

    const viewerContainerRef = useRef(null);
    const viewerRef = useRef<$3Dmol.GLViewer | null>(null);
    const [darkMode, setDarkMode] = useState(true);
    const [resultNumber, setResultNumber] = useState(0);
    const [viewerMol, setViewerMol] = useState(null);
    const [energyValue, setEnergyValue] = useState(null);

    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        if (selectedResult) {
            getReceptorData();
        }
    }, [selectedResult]);

    async function getReceptorData() {
        if (!selectedResult) {
            console.error('No selected result');
            return;
        }
        const receptor = await window.electron.getReceptor(selectedResult);
        setViewerMol(receptor);
    }

    useEffect(() => {
        showViewer();
    }, [resultNumber, viewerData, viewerMol]);

    async function showViewer() {
        if (viewerContainerRef.current && viewerMol && viewerData.length > 0) {
            if (!viewerRef.current) {
                viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'black' });
            }
            viewerRef.current.clear();

            const firstModel = viewerRef.current.addModel(viewerMol, 'pdb');
            viewerRef.current.setStyle({model: firstModel}, { cartoon: { color: 'spectrum' } });
            
            const secondModel = viewerRef.current.addModel(viewerData[resultNumber].data, 'pdb');
            const energyLine = viewerData[resultNumber].data.split('\n').find((line: string | string[]) => line.includes('REMARK VINA RESULT:'));
            if (energyLine) {
                const energy = energyLine.split(/\s+/)[3];
                viewerRef.current.addLabel(energy, {position: {x: 0, y: 0, z: 0}, backgroundColor: 'black', backgroundOpacity: 0.7});
                setEnergyValue(energy);
            }
            viewerRef.current.setStyle({model: secondModel}, {stick:{} });

            viewerRef.current.zoomTo();
            viewerRef.current.render();
        }
    }

    function changeResultNumber(number: number) {
        setResultNumber(prev => {
            const newNumber = prev + number;
            if (newNumber < 0 || newNumber > (viewerData.length - 1)) {
                return prev;
            }
            return newNumber;
        });
    }

    const handleDownload = async () => {
        const filepath = viewerData[resultNumber].filePath;
        const response = await window.electron.downloadResult(filepath);
        if (response.success) {
          alert(`Arquivo salvo em: ${response.filePath}`);
        } else {
          alert('Falha ao salvar o arquivo.');
        }
      };

  return (
    <div className='mt-3'>
        <div className='d-flex align-items-center'>
            <h4>Energy Value: <strong>{energyValue ? `${energyValue} kcal/mol` : 'Loading...'}</strong></h4> 
            <button className='btn btn-sm btn-outline-success mb-2 ms-2' onClick={handleDownload}><i className="bi bi-download"></i></button>
            <div className='d-flex align-items-center ms-auto'>
                <h4 className='ms-2'>{resultNumber + 1}/{viewerData.length}</h4>
                <div className='btn-group mb-1 ms-3'>
                    <button className='btn btn-light' onClick={()=> {changeResultNumber(-1)}}><i className="bi bi-arrow-left"></i></button>
                    <button className='btn btn-light' onClick={()=> {changeResultNumber(+1)}}><i className="bi bi-arrow-right"></i></button>
                </div>
            </div>        
        </div>
        <div style={{position: 'relative'}}>
            {darkMode ?
                <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {if (viewerRef.current) { viewerRef.current.setBackgroundColor('white', 1); } setDarkMode(false)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle-fill"></i></button>
                :
                <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {if (viewerRef.current) { viewerRef.current.setBackgroundColor('black', 1); } setDarkMode(true)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle"></i></button>
            }
            <div ref={viewerContainerRef} style={{ width: '100%', height: '625px', position: 'relative' }}></div>
            <ViewerCustom viewer={viewerRef} refreshViewer={() => setRefresh(prev => prev + 1)}/>
        </div>
    </div>
  )
}

export default ResultViewer