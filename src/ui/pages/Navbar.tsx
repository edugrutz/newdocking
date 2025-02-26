import { Link } from "react-router-dom";
import Logo from '../assets/logo.png'

// Fazer upload dos receptores
async function handleReceptorUpload() {
    try {
    const rUpload = await window.electron.openDialog('upload', 'receptor', {
        title: 'Select receptor files',
        buttonLabel: 'Select',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: '.pdb', extensions: ['pdb'] }]
    });
	} catch (error) {
        console.error(error);
    }
}

// Fazer upload dos ligantes
async function handleLigandUpload() {
    try {
    const lUpload = await window.electron.openDialog('upload', 'ligand', {
        title: 'Select ligand files',
        buttonLabel: 'Select',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: '.pdb', extensions: ['sdf', 'mol2', 'pdb'] }]
    });
    } catch (error) {
        console.error(error);
    }
}

function Navbar() {
    return (
    <div className='p-2 d-flex align-items-center bg-dark'>
        <Link to="/" style={{width:'20%', minWidth:'100px', maxWidth:'200px'}} className="ms-2 me-2">
                <img src={Logo} alt="logo docking" style={{width:'100%'}}/>
        </Link>
        <div className='m-2 btn-group'>
            <button className="btn btn-outline-light" onClick={handleReceptorUpload}>Upload Receptor</button>
            <button className="btn btn-outline-light" onClick={handleLigandUpload} >Upload Ligand</button>
        </div>
        <Link to="/docking" className='btn btn-warning text-black'>Start Docking</Link>
        <button className="btn ms-auto fs-4 text-light" style={{marginRight:'30px'}}><i className="bi bi-gear-fill" ></i></button>
    </div>
    );
}

export default Navbar;