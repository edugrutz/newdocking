import React from 'react';

const Receptor = ({ receptors, setSelectedReceptor }) => {

    const handleSelectChange = (event) => {
        const selectedReceptorName = event.target.value;
        const selectedReceptor = receptors.find(receptor => receptor.name === selectedReceptorName);
        if (selectedReceptor) {
            setSelectedReceptor(selectedReceptor.data);
        } else {
            setSelectedReceptor(null);
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
            <button className="btn btn-secondary mt-2">Prepare Receptor</button>
        </div>
    );
};

export default Receptor;