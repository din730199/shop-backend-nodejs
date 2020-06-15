const express = require('express');
const app = express();
const body_parser = require('body-parser');
const ProductModel = require('./db/model/Product');
const PORT = process.env.PORT || 4000;
const connectDB = require('./db/index');
const path = require('path');
const server = require('http').Server(app);
server.listen(PORT)

const io = require('socket.io')(server)
io.on('connection', socket =>{
    console.log('hello');
    socket.on('search',async keyword=>{
        let docOrigin = await ProductModel.find()
        .populate('productType', 'name'); 
        
        if(keyword) {
            let doc = docOrigin.filter((value,index) => {
            let line = value.name + value.productType.name;

            let l =  change_alias(line)
            let k =  change_alias(keyword)

            if(l.toLowerCase().indexOf(k.toLowerCase()) != -1)
            {
                return value;
            }
        })
    
            io.emit('searchresult',{doc:doc})
        } else {
            io.emit('searchresult',{doc:docOrigin})
        }
    })
})

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


