var express = require('express');
var request = require('request');
var jade = require('jade');
var router = express.Router();

var WEBAPP_HOSTNAME = process.env.WEBAPP_HOSTNAME;
var WIAS_APIKEY = process.env.WIAS_APIKEY;

/* GET newsletter page. */
router.get('/', function(req, res, next) {

    // Creates template
    var template = jade.compileFile('./views/newsletter.jade');

    // Uses the template to generate HTML
    var html = template({ title: 'Express Newsletter', error: null, success: null, ip: req.connection.remoteAddress });

    // Replaces static files location
    html = html.replace(/\/public\//gm, WEBAPP_HOSTNAME + "/public/");

    // Requests the forward URL to WIAS
    request({
        url: "https://gateway.wias.kopjra.com/api/interactions",
        method: "post",
        headers: {
            "Authorization": WIAS_APIKEY,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: {
            "oURL": WEBAPP_HOSTNAME + "/newsletter/subscribe",
            "oMethod": "POST",
            "prerenderedHtml": html
        },
        json: true
    }, function(error, response, body){
        if(error){
            /*
             * Here you handle a failed request to WIAS: it's up to you to decide what to do.
             * For example you can decide to fallback using your old registration procedure or
             * you can decide to fail the request, like in this example.
             */
            next(new Error("We are sorry, but we cannot handle your subscription at the moment!"));
        } else {
            res.redirect(302, body.fUrl);
        }
    });
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
