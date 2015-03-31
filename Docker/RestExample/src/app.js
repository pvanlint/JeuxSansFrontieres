var newrelic = require('newrelic');
var app = require('express')();
 
app.get('/user/:id', function (req, res) {
    res.render('user');
});
app.listen(5001);

