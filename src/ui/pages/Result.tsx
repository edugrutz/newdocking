import React from 'react'

const Result = ({results, selectedResult}) => {

  function teste() {
    const selectedResultPath = results.find(result => result.name === selectedResult).filePath;

    window.electron.splitResult(selectedResultPath).then((result) => {
      console.log(result);
    }
    ).catch((error) => {
      console.error(error);
    }
    );
  }

  return (
    <div>
        <h1>{selectedResult}</h1>
        <button className='btn btn-warning' onClick={teste}>Teste</button>
    </div>
  )
}

export default Result