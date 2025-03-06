import { useEffect, useState } from 'react';

interface LigandProps {
  ligands: any;
  setPreparedLigand: any;
}

const Ligand: React.FC<LigandProps> = ({ ligands, setPreparedLigand }) => {
  const [selectedLigand, setSelectedLigand] = useState('');
  const [selectedLigandName, setSelectedLigandName] = useState('');

  const handleSelectChange = (event: { target: { value: any; }; }) => {
    const selectedLigandName = event.target.value;
    const selectedLigand = ligands.find((ligand: { name: any; }) => ligand.name === selectedLigandName);
    if (selectedLigand) {
      setSelectedLigand(selectedLigand.filePath);
    }
    setSelectedLigandName(selectedLigandName);
  };

  // Preparar ligante
  const PrepareLigand = async () => {
    if (!selectedLigand) {
      console.log('No ligand selected');
      return;
    }
    try {
      const outputPath = await window.electron.getOutputPath('temp','preparedLigand.sdf');
      const output = await window.electron.spawn('obabel', ['-isdf', selectedLigand, '-o', 'sdf', '-O', outputPath, '-h']);
      const outputPath2 = await window.electron.getOutputPath('temp','mkLigand.pdbqt');
      const mk = await window.electron.spawn('mk_prepare_ligand.py', ['-i', outputPath, '-o', outputPath2]);
      setPreparedLigand(selectedLigandName);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border p-2 mt-2" style={{ flex: '1' }}>
      <label htmlFor="ligand-select">Select Ligand</label>
      <select className="form-select w-50" id="ligand-select" onChange={handleSelectChange}>
        <option value="">Select a ligand</option>
        {ligands.map((ligand: { name: string }, index: number) => (
          <option key={index} value={ligand.name}>{ligand.name}</option>
        ))}
      </select>
      <button className="btn btn-secondary mt-2" onClick={PrepareLigand}>Prepare Ligand</button>
    </div>
  );
};

export default Ligand;