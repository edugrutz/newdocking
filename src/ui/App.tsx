import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, data } from 'react-router-dom';
import Viewer from './pages/Viewer';
import Navbar from './pages/Navbar';
import Docking from './pages/Docking';
import List from './pages/List';
import { get } from '3dmol';
import Result from './pages/Result';

function App() {
    const [receptorsData, setReceptorsData] = useState<any[]>([]);
    const [ligandsData, setLigandsData] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);

    const [molViewer, setMolViewer] = useState(null);
    const [molFormat, setMolFormat] = useState(null);
    const [molName, setMolName] = useState("");

    const [selectedResult, setSelectedResult] = useState<any>();

    useEffect(() => {
      getFiles();
  }, []);

   // Listar arquivos e pegar data
   async function getFiles() {
    const data = await window.electron.getFiles() .then ((data) => {
      setResults(data.resultsData);
      setLigandsData(data.ligandData);
      setReceptorsData(data.receptorData);
    });
  }

    // Fazer upload dos receptores
    async function handleReceptorUpload() {
      try {
      const rUpload = await window.electron.openDialog('upload', 'receptor', {
          title: 'Select receptor files',
          buttonLabel: 'Select',
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: '.pdb', extensions: ['pdb'] }]
      }).then((data) => {
        if (data) {
          data.forEach(data => {
            setReceptorsData(prevReceptorsData => [...prevReceptorsData, data]);
          });
          getFiles();
        }
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
      }) .then((data) => {
        if (data) {
          data.forEach(data => {
            setLigandsData(prevLigandsData => [...prevLigandsData, data]);
          });
          getFiles();
        }
      });
    } catch (error) {
          console.error(error);
      }
    }

    return (
        <div className='bg-dark text-light vh-100 d-flex flex-column'>
            <Router>
                <Navbar handleLigandUpload={handleLigandUpload} handleReceptorUpload={handleReceptorUpload}/>
                <div className='d-flex flex-grow-1'>
                    <aside className='sidebar'>
                        <List receptors={receptorsData} ligands={ligandsData} results={results} setMolViewer={setMolViewer} setMolFormat={setMolFormat} getFiles={getFiles} setMolName={setMolName} setSelectedResult={setSelectedResult}/>
                    </aside>
                    <main className='content ms-2 w-100 me-3'>
                        <Routes>
                            <Route path="/" element={<Viewer molViewer={molViewer} molFormat={molFormat} molName={molName}/>} />
                            <Route path="/docking" element={<Docking receptors={receptorsData} ligands={ligandsData} getFiles={getFiles}/>} />
                            <Route path="/result" element={<Result results={results} selectedResult={selectedResult}/>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </div>
    );
}

export default App;