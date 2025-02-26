const Receptor = () => {
    return (
        <div className="border p-2" style={{flex: '1'}}>
            <label htmlFor="">Select Receptor</label>
            <select className="form-select w-50" name="" id=""> </select>
            <button className="btn btn-secondary mt-2">Prepare Receptor</button>
        </div>
    );
}

export default Receptor;