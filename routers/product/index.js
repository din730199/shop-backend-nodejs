const express = require('express');
const router = express.Router();
const ProductModel = require('../../db/model/Product');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post('/addProduct', upload.array('images', 10), async (req, res) => {
  try {
    let {name, productType, price, description} = req.body;
    const files = req.files;
    if (!files) {
      const error = new Error('Please choose files');
      error.httpStatusCode = 400;
      return next(error);
    }
    console.log(files);
    let arrayimg = [];
    files.forEach((element) => {
      arrayimg.push('/uploads/' + element.filename);
    });
    console.log(arrayimg);

    const data = new ProductModel({
      name,
      image: arrayimg,
      productType,
      price,
      description,
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
          msg: 'Server error !!',
        },
      ],
      status: 205,
    });
  }
});

router.get('/getProductByType', async (req, res) => {
  try {
    const {productType} = req.query;
    const list = await ProductModel.find({productType: productType}).populate(
      'productType'
    );

    console.log(list);

    if (list) {
      res.json({data: list});
    } else {
      res.json({
        data: '',
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

router.get('/getListProduct', async (req, res) => {
  try {
    res.json({
      data: await ProductModel.find().populate('productType', '-_id -__v'),
    });
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

router.get('/searchByKeyword', async (req, res) => {
  try {
    let {keyword} = req.query;
    let docOrigin = await ProductModel.find().populate('productType', 'name');

    if (keyword) {
      let doc = docOrigin.filter((value, index) => {
        let line = value.name + value.productType.name;

        let l = change_alias(line);
        let k = change_alias(keyword);

        if (l.toLowerCase().indexOf(k.toLowerCase()) != -1) {
          return value;
        }
      });

      res.json({
        doc,
      });
    } else {
      res.json({
        doc: docOrigin,
      });
    }
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
  try {
    const data = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
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
    const data = await ProductModel.findByIdAndDelete(req.params.id);
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

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  );
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
}

module.exports = router;
