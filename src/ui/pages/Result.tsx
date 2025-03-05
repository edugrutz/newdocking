import React, { useEffect, useState } from 'react'
import ResultViewer from './ResultViewer';
import ResultSummary from './ResultSummary';

const Result = ({results, selectedResult}) => {

  const [viewerData, setViewerData] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('viewer');

  useEffect(() => {
    SplitResult();
  }, [selectedResult]);

  async function SplitResult() {
    const selectedResultPath = results.find(result => result.name === selectedResult).filePath;
    await window.electron.splitResult(selectedResultPath);
    const data = await window.electron.listSplit();
    await changeToPdb(data);
  }

  async function changeToPdb(data) {
    let folder = await window.electron.getTempsFolderPath('temp/split')
        for (let i = 1; i < data.length; i++) {
            const atualPath = data[i].filePath;
            const fileNameWithoutExtension = data[i].name.replace(/\.pdbqt$/, '');
            await window.electron.spawn('obabel', ['-ipdbqt', atualPath, '-opdb', '-O', `${folder}/${fileNameWithoutExtension}.pdb`]);
            // await window.electron.dellFile(atualPath);
        }
    setData();
  }

  async function setData() {
    const data = await window.electron.listSplit();
    const pdbFiles = data.filter(file => file.name.endsWith('.pdb')); // Filtra apenas .pdb
    setViewerData(pdbFiles); // Passa apenas os arquivos filtrados
  }

  return (
    <div>
        <h2>Result: <strong>{selectedResult}</strong></h2>
        <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link text-light ${activeTab === 'viewer' ? 'active text-dark' : ''}`} onClick={() => setActiveTab('viewer')}>
            Viewer
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