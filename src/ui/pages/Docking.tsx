import React from 'react'
import Receptor from './DockingFiles/Receptor'
import Ligand from './DockingFiles/Ligand'
import DockingOptions from './DockingFiles/DockingOptions'

const Docking = () => {
  return (
    <div>
      <Receptor />
      <Ligand />
      <DockingOptions />
    </div>
  )
}

export default Docking