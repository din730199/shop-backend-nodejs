const mongoose = require('mongoose');

const BillDetail = new mongoose.Schema({
    idBill:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bill',
        required:true
    },
    idProduct:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required:true
    },
    quantity:{
        type: 'Number',
        default:0
    }
})

module.exports = mongoose.model('billDetail',BillDetail);