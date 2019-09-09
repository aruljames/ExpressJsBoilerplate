const express = require('express');
const role = require('../controller/role')
const user = require('../controller/user')
const utils = require('../common/utilities')

const router = express.Router();
router.post('/role', utils.verifyToken, role.createRole);
router.get('/role', utils.verifyToken, role.getRole);

router.post('/user', user.createUser);
router.get('/user', utils.verifyToken, user.getUser);
router.get('/user/:id', utils.verifyToken, user.getUser);
router.post('/login', user.login);
module.exports = router;