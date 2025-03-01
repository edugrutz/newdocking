import React, { useEffect } from 'react'
import BoxConfig from './BoxConfig'
import DockViewer from './DockViewer'

const DockingOptions = ({molViewer, molName, preparedLigand}) => {

  useEffect(() => {
    if (preparedLigand) {
      (document.getElementById('ligand') as HTMLInputElement).placeholder = preparedLigand;
    }
    console.log("mudou")
  }, [preparedLigand])

  return (
    <div className='border p-2 mt-2'>
      <BoxConfig />
      <div className='d-flex'>
      <div className='mt-2'>
        <div className='m-2 p-2'>
            <label>Receptor</label>
            <input type='text' className='form-control' disabled/>

            <label className='mt-2'>Ligand</label>
            <input id='ligand' type='text' className='form-control' disabled/>

            <label className='mt-4'>Result name</label>
            <input type='text' className='form-control'/>

            <button className='btn btn-warning mt-2'>Dock</button>
        </div>
      </div>
      <div>
        <DockViewer molViewer={molViewer} molName={molName}/>
      </div>
    </div>
    </div>
    
    
  )
}

export default DockingOptions