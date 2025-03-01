import {useState} from 'react'
import Receptor from './DockingFiles/Receptor'
import Ligand from './DockingFiles/Ligand'
import DockingOptions from './DockingFiles/DockingOptions'

const Docking = ({receptors, ligands}) => {

  const [molName, setMolName] = useState('')
  const [selectedReceptor, setSelectedReceptor] = useState('')
  const [preparedLigand, setPreparedLigand] = useState('')

  return (
    <div>
      <Receptor receptors={receptors} setSelectedReceptor={setSelectedReceptor}/>
      <Ligand ligands={ligands} setPreparedLigand={setPreparedLigand}/>
      <DockingOptions molViewer={selectedReceptor} molName={molName} preparedLigand={preparedLigand}/>
    </div>
  )
}

export default Docking