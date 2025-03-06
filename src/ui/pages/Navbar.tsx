import { Link } from "react-router-dom";
import Logo from '../assets/logo.png'

interface NavbarProps {
    handleReceptorUpload: () => void;
    handleLigandUpload: () => void;
}

const Navbar: React.FC<NavbarProps> = ({handleReceptorUpload, handleLigandUpload}) => {

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