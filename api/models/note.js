const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { type: String, default: "" },
    archived: { type: Boolean, default: false }
})

module.exports = mongoose.model('Note', NoteSchema)