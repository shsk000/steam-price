const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/template'));

app.get('/', function(req, res) {
  res.render('index');
});
app.listen(3000, function() {});
