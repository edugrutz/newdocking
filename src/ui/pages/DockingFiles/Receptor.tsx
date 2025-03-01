import React from 'react';

const Receptor = ({ receptors, setSelectedReceptor, setPreparedReceptor }) => {

    const [selectedReceptorPath, setSelectedReceptorPath] = React.useState(null);
    const [selectedReceptorName, setSelectedReceptorName] = React.useState(null);

    const handleSelectChange = (event) => {
        const selectedReceptorName = event.target.value;
        const selectedReceptor = receptors.find(receptor => receptor.name === selectedReceptorName);
        if (selectedReceptor) {
            setSelectedReceptor(selectedReceptor.data);
            setSelectedReceptorPath(selectedReceptor.filePath);
        } else {
            setSelectedReceptor(null);
        }
        setSelectedReceptorName(selectedReceptorName);
    };

    // Preparação do receptor
    const prepareReceptor = async () => {
        if (!selectedReceptorPath) {
            console.log('No receptor selected');
            return;
        }
        try {
            const outputPath = await window.electron.getOutputPath('temp','preparedReceptor.pdbqt');
            const output = await window.electron.spawn('prepare_receptor', ['-r', selectedReceptorPath, '-o', outputPath]);
            setPreparedReceptor(selectedReceptorName);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="border p-2" style={{ flex: '1' }}>
            <label htmlFor="receptor-select">Select Receptor</label>
            <select className="form-select w-50" id="receptor-select" onChange={handleSelectChange}>
                <option value="">Select a receptor</option>
                {receptors.map((receptor, index) => (
                    <option key={index} value={receptor.name}>
                        {receptor.name}
                    </option>
                ))}
            </select>
            <button className="btn btn-secondary mt-2" onClick={prepareReceptor}>Prepare Receptor</button>
        </div>
    );
};

export default Receptor;