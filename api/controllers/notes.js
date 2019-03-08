const express = require('express')
const mongoose = require('mongoose')
const Note = require('../models/note')
const User = require('../models/user')

function isEditable(note) {
    return !note.archived;
}

function canUserEdit(note, user) {
    return isEditable(note) && note.creator.equals(user._id);
}

function editNote(res, note, newContent) {
    note.content = newContent
    note.save()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                message: 'Could not update note',
                error: err
            })
        })
}

module.exports.get_all_notes = (res) => {
    Note.find()
        .exec()
        .then(docs => {
            console.log("got " + docs.length)
            res.status(200).json(docs)
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error fetching notes list',
                error: err
            })
        })
}

module.exports.note_create = (res, creator, content) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        creator: creator._id,
        content : content
    })
    note.save()
        .then(result => {
            res.status(201).json({
                message: 'Created note',
                note: note
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Could not create note',
                error: err
            })
        })
}

module.exports.note_edit = (res, user, noteId, newContent) => {
    Note.findById(noteId)
        .then(note => {
            if(canUserEdit(note, user)) {
                editNote(res, note, newContent)
            } else {
                res.status(401).json({ message: 'User is not authorised to edit note' })
            }
        })
        .catch(err => {
            res.status(404).json({ message: 'Note not found' })
        })
}

module.exports.note_archive = (res, user, noteId) => {
    Note.findById(noteId)
        .then(note => {
            if(isEditable(note)) {
                note.archived = true
                note.save()
                    .then(result => {
                        res.status(200).json({
                            message: 'Archived note',
                            user: user,
                            note: note
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'Could not archive note',
                            user: user,
                            error: err
                        })
                    })
            } else {
                res.status(403).json({
                    message: 'Note is not editable',
                    user: user,
                    note: note
                })
            }
        })
        .catch()
}

module.exports.note_delete = (res, user, noteId) => {
    Note.findById(noteId)
        .then(note => {
            if(canUserEdit(note, user)) {
                Note.findByIdAndRemove(noteId)
                    .then(result => {
                        res.status(200).json({
                            message: 'Deleted note',
                            user: user,
                            note: note
                        })
                    }).catch(err => {
                        res.status(500).json({
                            message: 'Could not delete note',
                            user: user,
                            error: err
                        })
                    })
            } else {
                res.status(401).json({
                    message: 'User is not authorised to delete note',
                    user: user,
                    note: note
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                message: 'Note not found',
                user: user,
                id: noteId
            })
        })
}