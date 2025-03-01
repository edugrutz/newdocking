import React, { useEffect, useState } from 'react'
import ResultViewer from './ResultViewer';

const Result = ({results, selectedResult}) => {

  const [viewerData, setViewerData] = React.useState([]);

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
        <ResultViewer viewerData={viewerData} selectedResult={selectedResult} setData={setData}/>
    </div>
  )
}

export default Result