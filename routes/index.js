var express = require('express')
var app = express()

app.get('/', function(req, res){
    res.render('index', {title: 'NodeJS CRUD App'})
})

module.exports = app