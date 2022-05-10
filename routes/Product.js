const route = require('express').Router();
const { Product } = require('../models/product')
const multer = require('multer');
const { Category } = require('../models/category');
const File_Transfer_Prop = {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/jpg': 'jpg'
}
// using multer
const storage = multer.diskStorage({
    destination: function (cb, req, file) {
        // check our req file type
        const UploadErr = new Error('unappropriate type')
        const isValid = File_Transfer_Prop[file.mimetype];
        if (isValid) {
            UploadErr = null
        }

        cb(UploadErr, 'public/uploads')
    },
    filename: function (req, cb, file) {
        const fileName = file.originalname.split(' ').join('-');//create file split with whitespace and join them by -
        const extension = File_Transfer_Prop[
            file.mimetype
        ]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

// create uploadOptions
const uploadOptions = multer({ storage: storage });

// get all the products plus filter plus query
route.get('/', async (req, res) => {
    // check whether the query is there or not
    try {
        let filter = {};
        if (req.query.cat) {
            return filter = { cat: req.query.cat ? req.query.cat : 0 }
        }
        const allProduct = await Product.find(filter).populate('category');
        res.status(202).json(allProduct)
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong",
            err: error
        })
    }
})
// get featured product with limitations
route.get('/get_featured_product/:id', async (req, res) => {
    // check whether there is num after the path
    const limitation = req.params.id ? req.params.id : 0;
    Product.find().limit(limitation).populate('category')
        .then(product => {
            res.status(200).json(product)
        })
        .catch(err => {
            res.status(404).json({
                message: "Something went wrong",
                err: err
            })
        })
})
// add product into the database
route.post('/addProduct', uploadOptions.single('image'), async (req, res) => {
    try {
        // check the category whether it is in our database
        const category = await Category.find({ id: req.body.id });
        !category && res.status(404).json(
            {
                message: "something went wrong"
            }
        )
        // check file query
        const file = req.file
        !file && res.status(404).json({
            message: 'no file is selected'
        })
        // url creater
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        const fileName = file.filename
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            images: req.body.images,
            countInStock: req.body.countInStock,
            numReviews: req.body.numReviews,
            brand: req.body.brand,
            category: req.body.category,
            price: req.body.price,
            isFeatured: req.body.isFeatured,
            rating: req.body.rating,
        })
        const saved = await product.save()
        res.status(202).json(saved)
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong",
            err: error
        })
    }
})
//delete the product
route.delete('/deleteProduct/:id', async (req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(202).json({
                message: "Product deleted successfully",
                success: true
            })
        })
        .catch(error => {
            res.status(404).json({
                message: 'Something went wrong',
                err: error
            })
        })
})
// updating the images
route.put('/updateImage/:id', uploadOptions.array('image', 10), async (req, res) => {
    let uploads = [];
    const file = req.file;
    !file && res.status(404).json({
        message: "Something went wrong"
    })
    const base = `${req.protocol}://${req.get('host')}/public/uploads/`
    file.map(img => {
        uploads.push(`${base}${img.filename}`)
    })
    Product.findByIdAndUpdate(
        req.params.id, {
        images: uploads
    },
        {
            new: true
        }
    ).then(prd => {
        res.status(202).json(prd)
    })
        .catch(error =>
            res.status(404).json({
                message: 'Something went wrong',
                err: error
            })
        )
})
// find the product by the id
route.get('/getProduct/:id', (req, res) => {
    Product.find(
        req.params.id
    ).populate('category')
        .then(prd => {
            res.status(202).json(prd)
        })
        .catch(error => {
            res.status(404).json({
                message: 'Something went wrong',
                err: error
            })
        })
})
// all products in count
route.get('/allProduct', async (req, res) => {
    try {
        const product = await Product.count()
        res.status(202).json(product)
    } catch (error) {
        res.status(404).json({
            message: 'Something went wrong',
            err: error
        })
    }
})
module.exports = route
