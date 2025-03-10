import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, data } from 'react-router-dom';
import Viewer from './pages/Viewer';
import Navbar from './pages/Navbar';
import Docking from './pages/Docking';
import List from './pages/List';
import Result from './pages/Result';
import Home from './pages/Home';

export interface AppProps {
  receptorsData: string[];
  ligandsData: string[];
  results: string[];
  molViewer: any;
  molFormat: string;
  molName: string;
  selectedResult: any;
  format: string;
}

function App() {
    const [receptorsData, setReceptorsData] = useState<string[]>([]);
    const [ligandsData, setLigandsData] = useState<string[]>([]);
    const [results, setResults] = useState<string[]>([]);

    const [molViewer, setMolViewer] = useState(null);
    const [molFormat, setMolFormat] = useState<string>("");
    const [molName, setMolName] = useState("");
    const [format, setFormat] = useState<string>("");

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
          data.forEach((data: string) => {
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
          data.forEach((data: string) => {
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
                        <List receptors={receptorsData} ligands={ligandsData} results={results} setMolViewer={setMolViewer} setMolFormat={setMolFormat} getFiles={getFiles} setMolName={setMolName} setSelectedResult={setSelectedResult} setFormat={setFormat}/>
                    </aside>
                    <main className='content ms-2 w-100 me-3'>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/viewer" element={<Viewer molViewer={molViewer} molFormat={molFormat} molName={molName} format={format}/>} />
                            <Route path="/docking" element={<Docking receptors={receptorsData} ligands={ligandsData} getFiles={getFiles}/>} />
                            <Route path="/result" element={<Result results={results} selectedResult={selectedResult} getFiles={getFiles}/>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </div>
    );
}

export default App;