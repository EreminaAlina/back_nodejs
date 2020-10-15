const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UsersSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    todos: [{type: Schema.Types.ObjectId, ref: 'ToDoItem'}],
    access_token: String,
    refresh_token: String,
    theme: String
});


// Export the model
module.exports = mongoose.model('Users', UsersSchema);
