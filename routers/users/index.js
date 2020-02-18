const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken');
const auth = require('../../core/auth')
const UsersModel = require('../../db/model/Users')

router.post('/signUp', async (req, res) => {
    try {
        let {
            email,
            password,
            name,
        } = req.body;
        console.log(password)
        let salt = await bcrypt.genSaltSync(10);
        let hashPass = await bcrypt.hashSync(password, salt);

        const user = new UsersModel({
            email,
            password: hashPass,
            name,
        });
        let check = await user.save()

        if (check) {
            jwt.sign({
                data: {
                    id: check.id,
                }
            }, config.get('privateKey'), {
                expiresIn: '24h'
            }, (err, token) => {
                if (err) throw err;
                console.log(token);
                if (!token) {
                    return (res.json({
                        errors: [{
                            msg: "Đăng ký thất bại"
                        }],
                        status: 201
                    }))
                }
                res.json({
                    token: token,
                    id: check.id,
                    status: 200
                })

            });
        }
    } catch (error) {
        console.log(error)
        res.json({
            errors: [{
                msg: 'Sign up error !'
            }],
            status: 205
        });
    }
});

router.post('/signIn',async (req,res)=>{
    try {
        let {
            email,
            password
        } = req.body;

        let CheckUser = await UsersModel.findOne({email})

        console.log(CheckUser);
        console.log('123');

        if (CheckUser) {
            if (bcrypt.compareSync(password, CheckUser.password)) {
                jwt.sign({
                    data: {
                        id: CheckUser.id,
                    }
                }, config.get('privateKey'), {
                    expiresIn: '24h'
                }, (err, token) => {
                    if (err) throw err;
                    console.log(token);
                    if (token) {
                        res.status(200).json({
                            token,
                            id: CheckUser.id,
                            status: 200
                        })
                    } else {
                        res.status(201).json({
                            errors: [{
                                msg: "Username or password wrong"
                            }],
                            status: 201
                        })
                    }
                });
            } else {
                res.status(201).json({
                    errors: [{
                        msg: "Username or password wrong"
                    }],
                    status: 201
                })
            }
        } else {
            res.status(201).json({
                errors: [{
                    msg: "Username or password wrong"
                }],
                status: 201
            })
        }

    } catch (error) {
        console.log(error)
        res.json({
            errors: [{
                msg: 'Sign in error !'
            }],
            status:205
        });
    }
});

module.exports = router;