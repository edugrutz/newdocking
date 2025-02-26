import React from 'react'

const BoxConfig = () => {

    const setCenter = (index, value) => {
        console.log('center', index, value)
    }

    const setSize = (index, value) => {
        console.log('size', index, value)
    }

  return (
    <div className='p-2'>
        <table>
              <tbody>
              <tr className='border text-center'>
                <td className='p-2' style={{minWidth:'150px', whiteSpace: 'nowrap'}}>Search box center</td>
                <td className='p-1'>
                  <div className='d-flex align-items-center'>
                    <label htmlFor='centerx' className='ms-2'>X</label>
                    <input type="number" id='centerx' className='ms-2' style={{width:'15%', minWidth:'50px'}} onChange={(e) => {setCenter(0, e.target.value)}}/>
                    <label htmlFor='centery' className='ms-2'>Y</label>
                    <input type="number" id='centery' className='ms-2' style={{width:'15%', minWidth:'50px'}} onChange={(e) => {setCenter(1, e.target.value)}}/>
                    <label htmlFor='centerz' className='ms-2'>Z</label>
                    <input type="number" id='centerz' className='ms-2' style={{width:'15%', minWidth:'50px'}} onChange={(e) => {setCenter(2, e.target.value)}}/>
                  </div>
                </td>
              </tr>
              <tr className='border text-center'>
                <td className='p-2'>Search box size</td>
                <td className='p-1'>
                  <div className='d-flex align-items-center'>
                    <label htmlFor='sizex' className='ms-2'>X</label>
                    <input type="number" id='sizex' className='ms-2' style={{width:'15%', minWidth:'50px'}} defaultValue={20} onChange={(e) => {setSize(0, e.target.value)}}/>
                    <label htmlFor='sizey' className='ms-2'>Y</label>
                    <input type="number" id='sizey' className='ms-2' style={{width:'15%', minWidth:'50px'}} defaultValue={20} onChange={(e) => {setSize(1, e.target.value)}}/>
                    <label htmlFor='sizez' className='ms-2'>Z</label>
                    <input type="number" id='sizez' className='ms-2' style={{width:'15%', minWidth:'50px'}} defaultValue={20} onChange={(e) => {setSize(2, e.target.value)}}/>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
    </div>
  )
}

export default BoxConfig