const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ToDoItemSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref: 'Users'},
    text: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    taskTime: {
        type: Date,
    },
    estimated: {
        type: Boolean,
    }
});


// Export the model
module.exports = mongoose.model('ToDoItem', ToDoItemSchema);