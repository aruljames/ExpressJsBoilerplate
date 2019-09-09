let express = require('express');
let router = express.Router();

router.unauthorizedResponse = function(res, message) {
    return res.status(401).json({
        status: "Failure",
        message: message
    })
}

router.successResponse = function(res, message, data={}) {
    return res.status(200).json({
        status: "Success",
        message: message,
        data: data
    })
}

router.failureResponse = function(res, message) {
    return res.status(400).json({
        status: "Failure",
        message: message
    })
}

router.errorResponse = function(res, message) {
    return res.status(500).json({
        status: "Failure",
        message: message
    })
}

module.exports = router;