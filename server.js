const express = require('express');
const app = express();
const body_parser = require('body-parser');
const PORT = process.env.PORT || 4000;
const connectDB = require('./db/index');
const path = require('path');
const server = require('http').Server(app);
server.listen(PORT)

connectDB();
app.use(body_parser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/',(req,res) => {
    res.send("Welcome")
})


