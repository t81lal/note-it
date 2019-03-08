const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    readOwners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    writeOwners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    content: String
})

module.exports = mongoose.model('Note', NoteSchema)