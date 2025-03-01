import {useState} from 'react'
import Receptor from './DockingFiles/Receptor'
import Ligand from './DockingFiles/Ligand'
import DockingOptions from './DockingFiles/DockingOptions'

const Docking = ({receptors, ligands}) => {

  const [molName, setMolName] = useState('')
  const [selectedReceptor, setSelectedReceptor] = useState('')
  const [preparedLigand, setPreparedLigand] = useState('')
  const [preparedReceptor, setPreparedReceptor] = useState('')

  // Função para realizar o docking
  const Dock = async () => {
    const receptorPath = window.electron.findFile('temp', 'preparedReceptor');
    console.log(receptorPath);
    const ligandPath = window.electron.findFile('temp', 'preparedLigand');
    console.log(ligandPath);
  };

  return (
    <div>
      <Receptor receptors={receptors} setSelectedReceptor={setSelectedReceptor} setPreparedReceptor={setPreparedReceptor}/>
      <Ligand ligands={ligands} setPreparedLigand={setPreparedLigand}/>
      <DockingOptions molViewer={selectedReceptor} molName={molName} preparedLigand={preparedLigand} preparedReceptor={preparedReceptor} Dock={Dock}/>
    </div>
  )
}

export default Docking