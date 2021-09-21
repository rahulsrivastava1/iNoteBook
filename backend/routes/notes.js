const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


// Get user notes using : GET "/api/notes/fetchallnotes" : Login Required 
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// Create a user note using : POST "/api/notes/addnote" : Login Required 
router.post('/addnote', fetchuser, [
    body('title', "Please enter a valid title.").isLength({ min: 3 }),
    body('description', "Please enter atleast 5 characters description.").isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if there are errors then return this
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// Update a existing user note using : PUT "/api/notes/updatenote/:id" : Login Required 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // create a newNote Object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found!");
        }
        // Allow updation only to authenticated user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// Delete a existing user note using : DELETE "/api/notes/deletenote/:id" : Login Required 
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found!");
        }
        // Allow deletion only to authenticated user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has deleted successfully!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

module.exports = router;