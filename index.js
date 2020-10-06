const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tasks_router = require('./routes/tasks.router');
const login_router = require('./routes/login.router');

const app = express();

let dev_db_url = 'mongodb://localhost:27017/alina';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/user', login_router);
app.use('/todo', tasks_router);

let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

