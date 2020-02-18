const mongoose = require('mongoose');

const ProductType = new mongoose.Schema({
    name:{
        type: 'String'
    },
    image:{
        type:'String'
    }
})

module.exports = mongoose.model('productType',ProductType);