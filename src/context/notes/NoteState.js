import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesIntial = [];
  const [notes, setNotes] = useState(notesIntial);

    //GET ALL NOTES
    const getNotes = async ()=>{

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });

      const json = await response.json();
      console.log(json);
      setNotes(json);
    }





  //ADD A NOTE
  const addNote = async (title, description, tag)=>{
    //API call to be done
    //API CALL
    const response = await fetch( `${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}), //ERROR HERE
    });

    const note = await response.json();
    setNotes(notes.concat(note));
    // console.log("Adding a new Note");
    
  }

  //DELETE A NOTE

  const deleteNote = async (id)=>{

    //API CALL
    const response = await fetch( `${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });

    const json = response.json();
    console.log(json);

    // console.log("deleting the note with id " + id)
    const newNotes = notes.filter((note) =>{return note._id !==id});
    setNotes(newNotes);
  }










  //EDIT A NODE
  const editNote = async(id, title, description, tag)=>{

    //API CALL
    const response = await fetch( `${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}), //ERROR HERE
    });

    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes)); //making a deep copy

    //LOGIC TO EDIT in CLIENT
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];

      if(element._id === id){
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
