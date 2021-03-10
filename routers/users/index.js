const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../core/auth');
const UsersModel = require('../../db/model/Users');
const {check, validationResult} = require('express-validator');

router.post(
  '/signUp',
  [
    check('email', 'Không được để trống').not().isEmpty(),
    check('name', 'Không được để trống').not().isEmpty(),
    check('email', 'Sai định dạng email').isEmail(),
    check('password', 'Không được để trống').not().isEmpty(),
    check('address', 'Không được để trống').not().isEmpty(),
    check('numberphone', 'Không được để trống').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
        status: 201,
      });
    }

    try {
      let {email, password, name, address, numberphone} = req.body;
      console.log(password);
      let salt = await bcrypt.genSaltSync(10);
      let hashPass = await bcrypt.hashSync(password, salt);

      const user = new UsersModel({
        email,
        password: hashPass,
        name,
        address,
        numberphone,
      });
      let check = await user.save();

      if (check) {
        jwt.sign(
          {
            data: {
              id: check.id,
            },
          },
          config.get('privateKey'),
          (err, token) => {
            if (err) throw err;
            console.log(token);
            if (!token) {
              return res.json({
                errors: [
                  {
                    msg: 'Đăng ký thất bại',
                  },
                ],
                status: 201,
              });
            }
            res.json({
              token: token,
              id: check.id,
              status: 200,
            });
          }
        );
      }
    } catch (error) {
      console.log(error);
      res.json({
        errors: [
          {
            msg: 'Sign up error !',
          },
        ],
        status: 205,
      });
    }
  }
);

router.post(
  '/signIn',
  [
    check('email', 'Không được để trống').not().isEmpty(),
    check('email', 'Sai định dạng email').isEmail(),
    check('password', 'Không được để trống').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
        status: 201,
      });
    }

    try {
      let {email, password} = req.body;

      let CheckUser = await UsersModel.findOne({
        email,
      });

      console.log(CheckUser);
      console.log('123');

      if (CheckUser) {
        if (bcrypt.compareSync(password, CheckUser.password)) {
          jwt.sign(
            {
              data: {
                id: CheckUser.id,
              },
            },
            config.get('privateKey'),
            (err, token) => {
              if (err) throw err;
              console.log(token);
              if (token) {
                res.status(200).json({
                  token,
                  id: CheckUser.id,
                  status: 200,
                });
              } else {
                res.status(201).json({
                  errors: [
                    {
                      msg: 'Username or password wrong',
                    },
                  ],
                  status: 201,
                });
              }
            }
          );
        } else {
          res.status(201).json({
            errors: [
              {
                msg: 'Username or password wrong',
              },
            ],
            status: 201,
          });
        }
      } else {
        res.status(201).json({
          errors: [
            {
              msg: 'Username or password wrong',
            },
          ],
          status: 201,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        errors: [
          {
            msg: 'Sign in error !',
          },
        ],
        status: 205,
      });
    }
  }
);

router.post(
  '/signInAdmin',
  [
    check('email', 'Không được để trống').not().isEmpty(),
    check('email', 'Sai định dạng email').isEmail(),
    check('password', 'Không được để trống').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
        status: 201,
      });
    }

    try {
      let {email, password} = req.body;

      let CheckUser = await UsersModel.findOne({
        email,
      });
      if (!(CheckUser._id.toString() === '60487ce56bf8f70024c54902'))
        return res.status(201).json({
          errors: [
            {
              msg: 'Không có quyền admin',
            },
          ],
          status: 201,
        });

      if (CheckUser) {
        if (bcrypt.compareSync(password, CheckUser.password)) {
          jwt.sign(
            {
              data: {
                id: CheckUser.id,
              },
            },
            config.get('privateKey'),
            (err, token) => {
              if (err) throw err;
              if (token) {
                res.status(200).json({
                  token,
                  data: CheckUser,
                  status: 200,
                });
              } else {
                res.status(201).json({
                  errors: [
                    {
                      msg: 'Username or password wrong',
                    },
                  ],
                  status: 201,
                });
              }
            }
          );
        } else {
          res.status(201).json({
            errors: [
              {
                msg: 'Username or password wrong',
              },
            ],
            status: 201,
          });
        }
      } else {
        res.status(201).json({
          errors: [
            {
              msg: 'Username or password wrong',
            },
          ],
          status: 201,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        errors: [
          {
            msg: 'Sign in error !',
          },
        ],
        status: 205,
      });
    }
  }
);

router.get('/getInfoUser', auth, async (req, res) => {
  try {
    console.log(req.id);
    res.json({
      data: await UsersModel.findById(req.id),
    });
  } catch (error) {
    console.log(error);
    res.json({
      errors: [
        {
          msg: 'Sign in error !',
        },
      ],
      status: 205,
    });
  }
});

router.post('/updateInfoUser', auth, async (req, res) => {
  try {
    console.log(req.id);
    const {name, email, address, numberphone} = req.body;

    const data = await UsersModel.findByIdAndUpdate(req.id, {
      name,
      email,
      address,
      numberphone,
    });

    if (data) {
      res.json({
        msg: 'Thêm thành công',
        status: 200,
      });
    } else {
      res.json({
        errors: [
          {
            msg: 'Thêm thất bại',
          },
        ],
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      errors: [
        {
          msg: 'Sign in error !',
        },
      ],
      status: 205,
    });
  }
});

router.post('/changePass', auth, async (req, res) => {
  try {
    let {oldPass, newPass} = req.body;

    let salt = await bcrypt.genSaltSync(10);
    let hashPass = await bcrypt.hashSync(newPass, salt);

    let Users = await UsersModel.findById(req.id);

    console.log(Users.password);

    if (bcrypt.compareSync(oldPass, Users.password)) {
      let check = await UsersModel.findByIdAndUpdate(
        req.id,
        {
          password: hashPass,
        },
        {
          new: true,
        }
      );

      console.log(check);

      res.json({
        msg: 'successful',
        status: 200,
      });
    } else {
      res.json({
        errors: [
          {
            msg: 'fail',
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

router.get('/getAllUser', async (req, res) => {
  try {
    res.json({data: await UsersModel.find()});
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

module.exports = router;
