const express = require('express');
const router = express.Router();
const ProductModel = require('../../db/model/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');

    },
    filename: function (req, file, cb) {
        cb(null, +Date.now() + '-' + file.originalname);
    }
})

const upload = multer({
    storage: storage
});

router.post('/addProduct', upload.array('images', 10),async(req,res)=>{
    try {
        let{name, productType, price, description} = req.body;
        const files = req.files
        if (!files) {
            const error = new Error('Please choose files')
            error.httpStatusCode = 400
            return next(error)
        }
        console.log(files);
        let arrayimg = [];
        files.forEach((element) => {
            arrayimg.push('/uploads/' + element.filename)
        });
        console.log(arrayimg);


        const data = new ProductModel({
            name, 
            image: arrayimg, 
            productType, 
            price, 
            description
        })

        let check = await data.save()
        if(check){
            res.json({
                msg:'Thêm thành công',
                status:200
            })
        }else{
            res.json({
                msg:'Thêm thất bại',
                status:201
            })
        }

    } catch (error) {
        console.log(error)
        res.json({
            errors: [{
                msg: 'Server error !'
            }],
            status: 205
        });
    }
});

router.get('/getProductByType', async(req,res)=>{
    try {

        const {productType} = req.query;
        const list = await ProductModel
        .find({productType: productType})
        .populate('productType')

        console.log(list);
    
        if(list){
            res.json({data:list})
        }else{
            res.json({
                data:''
            }) 
        }

    } catch (error) {
        res.json({
            errors: [{
                msg: "Server errors"
            }],
            status: 205
        })
    }
});

module.exports = router;