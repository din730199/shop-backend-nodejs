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
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/users',require('./routers/users/index'));
app.use('/api/productType',require('./routers/productType/index'));
app.use('/api/product',require('./routers/product/index'));
app.use('/api/bill',require('./routers/bill/index'));

app.get('/',(req,res) => {
    res.send("Welcome")
});


