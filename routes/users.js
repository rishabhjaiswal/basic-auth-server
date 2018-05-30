var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{id: 1, name: "Jon Doe"},
  {id: 2, name: "Wong Chigchui"}
  ]);
});

module.exports = router;
