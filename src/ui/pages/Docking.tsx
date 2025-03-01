import {useState} from 'react'
import Receptor from './DockingFiles/Receptor'
import Ligand from './DockingFiles/Ligand'
import DockingOptions from './DockingFiles/DockingOptions'

const Docking = ({receptors, ligands, getFiles}) => {

  const [molName, setMolName] = useState('')
  const [selectedReceptor, setSelectedReceptor] = useState('')
  const [preparedLigand, setPreparedLigand] = useState('')
  const [preparedReceptor, setPreparedReceptor] = useState('')
  const [resultName, setResultName] = useState('')

  // Docking
  const Dock = async () => {
    const receptorPath = await window.electron.findFile('temp', 'preparedReceptor');
    const ligandPath = await window.electron.findFile('temp', 'mkLigand');

    const configPath = await window.electron.findFile('temp', 'config.txt');
    const outputPath = await window.electron.getOutputPath('results', resultName + '.pdbqt');

    const vina = await window.electron.spawn('vina', [
      '--receptor', receptorPath + '.pdbqt',
       '--ligand', ligandPath + '.pdbqt',
       '--config', configPath,
        '--out', outputPath]);

    getFiles();
  };

  return (
    <div>
      <Receptor receptors={receptors} setSelectedReceptor={setSelectedReceptor} setPreparedReceptor={setPreparedReceptor}/>
      <Ligand ligands={ligands} setPreparedLigand={setPreparedLigand}/>
      <DockingOptions molViewer={selectedReceptor} molName={molName} preparedLigand={preparedLigand} preparedReceptor={preparedReceptor} setResultName={setResultName} Dock={Dock}/>
    </div>
  )
}

export default Docking