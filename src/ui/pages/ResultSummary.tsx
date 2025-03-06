import React from 'react'

interface ReceptorData {
  data: string;
}

interface ResultSummaryProps {
  viewerData: ReceptorData[];
}

const ResultSummary: React.FC<ResultSummaryProps> = ({viewerData}) => {

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
            {viewerData.map((receptor: ReceptorData, index: number) => {
            const energyLine: string | undefined = receptor.data.split('\n').find((line: string) => line.startsWith('REMARK VINA RESULT'));
            const energy: string = energyLine ? energyLine.split(/\s+/)[3] : 'N/A';
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