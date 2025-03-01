import {useRef, useEffect, useState, use} from 'react'
import * as $3Dmol from '3dmol'

const ResultViewer = ({viewerData, selectedResult, setData}) => {

    const viewerContainerRef = useRef(null);
    const viewerRef = useRef(null);
    const [darkMode, setDarkMode] = useState(true);
    const [resultNumber, setResultNumber] = useState(1);
    const [viewerMol, setViewerMol] = useState(null);

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

    useEffect(() => {
        Split();
    }
    , [selectedResult]);

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
    }, [resultNumber]);

    async function showViewer() {
        console.log(viewerData);
        if (viewerContainerRef.current) {
            if (!viewerRef.current) {
                viewerRef.current = $3Dmol.createViewer(viewerContainerRef.current, { backgroundColor: 'black' });
            }
            viewerRef.current.clear();

            const firstModel = viewerRef.current.addModel(viewerMol, 'pdb');
            viewerRef.current.setStyle({model: firstModel}, { cartoon: { color: 'spectrum' } });

            const secondModel = viewerRef.current.addModel(viewerData[resultNumber].data, 'pdb');
            // viewerRef.current.setStyle({model: secondModel}, {stick:{} });

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
    <div>
        <div className='btn-group'>
            <button className='btn btn-primary' onClick={()=> {changeResultNumber(-1)}}>Previous</button>
            <button className='btn btn-primary' onClick={()=> {changeResultNumber(+1)}}>Next</button>
        </div>
        <div ref={viewerContainerRef} style={{ width: '400px', height: '425px', position: 'relative' }}></div>
    </div>
  )
}

export default ResultViewer