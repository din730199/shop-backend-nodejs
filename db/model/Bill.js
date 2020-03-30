const mongoose = require('mongoose');

const Bill = new mongoose.Schema({
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    dateOrder:{
        type : 'Date',
        required :true,
        default : new Date()
    },
    total:{
        type: 'Number',
        default: 0
    },
    status : {
        type : 'Number',
        required : true,
        default : 0
    },
})

module.exports = mongoose.model('bill',Bill);