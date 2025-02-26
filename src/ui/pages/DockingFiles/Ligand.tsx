import React from 'react'

const Ligand = () => {
  return (
        <div className="border p-2 mt-2" style={{flex: '1'}}>
            <label htmlFor="">Select Ligand</label>
            <select className="form-select w-50" name="" id=""> </select>
            <button className="btn btn-secondary mt-2">Prepare Ligand</button>
        </div>
  )
}

export default Ligand