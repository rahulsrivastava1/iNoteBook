import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesinitial = [];
    const [notes, setNotes] = useState(notesinitial);

    // Get all notes
    const getallnotes = async () => {
        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjEzNWExMmZlMTMyYzk5YWZkMWMyM2MwIn0sImlhdCI6MTYzMDkwNDYyM30.AU5I9M_M881bE0ka-XfeddcQbWub8IUrzeWn01SVC2Q'
                "auth-token": localStorage.getItem("token"),
            },
        });
        const json=await response.json();
        setNotes(json);
    }

    // Add a note
    const addnote = async (title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({title,description,tag}),
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    }

    // Delete a note
    const deletenote = async (id) => {
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
        });
        const json=response.json();
        console.log(json);
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }

    // Edit a note
    const editnote = async (id, title, description, tag) => {
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({title,description,tag}),
        });
        let newNotes=JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    };

    return (
        <NoteContext.Provider value={{ notes, addnote, deletenote, editnote, getallnotes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;