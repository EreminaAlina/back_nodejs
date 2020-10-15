const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
   userName: {
       type: String
   },
    message: {
        type: String
    },
    time: {
        type: String
    },
    serverStatus: {
        type: String
    },
});


// Export the model
module.exports = mongoose.model('Messages', MessageSchema);
