import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const List = () => {

    const [ligands, setLigands] = useState([])
    const [receptors, setReceptors] = useState([])
    const [results, setResults] = useState([])

    useEffect(() => {
        getFiles()
    }, [])

    async function getFiles() {
        try {
            const get = await window.electron.listFiles().then((data) => {
                setLigands(data.ligandFiles)
                setReceptors(data.receptorFiles)
                setResults(data.resultsFiles)
            })
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className='m-2 p-2 overflow-auto' style={{minWidth: '200px'}}>
        <label className='fw-bold'>Receptors</label>
        {receptors.map((receptor, index) => {
            return (
                <div key={index}>{receptor}</div>
            )})
        } <br />
        <label className='fw-bold'>Ligands</label>
        {ligands.map((ligand, index) => {
            return (
                <div key={index}>{ligand}</div>
            )})
        } <br />
        <label className='fw-bold'>Results</label>
        {results.map((result, index) => {
            return (
                <div key={index}>{result}</div>
            )}
        )}
        <Link to='/viewer'>Viewer</Link>
    </div>
  )
}

export default List