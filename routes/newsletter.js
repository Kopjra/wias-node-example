var express = require('express');
var router = express.Router();

/* GET newsletter page. */
router.get('/', function(req, res, next) {
  res.render('newsletter', { title: 'Express Newsletter', ip: req.connection.remoteAddress });
});

router.post('/subscribe', function(req, res, next) {
  if (!req.body.email || req.body.consent!=="on") {
    res.render('newsletter_after', { title: 'Express Newsletter', mess: 'Validation failed!', ip: req.connection.remoteAddress, email: req.body.email });
  } else {
      // Your business logic here
      res.render('newsletter_after', { title: 'Express Newsletter', mess: 'Thank you for subscribing!', ip: req.connection.remoteAddress, email: req.body.email });
  }
});

module.exports = router;
