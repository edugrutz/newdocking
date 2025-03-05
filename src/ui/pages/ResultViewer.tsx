import {useRef, useEffect, useState, use} from 'react'
import * as $3Dmol from '3dmol'

const ResultViewer = ({viewerData, selectedResult, setData}) => {

    const viewerContainerRef = useRef(null);
    const viewerRef = useRef(null);
    const [darkMode, setDarkMode] = useState(true);
    const [resultNumber, setResultNumber] = useState(1);
    const [viewerMol, setViewerMol] = useState(null);
    const [energyValue, setEnergyValue] = useState(null);

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
        Split();
    }
    , []);

    async function Split() {
        let folder = await window.electron.getTempsFolderPath('temp/split')
        for (let i = 1; i < viewerData.length; i++) {
            const a = window.electron.spawn('obabel', ['-ipdbqt', viewerData[i].filePath, '-opdb', '-O', `${folder}/${viewerData[i].name}.pdb`]);
            // window.electron.dellFile(viewerData[i].filePath);
        }
        setData();
        showViewer();
    }

    useEffect(() => {
        showViewer();
    }, [resultNumber, viewerData]);

    async function showViewer() {
        if (viewerContainerRef.current && viewerMol) {
            if (!viewerRef.current) {
                viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'black' });
            }
            viewerRef.current.clear();

            const firstModel = viewerRef.current.addModel(viewerMol, 'pdb');
            viewerRef.current.setStyle({model: firstModel}, { cartoon: { color: 'spectrum' } });

            const secondModel = viewerRef.current.addModel(viewerData[resultNumber].data, 'pdb');
            const energyLine = viewerData[resultNumber].data.split('\n').find(line => line.includes('REMARK VINA RESULT:'));
            if (energyLine) {
                const energy = energyLine.split(/\s+/)[3];
                console.log(energy);
                viewerRef.current.addLabel(energy, {position: {x: 0, y: 0, z: 0}, backgroundColor: 'black', backgroundOpacity: 0.7});
                setEnergyValue(energy);
            }
            viewerRef.current.setStyle({model: secondModel}, {stick:{} });

            viewerRef.current.zoomTo();
            viewerRef.current.render();
        }
    }

    function changeResultNumber(number) {
        setResultNumber(prev => {
            const newNumber = prev + number;
            if (newNumber < 1 || newNumber > (viewerData.length - 1)) {
                return prev;
            }
            return newNumber;
        });
    }

  return (
    <div className='mt-3'>
        <div className='d-flex align-items-center'>
            <h4>Energy Value: {energyValue ? `${energyValue} kcal/mol` : 'Loading...'}</h4>    
            <div className='btn-group mb-1 ms-3'>
                <button className='btn btn-secondary' onClick={()=> {changeResultNumber(-1)}}>Previous</button>
                <button className='btn btn-secondary' onClick={()=> {changeResultNumber(+1)}}>Next</button>
            </div>
            <h4 className='ms-2'>{resultNumber}/{viewerData.length - 1}</h4>
        </div>
        <div style={{position: 'relative'}}>
            {darkMode ?
                <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {viewerRef.current.setBackgroundColor('white'); setDarkMode(false)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle-fill"></i></button>
                :
                <button className='btn btn-sm border border-secondary text-secondary mb-2' onClick={() => {viewerRef.current.setBackgroundColor('black'); setDarkMode(true)}} style={{position:'absolute', top:'10px', left:'10px', zIndex: 1}}><i className="bi bi-circle"></i></button>
            }
            <div ref={viewerContainerRef} style={{ width: '100%', height: '425px', position: 'relative' }}></div>
        </div>
    </div>
  )
}

export default ResultViewer