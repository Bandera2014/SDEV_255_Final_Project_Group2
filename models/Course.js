const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },    
    description: String
});

module.exports = mongoose.model('Course', courseSchema);