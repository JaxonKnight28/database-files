const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start Mongoose
const db = 'mongodb://localhost/first-database'; // "first-database" is the database name
mongoose.connect(db);
const udb = mongoose.connection;
udb.on('error', console.error.bind(console, 'connection error:'));
udb.once('open', function () {
    console.log('db connected');
});

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now }
});

// Define a model based on the Schema
const user = mongoose.model('User', userSchema);

//API
//Create -- new document
app.post('/newUser', (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
        res.send(`done ${data}`);
    });
});// test this with`curl --data "name=Peter&role=Student" http://localhost:3000/newUser`

app.get('/user/:name', (req, res) => {
    let userName = req.params.name;
    user.find({ name: userName }, {}, {}, (err, data) => {
        res.send(`Complete`);
    });
});

app.get("/getStudents", (req, res) => {
    user.find({}, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        //You can access the result from the call back function  
        let result = JSON.stringify(data);
        console.log(`data = ${result}`);
        res.send(result);
    });
})





app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});


