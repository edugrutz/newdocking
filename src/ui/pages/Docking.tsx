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

  const[centerBox, setCenterBox] = useState([0, 0, 0]);
  const[sizeBox, setSizeBox] = useState([20, 20, 20]);

  const [loading, setLoading] = useState(false);

  // Docking
  const Dock = async () => {
    try{
    setLoading(true);
    const receptorPath = await window.electron.findFile('temp', 'preparedReceptor');
    const ligandPath = await window.electron.findFile('temp', 'mkLigand');

    // Faz uma cópia do receptor preparado para poder ser exibido sempre no seu resultado
    const copyReceptor = await window.electron.copyReceptor(receptorPath + '.pdbqt', resultName + '.pdbqt');

    const configPath = await window.electron.findFile('temp', 'config.txt');
    const outputPath = await window.electron.getOutputPath('results', resultName + '.pdbqt');

    await window.electron.generateConfigFile(centerBox, sizeBox);

    const vina = await window.electron.spawn('vina', [
      '--receptor', receptorPath + '.pdbqt',
       '--ligand', ligandPath + '.pdbqt',
       '--config', configPath,
        '--out', outputPath]);

    getFiles();

    } catch (error) {
      console.error("Erro ao realizar o docking", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Receptor receptors={receptors} setSelectedReceptor={setSelectedReceptor} setPreparedReceptor={setPreparedReceptor}/>
      <Ligand ligands={ligands} setPreparedLigand={setPreparedLigand}/>
      <DockingOptions molViewer={selectedReceptor} molName={molName} preparedLigand={preparedLigand} preparedReceptor={preparedReceptor} setResultName={setResultName} Dock={Dock} setCenterBox={setCenterBox} setSizeBox={setSizeBox} centerBox={centerBox} sizeBox={sizeBox} loading={loading}/>
    </div>
  )
}

export default Docking