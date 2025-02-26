import React from 'react'
import BoxConfig from './BoxConfig'

const DockingOptions = () => {
  return (
    <div className='border mt-2'>
        <BoxConfig />

        <div className='m-2 p-2'>
            <label>Receptor</label>
            <input type='text' className='form-control w-50' disabled/>

            <label className='mt-2'>Ligand</label>
            <input type='text' className='form-control w-50' disabled/>

            <label className='mt-4'>Result name</label>
            <input type='text' className='form-control w-50'/>

            <button className='btn btn-warning mt-2'>Dock</button>
        </div>
    </div>
  )
}

export default DockingOptions