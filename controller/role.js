let express = require('express');
let router = express.Router();
const successResponse = require('../common/responses').successResponse;
const errorResponse = require('../common/responses').errorResponse;
const Role = require('../models/Role');

router.createRole = function(req, res) {
    let role = new Role({
        name: req.body.name,
    });
    role.save().then((data) => {
        return successResponse(res, "Role created successfully", data)
    }).catch((e) => {
        return errorResponse(res, e.message)
    })
};


router.getRole = function(req, res) {
    Role.find().then((data) => {
        return successResponse(res, "Role list retrieved successfully", data)
    }).catch((err) => {
        return errorResponse(res, err.message)
    })
}

module.exports = router;