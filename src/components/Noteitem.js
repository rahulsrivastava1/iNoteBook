import React,{ useContext } from 'react';
import contextValue from "../context/notes/noteContext";

const Noteitem = (props) => {
    const context=useContext(contextValue);
    const { deletenote }=context;
    const { note, updatenote } = props;
    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <i className="fas fa-trash mx-2" onClick={()=>{deletenote(note._id);props.showAlert("deleetd successfully!","success")}}></i>
                    <i className="fas fa-edit mx-2" onClick={()=>{updatenote(note)}}></i>
                </div>
            </div>
        </div>
    )
}

export default Noteitem
