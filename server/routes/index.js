var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("index");

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: 'BLOODSHARE'
	});
});

module.exports = router;