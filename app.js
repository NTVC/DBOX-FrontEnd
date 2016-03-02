var express = require('express');
var app = express();
var path = require('path');

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '')));

app.get('/', function(req, res) {
    res.render('app.html');
});

app.listen(80, '0.0.0.0')//dev 80