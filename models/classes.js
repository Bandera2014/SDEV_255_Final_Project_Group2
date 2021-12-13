const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    className: {
        type: String,
        required: true
    },
    professorName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('User', userSchema);