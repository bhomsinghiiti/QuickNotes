const express = require('express')
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//ROUTE 1: GET ALL THE NOTES using GET "/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({user: req.user.id});
    res.json(notes);

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
  })

//ROUTE 2: ADDING A NEW NOTE using POST "/notes/addnote"  LOGIN REQUIRED
router.post('/addnote', fetchuser,  [
  body('title', 'Title length must be at least 3 characters').isLength({ min: 3 }),
  body('description', 'Description length must be at least 5 characters').isLength({min: 5})
  ], async (req, res) => {

  try {

  const {title, description, tag} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const note = new Note({
    title, description, tag, user: req.user.id, 
  })
    const savedNote = await note.save();
    res.json(savedNote);
  }

  catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
})


//ROUTE 3: UPDATING A NEW NOTE using PUT "/notes/updatenote"  LOGIN REQUIRED
router.put('/updatenote/:id', fetchuser, async (req, res) => {

  const {title, description, tag} = req.body;

  try{
  //Create a new note object
  const newNote = {};

  if(title){newNote.title = title};
  if(description){newNote.description = description};
  if(tag){newNote.tag = tag};

  //Find the note to be updated and update it
  // const note = Note.findByIdAndUpdate()
  let note = await Note.findById(req.params.id);
  
  if(!note){
    return res.status(404).send("Not found");
  }

  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
  res.json({note});
  } catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
})



//ROUTE 4: DELETING A NOTE using DELETE "/notes/deletenote"  LOGIN REQUIRED
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  
try{
  //Find the note to be deleted and delete it
  let note = await Note.findById(req.params.id);
  
  if(!note){
    return res.status(404).send("Not found");
  }

  //Allow deletion if it actutally belongs to the user
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndDelete(req.params.id);
  res.json({"Success": "Note Deleted", note: note});
}

catch(error){
  console.error(error);
  res.status(500).send('Server Error');
}

  
  
})

module.exports = router