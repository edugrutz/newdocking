import { useEffect, useState } from 'react';

const Ligand = ({ ligands }) => {
  const [selectedLigand, setSelectedLigand] = useState('');

  const handleSelectChange = (event) => {
    const selectedLigandName = event.target.value;
    const selectedLigand = ligands.find(ligand => ligand.name === selectedLigandName);
    if (selectedLigand) {
      setSelectedLigand(selectedLigand.filePath);
    }
  };

  const PrepareLigand = async () => {
    if (!selectedLigand) {
      return;
    }
    try {
      const output = await window.electron.spawn('obabel', ['-i', 'sdf', selectedLigand, '-o', 'pdb', '-O', 'preparedLigand.pdb']);
      console.log(output);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border p-2 mt-2" style={{ flex: '1' }}>
      <label htmlFor="ligand-select">Select Ligand</label>
      <select className="form-select w-50" id="ligand-select" onChange={handleSelectChange}>
        <option value="">Select a ligand</option>
        {ligands.map((ligand, index) => (
          <option key={index} value={ligand.name}>{ligand.name}</option>
        ))}
      </select>
      <button className="btn btn-secondary mt-2" onClick={PrepareLigand}>Prepare Ligand</button>
    </div>
  );
};

export default Ligand;