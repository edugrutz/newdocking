import {useState} from 'react'
import Receptor from './DockingFiles/Receptor'
import Ligand from './DockingFiles/Ligand'
import DockingOptions from './DockingFiles/DockingOptions'

const Docking = ({receptors, ligands}) => {

  const [molName, setMolName] = useState('')
  const [selectedReceptor, setSelectedReceptor] = useState('')

  return (
    <div>
      <Receptor receptors={receptors} setSelectedReceptor={setSelectedReceptor}/>
      <Ligand ligands={ligands}/>
      <DockingOptions molViewer={selectedReceptor} molName={molName}/>
    </div>
  )
}

export default Docking