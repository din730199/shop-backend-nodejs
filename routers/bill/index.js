const express = require('express');
const router = express.Router();
const BillModel = require('../../db/model/Bill');
const auth = require('../../core/auth')

router.post('/addBill',auth,async(req,res)=>{
    try {
        let{total} = req.body;

        const data = new BillModel({
            idUser:req.id,
            total
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

router.get('/getListBillById',auth, async (req,res) =>{
    try {
        res.json({data: await BillModel.find({idUser:req.id})})
    } catch (error) {
        console.log(error);
        res.json({
            errors: [{
                msg: "Server errors"
            }],
            status : 205
        })
    }
})

module.exports = router;