import React from 'react'

const Ligand = ({ligands}) => {
  return (
        <div className="border p-2 mt-2" style={{flex: '1'}}>
            <label htmlFor="">Select Ligand</label>
            <select className="form-select w-50" name="" id=""> 
              <option value=""></option>
              {ligands.map((ligand, index) => (
                <option key={index} value={ligand.name}>{ligand.name}</option>
              ))}
            </select>
            <button className="btn btn-secondary mt-2">Prepare Ligand</button>
        </div>
  )
}

export default Ligand