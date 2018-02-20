var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

router.route('/users')
	.get(userController.getList)
	.post(userController.create);
	
router.route('/user/:id')
	.get(userController.getById)
	.put(userController.update)
	.delete(userController.delete);

module.exports = router;
