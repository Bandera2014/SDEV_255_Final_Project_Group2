const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
    },
    description: {
        type: String,
    },
    credits: {
        type: String,
    },
    subject: {
        type: String,
    }
});

module.exports = mongoose.model('Course', courseSchema);