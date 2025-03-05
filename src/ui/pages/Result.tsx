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
    const split = await window.electron.splitResult(selectedResultPath);
    setData();
  }

  async function setData() {
    const data = await window.electron.listSplit();
    setViewerData(data);
  }

  return (
    <div>
        <h1>{selectedResult}</h1>
        <div>
          <button className='btn btn-warning' onClick={() => setActiveTab('viewer')}>Viewer</button>
          <button className='btn btn-warning ms-2' onClick={() => setActiveTab('summary')}>Summary</button>
        </div>
        {activeTab === 'viewer' && (
          <ResultViewer viewerData={viewerData} selectedResult={selectedResult} setData={setData}/>
        )}
        {activeTab === 'summary' && (
          <ResultSummary viewerData={viewerData}/>  
        )}
    </div>
  )
}

export default Result