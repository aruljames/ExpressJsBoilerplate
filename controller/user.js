let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let express = require('express');
const bcrypt = require('bcrypt');
const config = require('../config/database.config');
const User = require('../models/User');
const Role = require('../models/Role');
const successResponse = require('../common/responses').successResponse;
const failureResponse = require('../common/responses').failureResponse;
const errorResponse = require('../common/responses').errorResponse;
var events = require('events');
var eventEmitter = new events.EventEmitter();
let router = express.Router();

eventEmitter.on('login_success', () => {
    console.log("Login successfully")
});

eventEmitter.on('login_fail', () => {
    console.log("Login failed")
});


router.createUser = function(req, res) {
    if(!req.body.name || !req.body.username || !req.body.role || !req.body.password) {
        return failureResponse(res, "Please provide all values")
    }
    User.findOne({username: req.body.username}).then(async (userData) => {
        if(userData && userData.length != 0) {
            return failureResponse(res, "Already Existing")
        } else {
            role_name = req.body.role;
            return await Role.findOne({name: role_name})
        }
    }).then(async (roleData) => {
        if(roleData && roleData.length == 0) {
            let role = new Role({
                name: role_name
            })
            await role.save().then(async (roleData) => {
                let user = new User({
                    name: req.body.name,
                    username: req.body.username,
                    role: roleData.id,
                    password: req.body.password
                })
                return await user.save();
            })
        } else {
            let user = new User({
                name: req.body.name,
                username: req.body.username,
                role: roleData.id,
                password: req.body.password
            })
            return await user.save();
        }
    }).then((data) => {
        var token = jwt.sign({ id: data._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        return successResponse(res, "New user created", {user_id: data._id, token: token})
    }).catch((err) => {
        return errorResponse(res, err.message)
    });
};


router.login = function(req, res) {
    if(!req.body.username || !req.body.password) {
        return failureResponse(res, "Please provide user and password")
    }
    User.findOne({username: req.body.username}).then((userData) => {
        if(userData && userData.length != 0) {
            var token = jwt.sign({ id: userData._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            if(bcrypt.compareSync(req.body.password, userData.password)) {
                eventEmitter.emit('login_success')
                return successResponse(res, "Login successful", {user_id: userData._id, token: token})
            } else {
                eventEmitter.emit('login_fail')
                return failureResponse(res, "Invalid credentials")
            }
        } else {
            return failureResponse(res, "Invalid username or password")
        }
    }).catch((err) => {
        return errorResponse(res, err.message)
    })
}


router.getUser = function(req, res) {
    if(req.params.id) {
        condition = {_id: mongoose.Types.ObjectId(req.params.id)}
    } else {
        condition = {}
    }
    User.find(condition, {password:0, created_at:0, updated_at:0}).populate('role').then((data) => {
        return successResponse(res, "User List retrieved successfully", data)
    }).catch((err) => {
        return errorResponse(res, err.message)
    })
};

module.exports = router;