const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },    
    description: String,
    instructor: String,
    students:[String],
    createdAt: {
         type: Date,
         immutable: true,
         default: () => Date.now()
    },
    updatedAt: {
         type: Date,
         immutable: true,
         default: () => Date.now()
    },
});

module.exports = mongoose.model('Course', courseSchema);