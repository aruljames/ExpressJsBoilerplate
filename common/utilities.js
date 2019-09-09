let express = require('express');
let jwt = require('jsonwebtoken');
const config = require('../config/database.config');
let unauthorizedResponse = require('./responses').unauthorizedResponse;
let errorResponse = require('./responses').errorResponse;
let router = express.Router();

router.verifyToken = function(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) return unauthorizedResponse(res, "No token provided");
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return errorResponse(res, "Failed to authenticate token");
      next();
    });
}

module.exports = router;