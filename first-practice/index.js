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

// app.get('/user/:name', (req, res) => {
//     let userName = req.params.name;
//     console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
//     user.findOne({ name: userName }, (err, data) => {
//         if (err) return console.log(`Oops! ${err}`);
//         console.log(`data -- ${JSON.stringify(data)}`);
//         let returnMsg = `user name : ${userName} role : ${data.role}`;
//         console.log(returnMsg);
//         res.send(returnMsg);
//     });
// });


//Update --find one and then update the document
//Update --find one and then update the document
app.post('/updateUserRole', (req, res) => {
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    let newrole = req.body.role;
    user.findOneAndUpdate({ name: matchedName }, { role: newrole },
        { new: true }, //return the updated version instead of the pre-updated document 
        (err, data) => {
            if (err) return console.log(`Oops! ${err}`);
            console.log(`data -- ${data.role}`)
            let returnMsg = `username : ${matchedName} New role : ${data.role}`;
            console.log(returnMsg);
            res.send(returnMsg);
        });
})

//Delete --find one and then remove the document
app.post('/removeUser', (req, res) => {
    console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    user.findOneAndDelete(
        { name: matchedName },
        (err, data) => {
            if (err) return console.log(`Oops! ${err}`);
            console.log(`data -- ${JSON.stringify(data)}`)
            let returnMsg = `user name : ${matchedName}, removed data : ${data}`;
            console.log(returnMsg);
            res.send(returnMsg);
        });
});






app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`App Server listen on port: ${port}`);
});


