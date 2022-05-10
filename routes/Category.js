const route = require('express').Router();
const mongoose = require('mongoose');
const { Category } = require('../models/category')
// add category
route.post('/', async (req, res) => {
    try {
        const newCategory = new Category(req.body)
        const category = newCategory.save();
        res.status(202).json(category)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }
})
// find category by its id
route.get('/findCategory/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).json({
            message: "ID is not correct",
        })
    }
    Category.findById(req.params.id)
        .then(category => {
            res.status(202).json(category)
        })
        .catch(err => {
            res.status(404).json({
                message: "Something went wrong",
                error: err
            })
        })
})
// update category by its id
route.put('/updateCategory/:id', async (req, res) => {
    // check inserted id
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).json({
            message: "ID is not correct",
        })
    }
    Category.findByIdAndUpdate(
        req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    },
        {
            new: true
        }
    ).then(category => {
        res.status(202).json(category)
    })
        .catch(err => {
            res.status(404).json({
                message: "Something went wrong",
                error: err
            })
        })
})

// delete category
route.delete('/deleteCategory/:id', (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(404).json({
            message: "ID is not correct",
        })
    }
    Category.findByIdAndDelete(req.param.id)
        .then(() => {
            res.status.json("Category is deleted successfully")
        })
        .catch(err => {
            res.status(404).json({
                message: "Something went wrong",
                error: err
            })
        })
})
// find category
route.get('/', async (req, res) => {
    let filter = req.query.filter ? req.query.filter : 0
    try {

        const allCategory = await Category.find().limit(+filter);
        res.status(202).json(allCategory)

    } catch (error) {
        res.status(404).json({
            message: "Something went wrong",
            error: error
        })
    }
})
// all categories
route.get('/get_all_categories', async (req, res) => {
    try {
        const allCategory = await Category.count()
        res.status(202).json(allCategory)
    } catch (error) {
        res.status(404).json({
            message: "Something went wrong",
            error: error
        })
    }
})
module.exports = route