const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    numberPhone : {
        type : 'String',
        unique : true,
        required : true
    },
    password : {
        type : 'String',
        required : true
    },
    fullName : {
        type : 'String',
        
    },
    birthDay : {
        type : 'Date',
        
    },
    type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'typeusers',
    },
    certificate : [
        {
            type : 'String',
        }
    ],
    idCardNumber : {
        type : 'String',
       
    },
    imageIdCard : [
        {
            type : 'String'
        }
    ],
    video : {
        type : 'String'
    },
    avarta : {
        type : 'String',
    },
    bankNumber : {
        type : 'String',
    },
    email : {
        type : 'String',
        required : true
    },
    nationality : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'nationals'
    },
    role : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'roles'
    },
    IdCardLocation : {
        type : 'String'
    },
    IdCardDate:{
        type:'Date'
    },
    status : {
        type : 'Number',
        required : true,
        default : 0
    },
    dateCreate : {
        type : 'Date',
        default : new Date()
    },
    price : {
        type : 'Number',
        default : 0
    },
    order : {
        type : 'Number',
        default : 0
    },
    language : [
        {
            type : 'String'
        }
    ],
    taxCode : {
        type : 'String'
    },
    typeOfTranslator : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'typetranslators'
    }],
    timeWork : {
        type : 'Date'
    },
    gender : {
        type : 'Number',
        required : true,
        default : 1
    },
    rate : [{
        type: 'Number',
        required:true,
        default:0
    }],
    locationWork:{
        type:'String',
        default:'not update'
    },
    description:{
        type:'String'
    },
    your : {
        type : 'String',
        default : 'Sinh viên'
    },
    fcmToken : {
        type : 'String',
        default : null
    }
})

module.exports = mongoose.model('users',UserSchema);