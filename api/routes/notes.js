const express = require('express')
const checkAuth = require('../auth/check_auth')
const NoteController = require('../controllers/notes')

const router = express.Router()

router.get('/', checkAuth, (req, res, next) => NoteController.get_all_notes(res))
router.post('/', checkAuth, (req, res, next) => NoteController.note_create(res, req.user, req.body.content))
router.patch('/:noteId', checkAuth, (req, res, next) => {
    if(req.param('archive')) {
        NoteController.note_archive(res, req.user, req.params.noteId)
    } else {
        NoteController.note_edit(res, req.user, req.params.noteId, req.body.content)
    }
})
router.delete('/:noteId', checkAuth, (req, res, next) => NoteController.note_delete(res, req.user, req.params.noteId))

module.exports = router