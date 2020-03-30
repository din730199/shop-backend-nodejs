const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    name:{
        type: 'String'
    },
    image:{
        type:'String'
    },
    productType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'producttype'
    },
    price:{
        type : 'Number'
    },
    material:{
        type: 'String'
    },
    description:{
        type: 'String'
    }
})

module.exports = mongoose.model('product',Product);