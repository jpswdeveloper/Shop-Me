function errorHandler(req, res, next, err) {
    if (err.name === 'UnauthorizedError') {
        return res.status(404).json({
            message: 'Unauthorized user',
            err: err
        })
    }
    if (err.name === 'ValidationError') {
        return res.status(404).json({
            message: 'ValidationError',
            err: err
        })
    }
    return res.status(404).json({
        message: "Something went wrong",
        err: err
    })
}
