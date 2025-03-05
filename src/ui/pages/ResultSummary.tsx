import React from 'react'

const ResultSummary = ({viewerData}) => {

  return (
    <div className="tab-pane fade show active">
      <table className="table bg-light table-bordered mt-4" style={{width: '300px'}}>
        <thead>
          <tr>
            <th scope="col">Position</th>
            <th scope="col">Energy</th>
          </tr>
        </thead>
        <tbody>
          {viewerData.map((receptor, index) => {
            const energyLine = receptor.data.split('\n').find(line => line.startsWith('REMARK VINA RESULT'));
            const energy = energyLine ? energyLine.split(/\s+/)[3] : 'N/A';
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{energy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ResultSummary