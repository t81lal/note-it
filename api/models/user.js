const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

userSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password
        return ret
    }
});
module.exports = mongoose.model('User', userSchema)