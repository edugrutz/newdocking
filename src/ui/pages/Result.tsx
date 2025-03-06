import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ResultViewer from './ResultViewer';
import ResultSummary from './ResultSummary';

interface ResultProps {
  results: any;
  selectedResult: any;
  getFiles: () => void;
}

const Result: React.FC<ResultProps> = ({results, selectedResult, getFiles}) => {

  const [viewerData, setViewerData] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('viewer');

  const navigate = useNavigate();

  useEffect(() => {
    SplitResult();
  }, [selectedResult]);

  async function SplitResult() {
    const selectedResultPath = results.find((result: { name: any; }) => result.name === selectedResult).filePath;
    await window.electron.splitResult(selectedResultPath);
    const data = await window.electron.listSplit();
    await changeToPdb(data);
  }

  async function changeToPdb(data: string | any[]) {
    console.log('changeToPdb');
    let folder = await window.electron.getTempsFolderPath('temp/split')
        for (let i = 1; i < data.length; i++) {
            const atualPath = data[i].filePath;
            const fileNameWithoutExtension = data[i].name.replace(/\.pdbqt$/, '');
            const change = await window.electron.spawn('obabel', ['-ipdbqt', atualPath, '-opdb', '-O', `${folder}/${fileNameWithoutExtension}.pdb`]);
            // await window.electron.dellFile(atualPath);
        }
    setData();
  }

  async function setData() {
    console.log('setData');
    const data = await window.electron.listSplit();
    const pdbFiles = data.filter((file: { name: string; }) => file.name.endsWith('.pdb')); // Filtra apenas .pdb
    setViewerData(pdbFiles); // Passa apenas os arquivos filtrados
  }

  async function dellResult() {
    const resultPath = await window.electron.findFile('result', selectedResult);
    const resultRecPath = await window.electron.findFile('resultRec', selectedResult);
    await window.electron.dellFile(resultPath);
    await window.electron.dellFile(resultRecPath);
    await getFiles();
    navigate('/');
  }

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h2>Result: <strong>{selectedResult}</strong></h2> 
        <button className='btn btn-outline-danger' onClick={dellResult}><i className="bi bi-trash"></i></button>
      </div>     
        <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link text-light ${activeTab === 'viewer' ? 'active text-dark' : ''}`} onClick={() => setActiveTab('viewer')}>
            Result
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link text-light ${activeTab === 'summary' ? 'active text-dark' : ''}`} onClick={() => setActiveTab('summary')}>
            Summary
          </button>
        </li>
      </ul>
        {activeTab === 'viewer' && (
          <ResultViewer viewerData={viewerData} selectedResult={selectedResult} activeTab={activeTab}/>
        )}
        {activeTab === 'summary' && (
          <ResultSummary viewerData={viewerData}/>  
        )}
    </div>
  )
}

export default Result