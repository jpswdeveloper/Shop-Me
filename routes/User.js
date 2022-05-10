const route = require('express').Router()
const { User } = require('../models/user');
const multer = require('multer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()
const File_Type = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'

}
// if we want to use for uploading images

const storage = multer.diskStorage({
    destination: function (cb, req, file) {
        const UploadErr = new Error('unallowed image type')
        const isValid = File_Type[
            file.mimetypes
        ]
        if (isValid) {
            UploadErr = null;
        }
        cb(UploadErr, 'public/uploads')

    },
    filename: function (cb, req, file) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = File_Type[file.mimetypes]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadoptions = multer({ storage: storage })
// get the user
route.get('/', async (req, res) => {
    let filter = {};
    if (req.query.user) {
        filter = { user: req.query.user.split(',') }
    }
    User.find(filter)
        .select('-passwordHash')//while it retrives a data it exclude hashed password of the user
        .then(user => {
            res.status(202).json(user)
        })
        .catch(err => {
            res.status(404).json({
                message: 'something went wrong while fetching users',
                error: err
            })
        })
})
// get the user by id
route.get('/user/:id', (req, res) => {
    User.findById(req.query.params)
        .select('-passwordHash')
        .then(user => {
            res.status(202).json(user)
        })
        .catch(err => {
            res.status(404).json({
                message: 'something went wrong while fetching users',
                error: err
            })
        })
})
// get total user used the app
route.get('/users', (req, res) => {
    User.count()
        .then(user => {
            res.status(202).json(user)
        })
        .catch(err => {
            res.status(404).json({
                message: 'something went wrong while fetching users',
                error: err
            })
        })
})
// add the users
route.post('/register', uploadoptions.single('image'), (req, res) => {

    const newUsers = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        city: req.body.city,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        isAdmin: req.body.isAdmin,
        country: req.body.country
    })
    newUsers.save()
        .then(user => {
            res.status(202).json(user)
        })
        .catch(err => {
            res.status(404).json({
                message: 'something went wrong while registering the user',
                error: err
            })
        })
})
// update the user
route.put('/updateUser/:id', uploadoptions.single('images'), (req, res) => {
    const base = `${req.protocol}://${req.get('host')}/public/uploads`
    const file = req.file;
    !file && res.status(404).json({
        message: 'there is no file'
    })
    const fileName = file.filename;
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: `${base}${fileName}`,
        city: req.body.city,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        country: req.body.country
    },
        {
            new: true
        }
    )
        .then(user => {
            res.status(202).json(user)
        })
        .catch(err => {
            res.status(404).json({
                message: 'something went wrong while fetching users',
                error: err
            })
        })
})
//delete the user
route.delete('/userDelete/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(202).json({
                message: 'user deleted successfully'
            })
        })
        .catch(err => {
            res.status(404).json({
                message: 'something went wrong while deleting the users',
                error: err
            })
        })
})
//login
route.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json({
            message: 'email is not found',
        })
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
            },
                process.env.Secret,
                {
                    expiresIn: '1d'
                }
            )
            res.status(202).json({
                user: user.email,
                token: token
            })
        }
        else {
            res.status(404).json({
                message: "Password is incorrect"
            })
        }
    } catch (error) {
        res.status(404).json({
            message: "Something is wrong",
            err: error
        })
    }
})
module.exports = route
