import React from 'react';
import { useNavigate } from 'react-router-dom';

const List = ({ receptors, ligands, results, setMolViewer, setMolFormat, getFiles, setMolName}) => {

    const navigate = useNavigate();

    return (
        <div className='m-2 p-2 overflow-auto text-center' style={{ minWidth: '260px' }}>
            <label>Receptors</label>
            {receptors.map((receptor, index) => (
                <div className='border border-light p-1 d-flex align-items-center mt-1' key={index}>
                    <label onClick={() => {setMolViewer(receptor.data); setMolFormat(receptor.format); setMolName(receptor.name); navigate('/')}} className='p-1 text-truncate'  style={{cursor:'pointer'}}>{receptor.name}</label>
                    <button onClick={() => {window.electron.dellFile(receptor.filePath); getFiles()}} className='btn btn-sm text-danger ms-auto' style={{height:'50%'}}><i className="bi bi-trash"></i></button>
                </div>
            ))} <br />
            <label>Ligands</label>
            {ligands.map((ligand, index) => (
                <div className='border border-light p-1 d-flex align-items-center mt-1' key={index}>
                    <label onClick={() => {setMolViewer(ligand.data); setMolFormat(ligand.format); setMolName(ligand.name); navigate('/')}} className='p-1 text-truncate' style={{cursor:'pointer'}}>{ligand.name}</label>
                    <button onClick={() => {window.electron.dellFile(ligand.filePath); getFiles()}} className='btn btn-sm text-danger ms-auto' style={{height:'50%'}}><i className="bi bi-trash"></i></button>
                </div>
            ))} <br />
            <label>Results</label>
            {results.map((result, index) => (
                <div className='border border-light p-1 d-flex align-items-center mt-1' key={index}>
                    <label onClick={() => { console.log(result.data) }}>{result.name}</label>
                </div>
            ))}
        </div>
    );
};

export default List;