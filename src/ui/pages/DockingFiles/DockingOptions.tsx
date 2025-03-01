import React, { useEffect } from 'react'
import BoxConfig from './BoxConfig'
import DockViewer from './DockViewer'

const DockingOptions = ({molViewer, molName, preparedLigand, preparedReceptor, setResultName, Dock, setCenterBox, setSizeBox, centerBox, sizeBox}) => {

  // Atualiza os nomes das moleculas preparadas
  useEffect(() => {
    if (preparedLigand) {
      (document.getElementById('ligand') as HTMLInputElement).placeholder = preparedLigand;
    }
    if (preparedReceptor) {
      (document.getElementById('receptor') as HTMLInputElement).placeholder = preparedReceptor;
    }
  }, [preparedLigand, preparedReceptor])

  // Atualiza o nome do resultado
  const handleChange = (event) => {
    const value = event.target.value;
    setResultName(value);
  }

  return (
    <div className='border p-2 mt-2'>
      <BoxConfig setSizeBox={setSizeBox} setCenterBox={setCenterBox} centerBox={centerBox} sizeBox={sizeBox}/>
      <div className='d-flex'>
      <div className='mt-2'>
        <div className='m-2 p-2'>
            <label>Receptor</label>
            <input id='receptor' type='text' className='form-control' disabled/>

            <label className='mt-2'>Ligand</label>
            <input id='ligand' type='text' className='form-control' disabled/>

            <label className='mt-4'>Result name</label>
            <input onChange={handleChange} type='text' className='form-control'/>

            <button className='btn btn-warning mt-2' disabled={!preparedLigand || !preparedReceptor} onClick={Dock}>Dock</button>
        </div>
      </div>
      <div>
        <DockViewer molViewer={molViewer} molName={molName} sizeBox={sizeBox} centerBox={centerBox}/>
      </div>
    </div>
    </div>
    
    
  )
}

export default DockingOptions