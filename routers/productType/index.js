const express = require('express');
const router = express.Router();
const ProductType = require('../../db/model/ProductType');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post('/addProductType', upload.single('image'), async (req, res) => {
  try {
    let {name} = req.body;
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return res.json({
        errors: [
          {
            msg: 'error !',
          },
        ],
        status: 205,
      });
    }
    console.log(file.filename);

    const data = new ProductType({
      name,
      image: '/uploads/' + file.filename,
    });

    let check = await data.save();
    if (check) {
      res.json({
        msg: 'Thêm thành công',
        status: 200,
      });
    } else {
      res.json({
        msg: 'Thêm thất bại',
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      errors: [
        {
          msg: 'Server error !',
        },
      ],
      status: 205,
    });
  }
});

router.get('/getListProductType', async (req, res) => {
  try {
    res.json({data: await ProductType.find()});
  } catch (error) {
    console.log(error);
    res.json({
      errors: [
        {
          msg: 'Server errors',
        },
      ],
      status: 205,
    });
  }
});

router.put('/updateById/:id', async (req, res) => {
  console.log('====================================');
  console.log(req.body);
  console.log('====================================');
  try {
    const data = await ProductType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (data) {
      res.json({
        msg: 'Update thành công',
        status: 200,
      });
    } else {
      res.json({
        errors: [
          {
            msg: 'Update thất bại',
          },
        ],
        status: 201,
      });
    }
  } catch (error) {
    res.json({
      errors: [
        {
          msg: 'Server errors',
        },
      ],
      status: 205,
    });
  }
});

router.delete('/deleteById/:id', async (req, res) => {
  try {
    const data = await ProductType.findByIdAndDelete(req.params.id);
    if (data) {
      res.json({
        msg: 'Delete thành công',
        status: 200,
      });
    } else {
      res.json({
        errors: [
          {
            msg: 'Delete thất bại',
          },
        ],
        status: 201,
      });
    }
  } catch (error) {
    res.json({
      errors: [
        {
          msg: 'Server errors',
        },
      ],
      status: 205,
    });
  }
});

module.exports = router;
